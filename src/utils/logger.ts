import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path (e.g., logs/app-2025-09-27.log)
const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

// Format the log line
function format(level: string, message: string): string {
    const timestamp = `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`;
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
}

// Write log to file and console
function writeLog(level: string, message: string): void {
    const line = format(level, message);
    console.log(line);
    fs.appendFileSync(logFile, line + "\n", { encoding: 'utf8' });
}

// Export logger object
const logger = {
    /**
   * @param msg Informal Message to log in the record
   */
    info: (msg: string) => writeLog("info", msg),

    /**
    * @param msg Warning Message to log in the record
    **/
    warn: (msg: string) => writeLog("warn", msg),

    /**
    * @param msg Error Message to log in the record
    **/
    error: (msg: string) => writeLog("error", msg),
};

export default logger;
