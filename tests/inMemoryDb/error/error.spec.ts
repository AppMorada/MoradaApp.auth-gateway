import {InMemoryErrorDatabase} from '.';

describe('In Memory Database error test', () => {
	it('should be able to create a In Memory Database error', () => {
		const err = new InMemoryErrorDatabase('message');

		expect(err.name).toEqual('InMemoryDatabase Error');
		expect(err.message).toEqual('message');
	});
});
