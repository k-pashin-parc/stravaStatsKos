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

@NgModule({
	declarations: [
		AppComponent,
		AppHeaderComponent,
		SkiSummaryComponent,
		SkiDetailComponent,
		SplitsComponent,
		SkiChartComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		CommonModule,
		BrowserAnimationsModule,
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
