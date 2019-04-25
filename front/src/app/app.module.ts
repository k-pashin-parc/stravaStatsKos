import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from './../common/common.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from '../header/header.component';
import { SkiSummaryComponent } from './../ski/summary/ski.summary.component';
import { ActivitiesService } from './../activities/activities.service';
import { SkiDetailComponent } from './../ski/detail/ski.detail.component';
import { SplitsComponent } from './../splits/splits.component';
import { SkiChartComponent } from './../ski/chart/ski.chart.component';
import { BikeChartComponent } from './../bike/chart/bike.chart.component';
import { BikeDetailComponent } from 'src/bike/detail/bike.detail.component';
import { BikeSummaryComponent } from './../bike/summary/bike.summary.component';
import { RunSummaryComponent } from 'src/run/summary/run.summary.component';
import { RunChartComponent } from 'src/run/chart/run.chart.component';
import { RunDetailComponent } from 'src/run/detail/run.detail.component';

@NgModule({
	declarations: [
		AppComponent,
		AppHeaderComponent,
		SkiSummaryComponent,
		SkiDetailComponent,
		SplitsComponent,
		SkiChartComponent,
		BikeChartComponent,
		BikeDetailComponent,
		BikeSummaryComponent,
		RunSummaryComponent,
		RunChartComponent,
		RunDetailComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		CommonModule,
		BrowserAnimationsModule,
		AppRoutingModule,
	],
	exports: [],
	providers: [
		ActivitiesService,
	],
	bootstrap: [
		AppComponent,
	]
})

export class AppModule { }
