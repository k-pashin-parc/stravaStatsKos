import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';

export interface ScreeState {
	isMobile?: Boolean;
	isTablet?: Boolean;
	isDesktop?: Boolean;
}

@Injectable({
	providedIn: 'root',
})

export class DeviceService {
	constructor(private deviceService: DeviceDetectorService) {}

	public getScreenInfo (): ScreeState {
		return {
			isMobile: this.deviceService.isMobile(),
			isTablet: this.deviceService.isTablet(),
			isDesktop: this.deviceService.isDesktop()
		};
	};
}
