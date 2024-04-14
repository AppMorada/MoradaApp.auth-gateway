import {
	CondominiumMemberRepo,
	IExistByRole,
} from '@functions/authGatewayFnc/app/repositories/condominiumMemberRepo.abstract';
import { PgHandler } from '..';
import { TraceHandler } from '@functions/authGatewayFnc/infra/configs/tracing';

export class PgCondominiumMemberRepo implements CondominiumMemberRepo {
	constructor(
		private readonly pg: PgHandler,
		private readonly tracer: TraceHandler,
	) {}

	async existByRole(input: IExistByRole): Promise<boolean> {
		const tracer = this.tracer.getTracer('TypeOrm process');
		const span = tracer.startSpan('TypeOrm read process');

		const q =
			'SELECT EXISTS(SELECT 1 FROM public.condominium_members WHERE user_id = $1 AND role >= $2);';

		const result = await this.pg.instance
			.query(q, [input.userId.value, input.aclRoleBased])
			.catch((err) => {
				span.recordException({
					name: err?.name,
					message: err?.message,
					stack: err?.stack,
					code: 500,
				});
				span.end();

				throw err;
			});

		span.end();

		const exists = result.rows[0]?.exists;

		return exists;
	}
}
