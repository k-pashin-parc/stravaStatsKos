import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkiSummaryComponent } from '../ski/summary/ski.summary.component';
import { SkiDetailComponent } from '../ski/detail/ski.detail.component';
import { ActivitiesResolveService } from '../activities/activities.resolve.service';
import { ActivitiesDataService } from '../activities/activities.data.service';
import { SplitsComponent } from '../splits/splits.component';
import { ActivitiesSplitsResolveService } from './../activities/activities.splits.resolve.service';
import { ChartGuard } from './app.chart.guard';
import { SkiChartComponent } from './../ski/chart/ski.chart.component';
import { BikeChartComponent } from 'src/bike/chart/bike.chart.component';
import { BikeDetailComponent } from 'src/bike/detail/bike.detail.component';
import { BikeSummaryComponent } from './../bike/summary/bike.summary.component';
import { RunSummaryComponent } from 'src/run/summary/run.summary.component';
import { RunChartComponent } from 'src/run/chart/run.chart.component';
import { RunDetailComponent } from 'src/run/detail/run.detail.component';
import { SegmentsComponent } from './../segments/segments.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'ski',
	},

	// ski
	{
		path: 'ski',
		data: {
			stateName: 'ski'
		},
		children: [{
			path: '',
			redirectTo: 'summaryChart',
			pathMatch: 'full'
		},
		{
			path: 'summaryChart',
			component: SkiChartComponent,
			resolve: {
				data: ActivitiesResolveService
			},
			canActivate: [ChartGuard]
		},
		{
			path: 'summary',
			component: SkiSummaryComponent,
			resolve: {
				data: ActivitiesResolveService
			}
		},
		{
			path: 'detail',
			component: SkiDetailComponent,
			resolve: {
				data: ActivitiesResolveService
			},
		}
	]
	}, {
		path: 'splits/:id',
		pathMatch: 'full',
		data: {
			isHideMenu: true
		},
		component: SplitsComponent,
		resolve: {
			data: ActivitiesSplitsResolveService
		}
	},

	// bike
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'bike'
	},
	{
		path: 'bike',
		data: {
			stateName: 'bike'
		},
		children: [{
			path: '',
			redirectTo: 'summaryChart',
			pathMatch: 'full'
		},
		{
			path: 'summaryChart',
			component: BikeChartComponent,
			resolve: {
				data: ActivitiesResolveService
			},
			canActivate: [ChartGuard]
		},
		{
			path: 'detail',
			component: BikeDetailComponent,
			resolve: {
				data: ActivitiesResolveService
			}
		},
		{
			path: 'summary',
			component: BikeSummaryComponent,
			resolve: {
				data: ActivitiesResolveService
			},
		}
	]},

	// run
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'run'
	},
	{
		path: 'run',
		data: {
			stateName: 'run'
		},
		children: [
			{
				path: '',
				redirectTo: 'summaryChart',
				pathMatch: 'full'
			},
			{
				path: 'summaryChart',
				component: RunChartComponent,
				resolve: {
					data: ActivitiesResolveService
				},
				canActivate: [ChartGuard]
			},
			{
				path: 'summary',
				component: RunSummaryComponent,
				resolve: {
					data: ActivitiesResolveService
				},
			},
			{
				path: 'detail',
				component: RunDetailComponent,
				resolve: {
					data: ActivitiesResolveService
				},
			},
		]
	},

	// segments
	{
		path: 'segments/:id',
		data: {
			stateName: 'segments',
			isHideMenu: true
		},
		component: SegmentsComponent,
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: false,
	})],
	exports: [
		RouterModule,
	],
	providers: [
		ActivitiesResolveService,
		ActivitiesDataService,
		ActivitiesSplitsResolveService,
	]
})

export class AppRoutingModule { }
