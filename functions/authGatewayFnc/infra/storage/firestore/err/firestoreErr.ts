export class FirestoreErr extends Error {
	constructor(message: string) {
		super();

		this.name = 'Firestore Error';
		this.message = message;
	}
}
