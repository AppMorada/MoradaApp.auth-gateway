export abstract class JwtAdapter {
	abstract decode<T>(token: string): T;
	abstract validate(token: string, signature: string): void;
	abstract build(
		payload: Record<
			string,
			string | Record<string, unknown> | undefined | number | boolean
		>,
		signature: string,
		expiresAt: Date | number,
	): string;
}
