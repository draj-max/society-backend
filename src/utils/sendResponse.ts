import { Response } from 'express';

const sendResponse = (res: Response, code: number, message: string, data?: any) => {
    res.status(code).json({
        code,
        message,
        data,
    });
};

export default sendResponse;
