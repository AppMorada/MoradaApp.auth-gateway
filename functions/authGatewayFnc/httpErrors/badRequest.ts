import { type IHttpErrorProps } from './types';

export class BadRequest {
	static buildResponse(input: IHttpErrorProps) {
		const err = {
			name: input?.err?.name ?? 'Requisição Ruim',
			message: input?.err?.message ?? 'Verifique as informações obtidas',
			statusCode: input?.err?.statusCode ?? 400,
		};

		input.res.status(err.statusCode).json({
			name: 'Requisição Ruim',
			message: 'Verifique as informações obtidas',
			statusCode: err.statusCode,
		});

		input.callback({ err });
	}
}
