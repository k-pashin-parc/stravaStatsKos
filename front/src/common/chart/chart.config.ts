interface ChartColorScheme {
	domain: string[];
}

export interface ChartConfig {
	view?: number[];
	showXAxis?: boolean;
	showYAxis?: boolean;
	gradient?: boolean;
	showLegend?: boolean;
	legendTitle?: string;
	showXAxisLabel?: boolean;
	xAxisLabel?: string;
	showYAxisLabel?: boolean;
	yAxisLabel?: string;
	colorScheme?: ChartColorScheme;
	roundEdges?: boolean;
	showCustomLegend?: boolean;
	isMonthsColors?: boolean;
	customColors?: (fieldName) => {};
}

const ChartColorSchemes: { [name: string]: ChartColorScheme; } = {
	light: {
		domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#EF6D49']
	}
};

export const ChartConfigDefault: ChartConfig = {
	view: [1000],
	showXAxis: true,
	showYAxis: true,
	gradient: false,
	showLegend: false,
	showXAxisLabel: true,
	showYAxisLabel: true,
	colorScheme: ChartColorSchemes.light,
	roundEdges: true,
	legendTitle: '',
	showCustomLegend: true,
};

export const ChartMonthsColors = {
	'январь': '#A11928',
	'февраль': '#532274',
	'март': '#C9D6DE',
	'апрель': '#19A693',
	'май': '#0F673A',
	'июнь': '#C092C0',
	'июль': '#EA202D',
	'август': '#CFDB3C',
	'сентябрь': '#2F3490',
	'октябрь': '#F28E9F',
	'ноябрь': '#7CA4E2',
	'декабрь': '#4287f3'
};
