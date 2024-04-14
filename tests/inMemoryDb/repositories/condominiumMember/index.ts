import {type MinimalCondominiumMember} from '@functions/authGatewayFnc/app/entities/minimalCondominiumMember';
import {type CondominiumMemberRepo, type IExistByRole} from '@functions/authGatewayFnc/app/repositories/condominiumMemberRepo.abstract';

export class InMemoryCondominiumMemberRepo implements CondominiumMemberRepo {
	calls = {
		existByRole: 0,
	};

	condominiumMembers: MinimalCondominiumMember[] = [];

	async existByRole(input: IExistByRole): Promise<boolean> {
		++this.calls.existByRole;

		const searchedMember = this.condominiumMembers.find((item) => (
			item.userId?.value === input.userId.value &&
      input.aclRoleBased <= item.role &&
      item.userId?.value
		));

		return Boolean(searchedMember);
	}
}
