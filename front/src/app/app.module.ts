import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from '../header/header.component';
import { SkiSummaryComponent } from './../ski/summary/ski.summary.component';
import { ActivitiesService } from './../activities/activities.service';

@NgModule({
	declarations: [
		AppComponent,
		AppHeaderComponent,
		SkiSummaryComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		DeviceDetectorModule.forRoot(),
		MatButtonModule,
		MatProgressBarModule,
		MatTabsModule,
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
