import { KeysEnum } from '@functions/authGatewayFnc/app/repositories/keyRepo.abstract';
import { ServiceErrors } from '@functions/authGatewayFnc/app/services/error';
import {
	type IValidateTokenServiceReturnableData,
	type ValidateTokenService,
} from '@functions/authGatewayFnc/app/services/validateToken.service';
import { type Request } from '@google-cloud/functions-framework';
import { MiddlewareErrors } from './error';

type TReturnableContent = void | IValidateTokenServiceReturnableData;

type IProps = {
	req: Request;
	callbackErr: (err: Error) => void;
};

export class ScanJwtMiddleware {
	constructor(private readonly validateToken: ValidateTokenService) {}

	async exec({ req, callbackErr }: IProps): Promise<TReturnableContent> {
		const token = req.headers?.authorization?.split('Bearer ')?.[1];
		if (!token) {
			callbackErr(new MiddlewareErrors('Token inválido'));
			return;
		}

		const result: TReturnableContent = await this.validateToken
			.exec({
				token,
				name: KeysEnum.ACCESS_TOKEN_KEY,
			})
			.then((res) => res)
			.catch((err) => {
				if (err instanceof ServiceErrors) {
					callbackErr(new ServiceErrors(err.message));
					return;
				}

				throw err;
			});

		return result;
	}
}
