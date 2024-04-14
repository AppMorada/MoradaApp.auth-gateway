import { FirestoreErr } from './firestoreErr';

describe('Firestore error test', () => {
	it('should be able to create a firestore error', () => {
		const err = new FirestoreErr('message');

		expect(err.name).toEqual('Firestore Error');
		expect(err.message).toEqual('message');
	});
});
