import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkiSummaryComponent } from '../ski/summary/ski.summary.component';
import { SkiDetailComponent } from '../ski/detail/ski.detail.component';
import { ActivitiesResolveService } from '../activities/activities.resolve.service';
import { ActivitiesDataService } from '../activities/activities.data.service';
import { SplitsComponent } from '../splits/splits.component';
import { ActivitiesSplitsResolveService } from './../activities/activities.splits.resolve.service';

const routes: Routes = [
	{
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
			component: SkiDetailComponent,
			resolve: {
				data: ActivitiesResolveService
			},
		}]
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
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: true
	})],
	exports: [RouterModule],
	providers: [
		ActivitiesResolveService,
		ActivitiesDataService,
		ActivitiesSplitsResolveService,
	]
})

export class AppRoutingModule { }
