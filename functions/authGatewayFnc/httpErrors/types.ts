import { Response } from '@google-cloud/functions-framework';

export interface IHttpErrorCallback {
	err: {
		name: string;
		message: string;
		statusCode: number;
	};
}

export interface IHttpErrorProps {
	res: Response;
	err?: {
		name?: string;
		message?: string;
		statusCode?: number;
	};
	callback: (input: IHttpErrorCallback) => void;
}
