import {type IKeyProps, Key} from '@functions/authGatewayFnc/app/entities/key';

type TOverride = Partial<IKeyProps>;

export function keyFactory(input: TOverride = {}) {
	return new Key({
		name: 'default key',
		ttl: 1000 * 60 * 60,
		actual: {
			content: 'default content',
			buildedAt: Date.now(),
		},
		...input,
	});
}
