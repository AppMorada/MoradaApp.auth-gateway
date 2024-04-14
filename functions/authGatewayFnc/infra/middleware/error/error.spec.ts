import { MiddlewareErrors } from '.';

describe('Middleware error test', () => {
	it('should be able to create a middleware error', () => {
		const err = new MiddlewareErrors('message');

		expect(err.name).toEqual('Middleware Error');
		expect(err.message).toEqual('message');
	});
});
