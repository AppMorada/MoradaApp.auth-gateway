import { UUID } from './VO/UUID';

interface IProps {
	role: number;
	userId?: UUID | null;
}

export interface IMinimalCondominiumMemberInput {
	role: number;
	userId?: string | null;
}

export class MinimalCondominiumMember {
	private readonly _id: UUID;
	private props: IProps;

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

	get userId(): UUID | null | undefined {
		return this.props.userId;
	}
	set userId(input: UUID) {
		this.props.userId = input;
	}
}
