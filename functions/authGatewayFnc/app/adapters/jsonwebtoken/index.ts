import { type JwtAdapter } from '../jwt.abstract';
import { sign, decode, verify } from 'jsonwebtoken';

export class JsonwebtokenAdapter implements JwtAdapter {
	build(
		payload: Record<
			string,
			string | Record<string, unknown> | undefined | number | boolean
		>,
		signature: string,
		expiresAt: Date | number,
	): string {
		const token = sign(payload, signature, {
			expiresIn: Math.floor(
				expiresAt instanceof Date
					? expiresAt.getTime()
					: expiresAt / 1000,
			),
			algorithm: 'HS256',
		});
		return token;
	}

	decode<T>(token: string): T {
		const payload = decode(token);
		return payload as T;
	}

	validate(token: string, signature: string): void {
		verify(token, signature);
	}
}
