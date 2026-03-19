/**
 * Scoped Logger for Development mode.
 * Follows the project standards for technical logging.
 */

class ScopedLogger {
    private scope: string;

    constructor(scope: string) {
        this.scope = scope;
    }

    private formatMessage(level: string, message: string): string {
        return `[${level}] [${this.scope}] ${message}`;
    }

    info(message: string, ...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.log(this.formatMessage('INFO', message), ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(this.formatMessage('WARN', message), ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.error(this.formatMessage('ERROR', message), ...args);
        }
    }
}

export const createLogger = (scope: string) => new ScopedLogger(scope);
