export class MiddlewareErrors extends Error {
	constructor(input: string) {
		super();

		this.name = 'Middleware Error';
		this.message = input;
	}
}
