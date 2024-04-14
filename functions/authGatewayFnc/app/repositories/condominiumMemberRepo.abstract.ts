import { UUID } from '../entities/VO/UUID';

export interface IExistByRole {
	userId: UUID;
	aclRoleBased: number;
}

export abstract class CondominiumMemberRepo {
	abstract existByRole(input: IExistByRole): Promise<boolean>;
}
