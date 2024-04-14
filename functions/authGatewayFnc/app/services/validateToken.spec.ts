import { InMemoryKeyRepo } from '@tests/inMemoryDb/repositories/key';
import { JsonwebtokenAdapter } from '../adapters/jsonwebtoken';
import { ValidateTokenService } from './validateToken.service';
import { type JwtAdapter } from '../adapters/jwt.abstract';
import { Key } from '../entities/key';
import { KeysEnum } from '../repositories/keyRepo.abstract';
import { randomBytes } from 'crypto';
import { globalConstants } from '@functions/constants';
import { ServiceErrors } from './error';

describe('ValidateTokenService Service', () => {
	let keyRepo: InMemoryKeyRepo;
	let jwtAdapter: JwtAdapter;
	let sut: ValidateTokenService;

	beforeEach(() => {
		keyRepo = new InMemoryKeyRepo();
		jwtAdapter = new JsonwebtokenAdapter();
		sut = new ValidateTokenService(keyRepo, jwtAdapter);
	});

	it('should validate the token and return sigState as \'OK\'', async () => {
		const case1 = async () => {
			// Testando o token mais novo possível e que usa a assinatura mais nova
			const iat = Date.now();
			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: 1000 * 60 * 60,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: iat,
				},
			});
			globalConstants.KEYS.push(key);

			const token = jwtAdapter.build(
				{
					data: 'any',
					iat: Math.floor(iat / 1000),
				},
				key.actual.content,
				Math.floor(key.renewTime / 1000),
			);

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'OK').toEqual(true);
			expect(keyRepo.calls.getSignature).toEqual(1);

			globalConstants.KEYS = [];
		};

		const case2 = async () => {
			// Testando o token mais velho possível e que ainda continua usando a assinatura mais nova
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;
			const oneHourEarlier = actualDate - oneHour;

			const iat = oneHourEarlier + 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: iat,
				},
			});

			globalConstants.KEYS.push(key);
			const token = jwtAdapter.build(
				{
					data: 'any',
					iat: Math.floor(iat / 1000),
				},
				key.actual.content,
				Math.floor((iat + oneHour + 1000) / 1000),
			);

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'OK').toEqual(true);
			expect(keyRepo.calls.getSignature).toEqual(2);

			globalConstants.KEYS = [];
		};

		await case1();
		await case2();
	});

	it('should validate the token and return sigState as \'DEPREACATED\'', async () => {
		const case1 = async () => {
			// Testando o token mais velho possível que usa a assinatura depreciada
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;
			const oneHourEarlier = actualDate - oneHour;

			const iat = oneHourEarlier + 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate,
				},
				prev: {
					content: randomBytes(100).toString('hex'),
					buildedAt: oneHourEarlier,
				},
			});

			globalConstants.KEYS.push(key);
			const token = jwtAdapter.build(
				{
					data: 'any',
					iat: Math.floor(iat / 1000),
				},
				key.prev!.content,
				Math.floor((iat + oneHour) / 1000),
			);

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'DEPREACATED').toEqual(true);
			expect(keyRepo.calls.getSignature).toEqual(1);

			globalConstants.KEYS = [];
		};

		const case2 = async () => {
			// Testando o token mais recente possível que faz o uso de assinaturas
			// depreciadas
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;

			const iat = actualDate - 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate,
				},
				prev: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate - oneHour,
				},
			});

			globalConstants.KEYS.push(key);
			const token = jwtAdapter.build(
				{
					data: 'any',
					iat: Math.floor(iat / 1000),
				},
				key.prev!.content,
				Math.floor((iat + oneHour) / 1000),
			);

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'DEPREACATED').toEqual(true);
			expect(keyRepo.calls.getSignature).toEqual(2);

			globalConstants.KEYS = [];
		};

		await case1();
		await case2();
	});

	it('should throw one error - out of time', async () => {
		const actualDate = Date.now();
		const oneHour = 1000 * 60 * 60;
		const oneHourEarlier = actualDate - oneHour;

		const key = new Key({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			ttl: oneHour,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: actualDate,
			},
			prev: {
				content: randomBytes(100).toString('hex'),
				buildedAt: oneHourEarlier,
			},
		});

		globalConstants.KEYS.push(key);
		const token = jwtAdapter.build(
			{
				data: 'any',
				iat: Math.floor((oneHourEarlier - 1000) / 1000),
			},
			key.prev!.content,
			Math.floor((actualDate - 1000) / 1000),
		);

		expect(
			sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			}),
		).rejects.toThrow(new ServiceErrors('Token expirado'));
		expect(keyRepo.calls.getSignature).toEqual(1);
	});

	it('should throw one error - any good conditions was detected', async () => {
		const actualDate = Date.now();
		const oneHour = 1000 * 60 * 60;
		const oneHourEarlier = actualDate - oneHour;

		const key = new Key({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			ttl: oneHour,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: actualDate,
			},
		});

		globalConstants.KEYS.push(key);
		const token = jwtAdapter.build(
			{
				data: 'any',
				iat: Math.floor((oneHourEarlier - 1000) / 1000),
			},
			randomBytes(100).toString('hex'),
			Math.floor((actualDate - 1000) / 1000),
		);

		expect(
			sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			}),
		).rejects.toThrow(new ServiceErrors('Token expirado'));
		expect(keyRepo.calls.getSignature).toEqual(1);
	});
});
