var express = require('express'),
	bodyParser = require( 'body-parser' ),
	app = express(),
	mainStatsRoute = require('./routes/mainStatsRoute');

app
	.set('port', (process.env.PORT || 5000))
	.use( bodyParser.json() )
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.use(express.static(__dirname + '/dist'));

mainStatsRoute(app);

app.listen(app.get('port'), function () {
	console.log('listen');
});
