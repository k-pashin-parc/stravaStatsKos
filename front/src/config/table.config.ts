interface AdditionalField {
	fieldName: string;
}

interface AdditionalLink {
	name: string;
	url: string;
}

export interface FieldConfig {
	title: string;
	fieldName: string;
	type?: string;
	additionalField?: AdditionalField;
	additionalLinks?: AdditionalLink[];
}
