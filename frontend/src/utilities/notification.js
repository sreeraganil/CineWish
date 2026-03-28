import API from "../config/axios";

export const enableNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notifications blocked");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BBGhZLprpWwS596bo9Jdj0Uvr5mHPT3wIuSjO6xFpf8gppnu1vJQ_1zyPv31zs_tN9nob01zLpmoN3jTZUYV61c",
      });
    }

    // use your interceptor
    await API.post("/push/subscribe", subscription);

    console.log("Subscribed:", subscription);
  } catch (err) {
    console.error("Subscription failed:", err);
  }
};

