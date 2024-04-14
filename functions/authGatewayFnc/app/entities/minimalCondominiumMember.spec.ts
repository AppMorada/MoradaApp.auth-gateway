import { minimalCondominiumMemberFactory } from '@tests/factories/minimalCondominiumMember';
import { MinimalCondominiumMember } from './minimalCondominiumMember';

describe('Minimal Condominium Member test', () => {
	it('should be able to create a Minimal Condominium Member', () => {
		const condominiumMember = minimalCondominiumMemberFactory();
		expect(condominiumMember).toBeInstanceOf(MinimalCondominiumMember);
	});
});
