import { globalConstants } from '@functions/constants';
import { Pool } from 'pg';

globalConstants.POSTGRES.IS_CONNECTED = false;

export class PgHandler {
	private readonly _instance: Pool;

	constructor() {
		if (!globalConstants.POSTGRES.IS_CONNECTED) {
			const config = new URL(process.env.DATABASE_URL!);
			globalConstants.POSTGRES.CLIENT = new Pool({
				host: config.hostname,
				user: config.username,
				password: config.password,
				port: parseInt(config.port),
				database: config.pathname.substring(1),
				ssl: process.env.DATABASE_SSL
					? {
						rejectUnauthorized: true,
					}
					: false,
			});

			globalConstants.POSTGRES.IS_CONNECTED = true;

			const end = async () => globalConstants.POSTGRES.CLIENT!.end();

			process.on('SIGTERM', end);
			process.on('SIGINT', end);
			process.on('SIGBREAK', end);
		}

		this._instance = globalConstants.POSTGRES.CLIENT!;
	}

	get instance() {
		return this._instance;
	}
}
