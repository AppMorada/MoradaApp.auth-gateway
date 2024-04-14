import { ErrorListener } from '../errorListener';
import { Request, Response } from '@google-cloud/functions-framework';
import { App } from './app';
import { InternalServerError } from './httpErrors/internalServer';

export const authGatewayFnc = async (req: Request, res: Response) => {
	const app = new App();

	new ErrorListener(app.adapters).listen();

	await app.exec(req, res).catch((err) => {
		InternalServerError.buildResponse({
			res,
			err,
			callback: () => {
				app.adapters.logger.error({
					name: err?.name,
					message: err?.message,
					stack: err?.stack,
				});
				app.adapters.report.error({
					err: {
						name: err?.name,
						message: err?.message,
						stack: err?.stack,
					},
				});
			},
		});
	});
};
