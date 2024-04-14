import { IHttpErrorProps } from './types';

export class InternalServerError {
	static buildResponse(input: IHttpErrorProps) {
		const err = {
			name: input?.err?.name ?? 'Erro interno do servidor',
			message:
				input?.err?.message ??
				'Ooops! Alguma coisa está acontecendo nos bastidores!',
			statusCode: input?.err?.statusCode ?? 500,
		};

		input.res.status(err.statusCode).json({
			name: 'Erro interno do servidor',
			message: 'Ooops! Alguma coisa está acontecendo nos bastidores!',
			statusCode: err.statusCode,
		});

		input.callback({ err });
	}
}
