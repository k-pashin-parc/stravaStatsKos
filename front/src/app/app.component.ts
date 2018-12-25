import { Component } from '@angular/core';
import { DeviceService } from '../device/device.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass']
})

export class AppComponent {
	constructor(private deviceService: DeviceService) {
		const info = this.deviceService.getScreenInfo();
		console.log(info);
	}
}
