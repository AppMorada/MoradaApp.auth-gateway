import { FirestoreErr } from '../err/firestoreErr';

export type IRouteMapDTOReturnableData = {
	name: string;
	url: string;
	aclRoleBased?: number;
};

export class RouteMapDTO {
	static validate(input: any): IRouteMapDTOReturnableData {
		const schema = [
			{
				errMessage: 'Name precisa ser string',
				isValid: typeof input.name === 'string',
			},
			{
				errMessage: 'Url precisa ser string',
				isValid: typeof input.url === 'string',
			},
			{
				errMessage: 'ACL Role Based precisa ser um número',
				isValid:
					typeof input.aclRoleBased === 'number' ||
					typeof input.aclRoleBased === 'undefined',
			},
		];

		schema.forEach((item) => {
			if (!item.isValid) throw new FirestoreErr(item.errMessage);
		});

		return input as IRouteMapDTOReturnableData;
	}
}
