import { type Services } from '@functions/authGatewayFnc/app/services';
import { ScanJwtMiddleware } from './scanJwtToken.middleware';

export class Middlewares {
	constructor(private readonly services: Services) {}

	readonly scanJwt = new ScanJwtMiddleware(this.services.validateToken);
}
