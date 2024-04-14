import { type UUID } from '../entities/VO/UUID';

export type IExistByRole = {
	userId: UUID;
	aclRoleBased: number;
};

export abstract class CondominiumMemberRepo {
	abstract existByRole(input: IExistByRole): Promise<boolean>;
}
