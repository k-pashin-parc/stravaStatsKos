import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
	providedIn: 'root',
})

export class DeviceService {
	constructor(private deviceService: DeviceDetectorService) {}

	public getScreenInfo () {
		return {
			isMobile: this.deviceService.isMobile(),
			isTablet: this.deviceService.isTablet(),
			isDesktop: this.deviceService.isDesktop()
		};
	};
}
