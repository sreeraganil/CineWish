import cron from "node-cron";
import axios from "axios";

cron.schedule('*/10 * * * *', async () => {
  try {
    await axios.get(`https://cinewish-new.onrender.com/ping`);
    const response = await axios.get(`https://cinewish-web.onrender.com/ping`);
    console.log(`Server: ${response.data.message}`);
  } catch (error) {
    console.error('Error calling /ping:', error.message);
  }
});
