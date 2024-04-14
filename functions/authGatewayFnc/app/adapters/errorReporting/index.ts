import { ErrorReporting } from '@google-cloud/error-reporting';
import { IReportError, ReportAdapter } from '../reports.abtract';

export class ErrorReportingHandler implements ReportAdapter {
	private readonly handler?: ErrorReporting;

	constructor() {
		if (process.env.OBSERVER_AGENT)
			this.handler = new ErrorReporting({
				projectId: process.env.LOGGING_PROJECT,
				logLevel: 2,
				reportMode: 'production',
				credentials: JSON.parse(process.env.OBSERVER_AGENT as string),
				serviceContext: {
					service: process.env.SERVICE_NAME,
					version: process.env.SERVICE_VERSION,
				},
			});
	}

	error({ err, callback, ...rest }: IReportError) {
		if (this.handler)
			return this.handler.report(err, rest, undefined, callback);

		if (callback) callback();
	}
}
