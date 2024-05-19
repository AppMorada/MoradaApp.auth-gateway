import {
	BatchSpanProcessor,
	SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import {
	SEMRESATTRS_SERVICE_NAME,
	SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

export class TraceHandler {
	private readonly exporter: TraceExporter | ZipkinExporter;
	private readonly spanProcessor: SimpleSpanProcessor | BatchSpanProcessor;
	private readonly tracer: NodeTracerProvider;

	constructor() {
		this.exporter =
			process.env.NODE_ENV !== 'production' || !process.env.OBSERVER_AGENT
				? new ZipkinExporter({
					serviceName: process.env.SERVICE_NAME,
					url: process.env.ZIPKIN_TRACE_URL,
				})
				: new TraceExporter({
					projectId: process.env.LOGGING_PROJECT,
					credentials: JSON.parse(process.env.OBSERVER_AGENT!),
				});

		this.spanProcessor =
			process.env.NODE_ENV !== 'production' || !process.env.OBSERVER_AGENT
				? new SimpleSpanProcessor(this.exporter)
				: new BatchSpanProcessor(this.exporter);

		this.tracer = new NodeTracerProvider({
			resource: new Resource({
				[SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME,
				[SEMRESATTRS_SERVICE_VERSION]: process.env.SERVICE_VERSION,
			}),
		});

		this.tracer.addSpanProcessor(this.spanProcessor);

		const shutdown = async () => this.tracer.shutdown();
		process.on('SIGTERM', shutdown);
		process.on('SIGINT', shutdown);
		process.on('SIGBREAK', shutdown);
	}

	getTracer(name: string) {
		return this.tracer.getTracer(name);
	}

	start() {
		this.tracer.register();
	}
}
