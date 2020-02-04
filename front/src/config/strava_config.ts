import { environment } from './../environments/environment';

export const stravaConfig = {
	client_id: 15224,
	redirect_url: environment.production ? 'https://stravastatskos.herokuapp.com' : 'http://localhost:4200'
};
