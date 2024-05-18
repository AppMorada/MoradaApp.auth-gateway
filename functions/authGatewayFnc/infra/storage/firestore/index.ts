import { type Firestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { globalConstants } from '../../../../constants';

export class FirestoreService {
	private readonly ref: Firestore;

	constructor() {
		if (!globalConstants.FIRESTORE.INSTANCE) {
			initializeApp({
				projectId: process.env.FIRESTORE_GCP_PROJECT,
			});

			globalConstants.FIRESTORE.INSTANCE = admin.firestore();
			globalConstants.FIRESTORE.INSTANCE.settings({
				ignoreUndefinedProperties: true,
				databaseId: process.env.FIRESTORE_DATABASE_ID,
			});

			const terminate = async () =>
				globalConstants.FIRESTORE.INSTANCE!.terminate();

			process.on('SIGTERM', terminate);
			process.on('SIGINT', terminate);
			process.on('SIGBREAK', terminate);
		}

		this.ref = globalConstants.FIRESTORE.INSTANCE;
	}

	get instance(): Firestore {
		return this.ref;
	}

	async close() {
		await this.ref.terminate();
	}
}
