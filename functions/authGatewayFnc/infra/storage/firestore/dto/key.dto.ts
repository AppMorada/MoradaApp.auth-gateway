import { FirestoreErr } from '../err/firestoreErr';

interface IReturnableValue {
	prev_Content: string;
	prev_BuildedAt: number;
	actual_Content: string;
	actual_BuildedAt: number;
	ttl: number;
	renewTime: number;
}

export function firestoreKeyDTO(
	body: any,
	callbackErr?: (err: FirestoreErr) => void,
): IReturnableValue {
	const schema = [
		{
			name: 'prev_Content',
			isValid:
				(typeof body?.['prev_Content'] === 'string' &&
					body['prev_Content'].length === 200) ||
				typeof body?.['prev_Content'] === 'undefined',
		},
		{
			name: 'prev_BuildedAt',
			isValid:
				typeof body?.['prev_BuildedAt'] === 'number' ||
				typeof body?.['prev_BuildedAt'] === 'undefined',
		},
		{
			name: 'actual_Content',
			isValid:
				typeof body?.['actual_Content'] === 'string' &&
				body['actual_Content'].length === 200,
		},
		{
			name: 'actual_BuildedAt',
			isValid: typeof body?.['actual_BuildedAt'] === 'number',
		},
		{
			name: 'ttl',
			isValid: typeof body?.['ttl'] === 'number' && body['ttl'] >= 1,
		},
		{
			name: 'renewTime',
			isValid:
				typeof body?.['renewTime'] === 'number' &&
				body['renewTime'] >= 1,
		},
	];

	schema.forEach((item) => {
		if (item.isValid) return;

		const err = new FirestoreErr('Malformed internal entity');
		if (!callbackErr) throw err;
		return callbackErr(err);
	});

	return body as IReturnableValue;
}
