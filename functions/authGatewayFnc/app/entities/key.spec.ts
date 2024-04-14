import { Key } from './key';
import { keyFactory } from '@tests/factories/key';

describe('Key test', () => {
	it('should be able to create a key', () => {
		const routeMap = keyFactory();
		expect(routeMap).toBeInstanceOf(Key);
	});
});
