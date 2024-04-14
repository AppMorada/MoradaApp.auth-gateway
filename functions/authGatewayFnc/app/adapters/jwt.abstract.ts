export abstract class JwtAdapter {
	abstract decode<T>(token: string): T;
	abstract validate(token: string, signature: string): void;
	abstract build(
		payload: Record<string, any>,
		signature: string,
		expiresAt: Date | number,
	): string;
}
