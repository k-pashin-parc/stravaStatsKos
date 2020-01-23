var express = require('express'),
	bodyParser = require( 'body-parser' ),
	app = express(),
	mainStatsRoute = require('./routes/mainStatsRoute'),
	httpsRedirect = require('express-https-redirect');

app
	.set('port', (process.env.PORT || 5000))
	.use( bodyParser.json() )
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.use(express.static(__dirname + '/dist'))
	.use('/test', httpsRedirect(true));

mainStatsRoute(app);

app.listen(app.get('port'), function () {
	console.log('listen');
});
