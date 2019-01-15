import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { TableComponent } from './table/table.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TableFieldFormatterPipe } from './table/table.field_formatter.pipe';

@NgModule({
	declarations: [
		TableComponent,
		TableFieldFormatterPipe,
	],
	imports: [
		BrowserModule,
		MatTableModule,
		DeviceDetectorModule.forRoot(),
	],
	exports: [
		MatButtonModule,
		MatProgressBarModule,
		MatTabsModule,
		TableComponent,
		TableFieldFormatterPipe,
	],
	providers: []
})

export class CommonModule { }
