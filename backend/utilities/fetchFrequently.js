import cron from "node-cron";
import {
  updateTrending,
  updateUpcoming,
} from "../controllers/tmdbController.js";

cron.schedule("*/30 * * * *", async () => {
  console.log(`⏰ [${new Date().toISOString()}] Running content cache...`);

  try {
    await updateTrending();
    console.log("✅ Trending content updated.");
  } catch (err) {
    console.error("❌ Failed to update trending:", err.code || err.message);
  }

  try {
    await updateUpcoming();
    console.log("✅ Upcoming content updated.");
  } catch (err) {
    console.error("❌ Failed to update upcoming:", err.code || err.message);
  }
});