import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		DeviceDetectorModule.forRoot(),
	],
	providers: [],
	bootstrap: [
		AppComponent,
	]
})

export class AppModule { }
