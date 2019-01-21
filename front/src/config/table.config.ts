interface AdditionalField {
	fieldName: string;
}

export interface FieldConfig {
	title: string;
	fieldName: string;
	type?: string;
	additionalField?: AdditionalField;
}
