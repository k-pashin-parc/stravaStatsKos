import { Injectable } from '@angular/core';

import { stravaConfig } from './../config/strava_config';

@Injectable({
	providedIn: 'root',
})
export class CommonUtilitiesService {
	getRedirectUrl (redirectSection = ''): string {
		return `https://www.strava.com/oauth/authorize
			?client_id=${stravaConfig.client_id}
			&response_type=code&redirect_uri=${stravaConfig.redirect_url}${redirectSection}
			&approval_prompt=force
			&scope=activity:read_all;write
		`;
	}

	redirectToAuth (redirectSection = ''): void {
		window.location.assign(this.getRedirectUrl(redirectSection));
	}
}
