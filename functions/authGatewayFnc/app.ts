import { type Request, type Response } from '@google-cloud/functions-framework';
import { Storages } from './infra/storage';
import httpProxy from 'http-proxy';
import { Adapters } from './app/adapters';
import { Services } from './app/services';
import { Unauthorized } from './httpErrors/unauthorized';
import { NotFound } from './httpErrors/notFound';
import { Middlewares } from './infra/middleware';
import { TraceHandler } from './infra/configs/tracing';
import { type Tracer } from '@opentelemetry/sdk-trace-base';
import { type IHttpErrorCallback } from './httpErrors/types';
import { globalConstants } from '@functions/constants';
import { RouteMap } from './app/entities/routeMap';
import { UUID } from './app/entities/VO/UUID';
import { BadRequest } from './httpErrors/badRequest';

const proxy = httpProxy.createProxyServer();

export class App {
	private readonly storages: Storages;
	readonly adapters: Adapters;
	private readonly services: Services;
	private readonly middlewares: Middlewares;
	private readonly tracer: TraceHandler;

	constructor() {
		if (!globalConstants.TELEMETRY.INSTANCE) {
			globalConstants.TELEMETRY.INSTANCE = new TraceHandler();
		}

		this.tracer = globalConstants.TELEMETRY.INSTANCE;
		this.adapters = new Adapters();
		this.storages = new Storages(this.adapters, this.tracer);
		this.services = new Services(this.storages, this.adapters);
		this.middlewares = new Middlewares(this.services);
	}

	private async getAvailableRoute(req: Request) {
		const url = new URL(req.url, `${req.protocol}://${req.headers.host}`);

		const availableRoutes = await this.storages.routeRepo.getAll();
		const nextRoute = availableRoutes.find(
			(route) => url.pathname.split('/')[1] === route.name,
		);
		return { nextRoute, requestUrl: url };
	}

	private useProxyServer(
		req: Request,
		res: Response,
		target: string,
		tracer: Tracer,
	) {
		const span = tracer.startSpan(`Accessing ${target}`);

		this.adapters.logger.info({
			message: `Redirecionando requisição para: ${target}`,
		});

		proxy.web(req, res, {
			ignorePath: true,
			target,
			secure: true,
			changeOrigin: true,
			followRedirects: true,
			preserveHeaderKeyCase: true,
		});

		span.end();
	}

	private async handlwWithCondominiumRouteContext(
		req: Request,
		res: Response,
		routeMap: RouteMap,
		decodedToken: any,
		log: ({ err }: IHttpErrorCallback) => void,
	) {
		let condominiumId: UUID | undefined;
		try {
			condominiumId = new UUID(String(req.query?.condominiumId));
		} catch (err) {
			BadRequest.buildResponse({
				res,
				callback: log,
				err: {
					message: String(err.message),
				},
			});
			return false;
		}

		const memberExists = await this.services.checkCondominiumMember.exec({
			aclRoleBased: routeMap!.aclRoleBased as number,
			decodedToken,
			condominiumId,
		});
		if (!memberExists) {
			Unauthorized.buildResponse({
				res,
				callback: log,
			});
			return false;
		}

		return true;
	}

	public async exec(req: Request, res: Response) {
		const tracer = this.tracer.getTracer('Main process');
		const span = tracer.startSpan('Function execution');

		this.adapters.logger.info({
			message: 'Acessando Auth Gateway',
		});

		const log = ({ err }: IHttpErrorCallback) => {
			this.adapters.logger.error({ ...err });
			span.recordException({
				code: err?.statusCode,
				...err,
			});
			span.end();
		};

		const jwt = await this.middlewares.scanJwt.exec({
			req,
			callbackErr: (serviceErr) => {
				Unauthorized.buildResponse({
					res,
					callback: () => {
						log({
							err: { statusCode: 401, ...serviceErr },
						});
					},
				});
			},
		});
		if (!jwt) return;

		const { nextRoute, requestUrl } = await this.getAvailableRoute(req);
		if (!nextRoute) {
			NotFound.buildResponse({
				res,
				callback: log,
			});
			return;
		}

		if (nextRoute.aclRoleBased) {
			const result = await this.handlwWithCondominiumRouteContext(
				req,
				res,
				nextRoute,
				jwt.decodedToken,
				log,
			);
			if (!result) return;
		}

		const pathname = requestUrl.toString().split('/')[4];
		const parsedNextRoute = `${nextRoute?.url.toString()}${pathname ?? ''}`;

		this.useProxyServer(req, res, parsedNextRoute, tracer);
	}
}
