import { RouteMap } from '../entities/routeMap';

export abstract class RouteRepo {
	abstract getAll(): Promise<RouteMap[]>;
}
