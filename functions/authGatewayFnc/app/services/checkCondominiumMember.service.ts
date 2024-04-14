import { UUID } from '../entities/VO/UUID';
import { type CondominiumMemberRepo } from '../repositories/condominiumMemberRepo.abstract';

type IProps = {
	aclRoleBased: number;
	decodedToken?: {
		sub?: string;
	};
};

export class CheckCondominiumMemberService {
	constructor(private readonly condominiumRepo: CondominiumMemberRepo) {}

	async exec({ aclRoleBased, decodedToken }: IProps): Promise<boolean> {
		if (typeof decodedToken?.sub !== 'string') return false;

		const member = await this.condominiumRepo.existByRole({
			userId: new UUID(decodedToken.sub),
			aclRoleBased,
		});

		if (!member) return false;

		return true;
	}
}
