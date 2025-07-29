import 'reflect-metadata'; 
import "./core/config/container";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import app from './app';

const APP_URL = process.env.APP_URL;
const PORT = process.env.APP_PORT || 3000;

app.use(cors({
  origin: true, 
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Server running on ${APP_URL}`);
});