import { ErrorReportingHandler } from './errorReporting';
import { JsonwebtokenAdapter } from './jsonwebtoken';
import { JwtAdapter } from './jwt.abstract';
import { LoggerAdapter } from './logger.abstract';
import { ReportAdapter } from './reports.abtract';
import { WinstonLoggerAdapter } from './winston';

export class Adapters {
	readonly logger: LoggerAdapter = new WinstonLoggerAdapter();
	readonly report: ReportAdapter = new ErrorReportingHandler();
	readonly jwt: JwtAdapter = new JsonwebtokenAdapter();
}
