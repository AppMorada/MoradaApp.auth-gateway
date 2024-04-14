import { type Storages } from '@functions/authGatewayFnc/infra/storage';
import { ValidateTokenService } from './validateToken.service';
import { CheckCondominiumMemberService } from './checkCondominiumMember.service';
import { type Adapters } from '../adapters';

export class Services {
	constructor(
		private readonly storages: Storages,
		private readonly adapters: Adapters,
	) {}

	readonly validateToken = new ValidateTokenService(
		this.storages.keyRepo,
		this.adapters.jwt,
	);

	readonly checkCondominiumMember = new CheckCondominiumMemberService(
		this.storages.condominiumMemberRepo,
	);
}
