type IProps = {
	name: string;
	url: URL;
	aclRoleBased?: number | null;
};

export class RouteMap {
	private readonly props: IProps;
	constructor(input: IProps) {
		this.props = {
			name: input.name,
			url: input.url,
			aclRoleBased: input.aclRoleBased,
		};
	}

	get name() {
		return this.props.name;
	}

	set name(input: string) {
		this.props.name = input;
	}

	get url() {
		return this.props.url;
	}

	set url(input: URL) {
		this.props.url = input;
	}

	get aclRoleBased(): number | null | undefined {
		return this.props.aclRoleBased;
	}

	set aclRoleBased(input: number | null | undefined) {
		this.props.aclRoleBased = input;
	}
}
