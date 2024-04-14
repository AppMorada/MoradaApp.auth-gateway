import { type Adapters } from './authGatewayFnc/app/adapters';

export class ErrorListener {
	constructor(private readonly adapters: Adapters) {}

	listen() {
		const errorTypes = ['uncaughtException', 'unhandledRejection'];

		errorTypes.forEach((item) => {
			process.on(item, (err) => {
				this.adapters.report.error({ err });
				this.adapters.logger.fatal({
					name: err?.name,
					message: err?.message,
					stack: err?.stack,
				});
			});
		});
	}
}
