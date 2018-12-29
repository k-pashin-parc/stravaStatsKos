import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkiSummaryComponent } from '../ski/summary/ski.summary.component';

import { ActivitiesResolveService } from '../activities/activities.resolve.service';
import { ActivitiesDataService } from '../activities/activities.data.service';

const routes: Routes = [{
	path: '',
	pathMatch: 'full',
	redirectTo: 'ski'
}, {
	path: 'ski',
	data: {
		stateName: 'ski'
	},
	children: [{
		path: '',
		redirectTo: 'summary',
		pathMatch: 'full'
	}, {
		path: 'summary',
		component: SkiSummaryComponent,
		resolve: {
			data: ActivitiesResolveService
		},
	}, {
		path: 'detail',
		component: SkiSummaryComponent,
		resolve: {
			data: ActivitiesResolveService
		},
	}]
}, ];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: true
	})],
	exports: [RouterModule],
	providers: [
		ActivitiesResolveService,
		ActivitiesDataService,
	]
})

export class AppRoutingModule { }
