import { UUID } from "@functions/authGatewayFnc/app/entities/VO/UUID";
import { IMinimalCondominiumMemberInput, MinimalCondominiumMember } from "@functions/authGatewayFnc/app/entities/minimalCondominiumMember";

type TOverride = Partial<IMinimalCondominiumMemberInput> & { id?: string | null }

export function minimalCondominiumMemberFactory(input: TOverride = {}) {
	return new MinimalCondominiumMember({
		userId: UUID.genV4().value,
		role: 1,
		...input
	})
}
