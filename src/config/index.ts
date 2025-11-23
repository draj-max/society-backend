import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT as string;
export const DB_URI = process.env.DB_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const accessTokenExp = '7d';
export const refreshTokenExp = '30d';

export const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

// user roles
export const user: string = 'user';
export const superAdmin: string = 'superAdmin';
export const societyAdmin: string = 'societyAdmin';

// bill categories
export const billCategories: string[] = ['maintenance', 'water', 'electricity', 'others'];
export const billStatus: string[] = ['unpaid', 'pending', 'paid'];
