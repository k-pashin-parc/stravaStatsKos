import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { DeviceService } from './../common/device/device.service';

@Injectable({
	providedIn: 'root',
})
export class ChartGuard implements CanActivate {
	constructor(
		private deviceService: DeviceService,
		private router: Router,
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean {
			if (this.deviceService.getScreenInfo().isMobile) {
				this.router.navigate([`${next.data.stateName}/summary`]);
				return false;
			} else {
				return true;
			}
	}
}
