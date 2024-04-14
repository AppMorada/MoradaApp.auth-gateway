import { randomUUID } from 'node:crypto';
import { EntitieError } from '../../error';

export class UUID {
	private readonly _value: string;

	constructor(input: string) {
		const regexp =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!input.match(regexp))
			throw new EntitieError({
				message:
					'O número de identificação não está formatado corretamente',
				entity: 'VO',
			});

		this._value = input;
	}

	static check(input: string): boolean {
		const regexp =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!input.match(regexp)) return false;
		return true;
	}

	static genV4() {
		const uuid = randomUUID();
		return new UUID(uuid);
	}

	equalTo(input: UUID): boolean {
		return this._value === input.value;
	}

	get value(): string {
		return this._value;
	}
}
