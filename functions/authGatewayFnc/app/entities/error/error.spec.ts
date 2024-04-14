import { EntitieError } from '.';

describe('Entitie error test', () => {
	it('should be able to create a entitie error', () => {
		const entityErr = new EntitieError({
			message: 'message',
			entity: 'Entity',
		});
		const voErr = new EntitieError({
			message: 'message',
			entity: 'VO',
		});

		expect(entityErr.name).toEqual('Entity Error');
		expect(entityErr.message).toEqual('message');

		expect(voErr.name).toEqual('Value Object Error');
		expect(voErr.message).toEqual('message');
	});
});
