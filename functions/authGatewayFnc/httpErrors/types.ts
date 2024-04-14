import { type Response } from '@google-cloud/functions-framework';

export type IHttpErrorCallback = {
	err: {
		name: string;
		message: string;
		statusCode: number;
	};
};

export type IHttpErrorProps = {
	res: Response;
	err?: {
		name?: string;
		message?: string;
		statusCode?: number;
	};
	callback: (input: IHttpErrorCallback) => void;
};
