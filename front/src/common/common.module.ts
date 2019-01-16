import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TableComponent } from './table/table.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TableTimeFieldFormatterPipe } from './table/table.time_field_formatter.pipe';

@NgModule({
	declarations: [
		TableComponent,
		TableTimeFieldFormatterPipe,
	],
	imports: [
		BrowserModule,
		DeviceDetectorModule.forRoot(),
		MatTableModule,
		MatCheckboxModule,
		RouterModule
	],
	exports: [
		FormsModule,
		MatButtonModule,
		MatProgressBarModule,
		MatTabsModule,
		TableComponent,
		TableTimeFieldFormatterPipe,
		MatCheckboxModule,
	],
	providers: []
})

export class CommonModule { }
