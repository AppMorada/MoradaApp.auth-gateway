import { InMemoryCondominiumMemberRepo } from '@tests/inMemoryDb/repositories/condominiumMember';
import { CheckCondominiumMemberService } from './checkCondominiumMember.service';
import { minimalCondominiumMemberFactory } from '@tests/factories/minimalCondominiumMember';
import { UUID } from '../entities/VO/UUID';

describe('Check Condominium Member Service', () => {
	let condominiumMemberRepo: InMemoryCondominiumMemberRepo;
	let sut: CheckCondominiumMemberService;

	beforeEach(() => {
		condominiumMemberRepo = new InMemoryCondominiumMemberRepo();
		sut = new CheckCondominiumMemberService(condominiumMemberRepo);
	});

	it('should be able to check condominium member existence', async () => {
		const condominiumMember = minimalCondominiumMemberFactory();
		condominiumMemberRepo.condominiumMembers.push(condominiumMember);

		expect(
			sut.exec({
				aclRoleBased: condominiumMember.role,
				condominiumId: condominiumMember.condominiumId,
				decodedToken: {
					sub: condominiumMember?.userId?.value,
				},
			}),
		).resolves.toEqual(true);
		expect(condominiumMemberRepo.calls.existByRole).toEqual(1);
	});

	it('should be able to throw one error - acl is not acceptable', async () => {
		const condominiumMember = minimalCondominiumMemberFactory({
			role: 0,
		});
		condominiumMemberRepo.condominiumMembers.push(condominiumMember);

		expect(
			sut.exec({
				aclRoleBased: 1,
				condominiumId: condominiumMember.condominiumId,
				decodedToken: {
					sub: condominiumMember?.userId?.value,
				},
			}),
		).resolves.toBe(false);
		expect(condominiumMemberRepo.calls.existByRole).toEqual(1);
	});

	it('shoult be able to throw one erro - sub is undefined', async () => {
		expect(
			sut.exec({
				aclRoleBased: 1,
				condominiumId: UUID.genV4(),
			}),
		).resolves.toEqual(false);
	});
});
