import express from 'express';
import 'dotenv/config'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import tmdbRoutes from './routes/tmdbRoutes.js'
import wishListRoutes from './routes/wishlistRoutes.js'
import './utilities/fetchFrequently.js';
import './utilities/sleepPreventer.js'

const PORT = process.env.PORT || 4000

const app = express();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cinewish.deno.dev",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/wishlist", wishListRoutes);


app.get("/", (req, res) => {
    res.json({ message: "Server Ping"})
})


app.listen(PORT, ()=>{
    console.log(`Server running: http://localhost:${PORT}`)
})