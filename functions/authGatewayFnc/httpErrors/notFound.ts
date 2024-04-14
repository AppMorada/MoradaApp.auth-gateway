import { IHttpErrorProps } from './types';

export class NotFound {
	static buildResponse(input: IHttpErrorProps) {
		const err = {
			name: input?.err?.name ?? 'Não encontrado',
			message: input?.err?.message ?? 'Este serviço não existe',
			statusCode: input?.err?.statusCode ?? 404,
		};

		input.res.status(err.statusCode).json({
			name: err.name,
			message: err.message,
			statusCode: err.statusCode,
		});

		input.callback({ err });
	}
}
