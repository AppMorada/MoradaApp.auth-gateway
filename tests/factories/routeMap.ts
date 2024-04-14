import { RouteMap } from "../../functions/authGatewayFnc/app/entities/routeMap";

type TOverride = Partial<RouteMap>

export function routeMapFactory(input: TOverride = {}) {
	return new RouteMap({
		name: 'Some Route',
		url: new URL('http://localhost:8411/'),
		aclRoleBased: 1,
		...input
	})
}
