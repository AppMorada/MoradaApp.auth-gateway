import { type IHttpErrorProps } from './types';

export class Unauthorized {
	static buildResponse(input: IHttpErrorProps) {
		const err = {
			name: input?.err?.name ?? 'Não autorizado',
			message:
				input?.err?.message ??
				'Você não tem autorização para acessar este serviço',
			statusCode: input?.err?.statusCode ?? 401,
		};

		input.res.status(err.statusCode).json({
			name: err.name,
			message: err.message,
			statusCode: err.statusCode,
		});

		input.callback({ err });
	}
}
