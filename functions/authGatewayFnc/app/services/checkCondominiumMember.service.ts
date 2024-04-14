import { UUID } from '../entities/VO/UUID';
import { type CondominiumMemberRepo } from '../repositories/condominiumMemberRepo.abstract';

type IProps = {
	aclRoleBased: number;
	condominiumId: UUID;
	decodedToken?: {
		sub?: string;
	};
};

export class CheckCondominiumMemberService {
	constructor(private readonly condominiumRepo: CondominiumMemberRepo) {}

	async exec({
		aclRoleBased,
		decodedToken,
		condominiumId,
	}: IProps): Promise<boolean> {
		if (typeof decodedToken?.sub !== 'string') return false;

		const member = await this.condominiumRepo.existByRole({
			userId: new UUID(decodedToken.sub),
			aclRoleBased,
			condominiumId,
		});

		if (!member) return false;

		return true;
	}
}
