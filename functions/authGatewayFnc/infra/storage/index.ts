import { type KeyRepo } from '@functions/authGatewayFnc/app/repositories/keyRepo.abstract';
import { FirestoreService } from './firestore';
import { type CondominiumMemberRepo } from '@functions/authGatewayFnc/app/repositories/condominiumMemberRepo.abstract';
import { type Adapters } from '@functions/authGatewayFnc/app/adapters';
import { type TraceHandler } from '../configs/tracing';
import { FirestoreRouteRepo } from './firestore/repositories/routeRepo';
import { type RouteRepo } from '@functions/authGatewayFnc/app/repositories/routeRepo.abstract';
import { FirestoreKey } from './firestore/repositories/keyRepo';
import { PgHandler } from './pg';
import { PgCondominiumMemberRepo } from './pg/repositories/condominiumMember';

export class Storages {
	readonly keyRepo: KeyRepo;
	readonly routeRepo: RouteRepo;
	readonly condominiumMemberRepo: CondominiumMemberRepo;

	constructor(
		private readonly adapters: Adapters,
		private readonly tracer: TraceHandler,
	) {
		const pgHandler = new PgHandler();
		this.condominiumMemberRepo = new PgCondominiumMemberRepo(
			pgHandler,
			this.tracer,
		);

		const firestoreService = new FirestoreService();
		this.routeRepo = new FirestoreRouteRepo(firestoreService, this.tracer);
		this.keyRepo = new FirestoreKey(
			firestoreService,
			this.adapters,
			this.tracer,
		);
	}
}
