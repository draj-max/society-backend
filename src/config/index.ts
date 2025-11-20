import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/society';

export const accessTokenExp = '7d';
export const refreshTokenExp = '30d';

export const bcryptSaltRounds = 7;
