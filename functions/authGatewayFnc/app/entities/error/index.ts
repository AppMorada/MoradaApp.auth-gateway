interface IProps {
	entity: 'VO' | 'Entity';
	message: string;
}

export class EntitieError extends Error {
	constructor(input: IProps) {
		super();

		this.name =
			input.entity === 'Entity' ? 'Entity Error' : 'Value Object Error';
		this.message = input.message;
	}
}
