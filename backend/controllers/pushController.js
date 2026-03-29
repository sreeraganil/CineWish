import User from "../models/userModel.js";
import { webpush } from "../services/push.js";

// ➜ Subscribe user (Saves to DB)
export const subscribe = async (req, res) => {
  const sub = req.body;
  const userId = req.user.id; // Assuming you have auth middleware

  if (!sub?.endpoint) {
    return res.status(400).json({ error: "Invalid subscription" });
  }

  try {
    // Find user and add subscription if the endpoint is unique
    const user = await User.findById(userId);
    
    const isAlreadySubscribed = user.pushSubscriptions.some(
      (existing) => existing.endpoint === sub.endpoint
    );

    if (!isAlreadySubscribed) {
      user.pushSubscriptions.push(sub);
      await user.save();
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("DB Save Error:", err);
    res.status(500).json({ error: "Failed to store subscription" });
  }
};

// ➜ Send push to ALL users (Admin)
export const sendPush = async (req, res) => {
  const { title, body, url, image } = req.body;
  const payload = JSON.stringify({ title, body, url, image });

  try {
    // Get all users who have at least one subscription
    const users = await User.find({ "pushSubscriptions.0": { $exists: true } });

    for (const user of users) {
      const remainingSubs = [];

      for (const sub of user.pushSubscriptions) {
        try {
          await webpush.sendNotification(sub, payload);
          remainingSubs.push(sub); // Keep valid ones
        } catch (err) {
          // If 410 (Gone) or 404 (Not Found), we skip adding it to remainingSubs (deleting it)
          if (err.statusCode !== 410 && err.statusCode !== 404) {
            remainingSubs.push(sub); 
          }
          console.error(`Push failed for ${user.username}:`, err.statusCode);
        }
      }

      // Update user with only valid subscriptions
      user.pushSubscriptions = remainingSubs;
      await user.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Broadcasting failed" });
  }
};


// ➜ Test route
export const testPush = async (req, res) => {
  const payload = JSON.stringify({
    title: "Notiication Test !",
    body: "Push is working across your devices!",
  });

  try {
    // 1. Find all users who have at least one subscription in their array
    const users = await User.find({ "pushSubscriptions.0": { $exists: true } });

    if (users.length === 0) {
      return res.status(404).send("No subscribers found in database.");
    }

    // 2. Map through users and their subscriptions
    const pushPromises = users.flatMap((user) =>
      user.pushSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, payload);
        } catch (err) {
          console.error(`Push error for user ${user.username}:`, err.statusCode);

          // 3. Auto-cleanup: If the subscription is expired (410) or not found (404)
          if (err.statusCode === 410 || err.statusCode === 404) {
            await User.updateOne(
              { _id: user._id },
              { $pull: { pushSubscriptions: { endpoint: sub.endpoint } } }
            );
            console.log(`Cleaned up expired subscription for ${user.username}`);
          }
        }
      })
    );

    await Promise.all(pushPromises);

    res.send(`Test push sent to ${pushPromises.length} device(s).`);
  } catch (err) {
    console.error("Test push failed:", err);
    res.status(500).send("Error sending push");
  }
};