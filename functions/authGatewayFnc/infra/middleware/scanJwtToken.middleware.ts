import { KeysEnum } from '@functions/authGatewayFnc/app/repositories/keyRepo.abstract';
import { ServiceErrors } from '@functions/authGatewayFnc/app/services/error';
import {
	IValidateTokenServiceReturnableData,
	ValidateTokenService,
} from '@functions/authGatewayFnc/app/services/validateToken.service';
import { Request } from '@google-cloud/functions-framework';
import { MiddlewareErrors } from './error';

type TReturnableContent = void | IValidateTokenServiceReturnableData;

interface IProps {
	req: Request;
	callbackErr: (err: Error) => void;
}

export class ScanJwtMiddleware {
	constructor(private readonly validateToken: ValidateTokenService) {}

	async exec({ req, callbackErr }: IProps): Promise<TReturnableContent> {
		const token = req.headers?.authorization?.split('Bearer ')?.[1];
		if (!token) return callbackErr(new MiddlewareErrors('Token inválido'));

		const result: TReturnableContent = await this.validateToken
			.exec({
				token,
				name: KeysEnum.ACCESS_TOKEN_KEY,
			})
			.then((res) => res)
			.catch((err) => {
				if (err instanceof ServiceErrors)
					return callbackErr(new ServiceErrors(err.message));

				throw err;
			});

		return result;
	}
}
