import { RouteRepo } from '@functions/authGatewayFnc/app/repositories/routeRepo.abstract';
import { RouteMap } from '@functions/authGatewayFnc/app/entities/routeMap';
import { TraceHandler } from '@functions/authGatewayFnc/infra/configs/tracing';
import { FirestoreService } from '../..';
import { RouteMapDTO } from '../../dto/routeMap.dto';

export class FirestoreRouteRepo implements RouteRepo {
	constructor(
		private readonly firestoreService: FirestoreService,
		private readonly tracer: TraceHandler,
	) {
		this.collectionRef =
			this.firestoreService.instance.collection('route-map');
	}

	private routesMap: RouteMap[] = [];
	private readonly collectionRef;
	private isFirstQuery = true;

	async listenChanges() {
		if (this.isFirstQuery) {
			const collection = await this.collectionRef.get();

			collection.forEach((doc) => {
				const tracer = this.tracer.getTracer(
					'Firestore route map process',
				);
				const span = tracer.startSpan('Firestore - load route mapping');
				if (!doc.exists) return span.end();

				const rawRouteMap = RouteMapDTO.validate({
					name: doc.id,
					...doc.data(),
				});

				this.routesMap.push(
					new RouteMap({
						name: rawRouteMap.name,
						url: new URL(rawRouteMap.url),
						aclRoleBased: rawRouteMap.aclRoleBased,
					}),
				);

				span.end();
			});
		}
	}

	async getAll(): Promise<RouteMap[]> {
		await this.listenChanges();
		return this.routesMap;
	}
}
