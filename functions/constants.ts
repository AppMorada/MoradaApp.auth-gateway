import { Firestore } from 'firebase-admin/firestore';
import { Key } from './authGatewayFnc/app/entities/key';
import { Pool } from 'pg';
import { TraceHandler } from './authGatewayFnc/infra/configs/tracing';

interface IGlobalConstants {
	POSTGRES: {
		CLIENT?: Pool;
		IS_CONNECTED?: boolean;
	};
	FIRESTORE: {
		INSTANCE?: Firestore;
		IS_WATCHING_KEY_CHANGES?: boolean;
	};
	KEYS: Key[];
	TELEMETRY: {
		INSTANCE?: TraceHandler;
	};
}

export const globalConstants: IGlobalConstants = {
	POSTGRES: {},
	FIRESTORE: {},
	KEYS: [],
	TELEMETRY: {},
};
