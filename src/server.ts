import { PORT } from './config';
import apiRoutes from './routes';
import express, { NextFunction, Request, Response } from 'express';

import logger from './utils/logger';
import { connectDB } from './utils/db';
import sendResponse from './utils/sendResponse';

const app = express();

// Middleware
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// db connection
(async () => {
    try {
        await connectDB();
    } catch (err) {
        logger.error('Failed to connect to DB, exiting...');
        process.exit(1);
    }
})();

// api routes for user
app.use('/api', apiRoutes);

app.get('/test', (req: Request, res: Response) => {
    res.send(`${req.method} => ${req.url} : Hey There!`);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`❌ Error: ${err.message}`);
    return sendResponse(res, 404,
        `The requiested api route=> ${req.url} is not found to be exist.`,
        { requested_route: req.url }
    );
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});

// The server terminates request that exceeds the timeout
server.setTimeout(3 * 60 * 1000); // 180000 ms
