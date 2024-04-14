import {
	type KeyRepo,
	type KeysEnum,
} from '@functions/authGatewayFnc/app/repositories/keyRepo.abstract';
import { type Adapters } from '@functions/authGatewayFnc/app/adapters';
import { type Key } from '@functions/authGatewayFnc/app/entities/key';
import { type FirestoreService } from '../..';
import { FirestoreErr } from '../../err/firestoreErr';
import { firestoreKeyDTO } from '../../dto/key.dto';
import { FirestoreKeyMapper, type IToFlatReturn } from '../../mapper/key';
import { type TraceHandler } from '@functions/authGatewayFnc/infra/configs/tracing';

export class FirestoreKey implements KeyRepo {
	constructor(
		private readonly firestore: FirestoreService,
		private readonly adapters: Adapters,
		private readonly tracer: TraceHandler,
	) {}

	async getSignature(name: KeysEnum): Promise<Key> {
		const tracer = this.tracer.getTracer('Firestore key process');
		const span = tracer.startSpan('Firestore - read key');
		span.setAttribute('key', name);

		const database = this.firestore.instance;
		const signaturesCollection = database.collection('secrets');

		const rawSignature = await signaturesCollection.doc(name).get();
		const semiParsedSignature = firestoreKeyDTO(rawSignature.data(), () => {
			const err = new FirestoreErr(
				`A chave com o nome "${name}" não foi encontrada`,
			);
			span.recordException({ ...err, code: 500 });
			span.end();
			this.adapters.logger.fatal({
				name: err.name,
				description: err.message,
			});

			this.adapters.report.error({ err });
			throw err;
		});

		span.end();

		const semiParsedFlatKey = {
			name: rawSignature.id,
			...semiParsedSignature,
		} as IToFlatReturn;

		return FirestoreKeyMapper.fromFlatToClass(semiParsedFlatKey);
	}
}
