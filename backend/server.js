import express from 'express';
import 'dotenv/config'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import tmdbRoutes from './routes/tmdbRoutes.js'
import wishListRoutes from './routes/wishlistRoutes.js'
import userRoutes from './routes/userRoutes.js'
import watchRoutes from './routes/watchRoutes.js'
import './utilities/fetchFrequently.js';
import './utilities/sleepPreventer.js'
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cinewish.deno.dev",
  "http://localhost:5000",
  "https://cinewish-web.onrender.com"
];


app.use(express.static(path.join(__dirname, 'dist')));

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
app.use("/api/user", userRoutes);
app.use("/api/watch", watchRoutes);


app.get("/ping", (req, res) => {
    res.json({ message: "Server Ping"})
})

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});




app.listen(PORT, ()=>{
    console.log(`Server running: http://localhost:${PORT}`)
})