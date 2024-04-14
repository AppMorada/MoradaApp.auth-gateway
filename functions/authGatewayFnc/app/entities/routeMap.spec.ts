import { routeMapFactory } from '@tests/factories/routeMap';
import { RouteMap } from './routeMap';

describe('Route Map test', () => {
	it('should be able to create a route map', () => {
		const routeMap = routeMapFactory();
		expect(routeMap).toBeInstanceOf(RouteMap);
	});
});
