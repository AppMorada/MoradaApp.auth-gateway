import { type Firestore } from 'firebase-admin/firestore';
import { type Key } from './authGatewayFnc/app/entities/key';
import { type Pool } from 'pg';
import { type TraceHandler } from './authGatewayFnc/infra/configs/tracing';

type IGlobalConstants = {
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
};

export const globalConstants: IGlobalConstants = {
	POSTGRES: {},
	FIRESTORE: {},
	KEYS: [],
	TELEMETRY: {},
};
