import { UUID } from './VO/UUID';

type IProps = {
	role: number;
	userId?: UUID | undefined;
	condominiumId: UUID;
};

export type IMinimalCondominiumMemberInput = {
	role: number;
	userId?: string | undefined;
	condominiumId: string;
};

export class MinimalCondominiumMember {
	private readonly _id: UUID;
	private readonly props: IProps;

	constructor(input: IMinimalCondominiumMemberInput, id?: string) {
		this._id = id ? new UUID(id) : UUID.genV4();
		this.props = {
			role: input.role,
			userId: input.userId ? new UUID(input.userId) : undefined,
			condominiumId: new UUID(input.condominiumId),
		};
	}

	get id() {
		return this._id;
	}

	get role() {
		return this.props.role;
	}

	set role(input: number) {
		this.props.role = input;
	}

	get userId(): UUID | undefined {
		return this.props.userId;
	}

	set userId(input: UUID | undefined) {
		this.props.userId = input;
	}

	get condominiumId(): UUID {
		return this.props.condominiumId;
	}

	set condominiumId(input: UUID) {
		this.props.condominiumId = input;
	}
}
