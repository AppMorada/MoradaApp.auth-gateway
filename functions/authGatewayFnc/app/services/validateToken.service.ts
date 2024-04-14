import { JwtAdapter } from '../adapters/jwt.abstract';
import { Key } from '../entities/key';
import { KeyRepo, KeysEnum } from '../repositories/keyRepo.abstract';
import { ServiceErrors } from './error';

export interface IValidateTokenServiceReturnableData {
	sigState: 'OK' | 'DEPREACATED';
	decodedToken: any;
}

interface IProps {
	name: KeysEnum;
	token: string;
}

export class ValidateTokenService {
	constructor(
		private readonly keyRepo: KeyRepo,
		private readonly jwtAdapter: JwtAdapter,
	) {}

	private validateNecessaryFields(token: string) {
		const decodedToken = this.jwtAdapter.decode<{
			iat?: number;
			exp?: number;
		}>(token);
		const iat = decodedToken?.iat;
		const exp = decodedToken?.exp;

		if (typeof iat !== 'number' || typeof exp !== 'number')
			throw new ServiceErrors(
				'O token precisa ter os campos "iat" e "exp"',
			);

		return { iat, exp, decodedToken };
	}

	private async handleDepreacatedSignatures(
		key: Key,
		iat: number,
		token: string,
	): Promise<{ sigState: 'DEPREACATED' }> {
		const buildedAtFloor = Math.floor(key.prev!.buildedAt / 1000);
		if (buildedAtFloor > iat) throw new ServiceErrors('Token expirado');

		const signatureContent = key!.prev!.content;

		try {
			this.jwtAdapter.validate(token, signatureContent);
		} catch {
			throw new ServiceErrors('JWT inválido');
		}

		return { sigState: 'DEPREACATED' };
	}

	private async handleNewerSignatures(
		key: Key,
		token: string,
	): Promise<{ sigState: 'OK' }> {
		const signatureContent = key.actual.content;

		try {
			this.jwtAdapter.validate(token, signatureContent);
		} catch {
			throw new ServiceErrors('JWT inválido');
		}

		return { sigState: 'OK' };
	}

	async exec(input: IProps): Promise<IValidateTokenServiceReturnableData> {
		const { iat, decodedToken } = this.validateNecessaryFields(input.token);

		const key = await this.keyRepo.getSignature(input.name);
		const buildedAtFloor = Math.floor(key.actual.buildedAt / 1000);

		if (key?.prev && iat < buildedAtFloor) {
			const { sigState } = await this.handleDepreacatedSignatures(
				key,
				iat,
				input.token,
			);
			return { sigState, decodedToken };
		}

		if (iat >= buildedAtFloor) {
			const { sigState } = await this.handleNewerSignatures(
				key,
				input.token,
			);
			return { sigState, decodedToken };
		}

		throw new ServiceErrors('Token expirado');
	}
}
