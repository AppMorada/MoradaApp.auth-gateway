import { type LoggerAdapter } from '../logger.abstract';
import winston from 'winston';

export class WinstonLoggerAdapter implements LoggerAdapter {
	private readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			levels: {
				emergency: 0,
				error: 1,
				warn: 2,
				info: 3,
				debug: 4,
			},
			format: winston.format.printf((info) => {
				return `${JSON.stringify({
					timestamp: info.timestamp,
					severity: info.level.toUpperCase(),
					data: { ...info.message },
				})}`;
			}),
			transports: [new winston.transports.Console()],
		});
	}

	info(input: any) {
		this.logger.info({ message: input });
	}

	warn(input: any) {
		this.logger.warn({ message: input });
	}

	debug(input: any) {
		this.logger.debug({ message: input });
	}

	error(input: any) {
		this.logger.error({ message: input });
	}

	fatal(input: any) {
		this.logger.log('emergency', { message: input });
	}
}
