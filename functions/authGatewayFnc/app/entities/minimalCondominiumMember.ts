import { UUID } from './VO/UUID';

type IProps = {
	role: number;
	userId?: UUID | undefined;
};

export type IMinimalCondominiumMemberInput = {
	role: number;
	userId?: string | undefined;
};

export class MinimalCondominiumMember {
	private readonly _id: UUID;
	private readonly props: IProps;

	constructor(input: IMinimalCondominiumMemberInput, id?: string) {
		this._id = id ? new UUID(id) : UUID.genV4();
		this.props = {
			role: input.role,
			userId: input.userId ? new UUID(input.userId) : undefined,
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

	set userId(input: UUID) {
		this.props.userId = input;
	}
}
