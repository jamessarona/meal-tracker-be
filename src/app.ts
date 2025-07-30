import express from 'express';
import userRouter from './modules/user/user.router';
import authRouter from './modules/auth/auth.router';
import mealTypeRouter from './modules/meal-type/meal-type.router';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorhandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/meal-types', mealTypeRouter);

app.use(errorHandler);

export default app;