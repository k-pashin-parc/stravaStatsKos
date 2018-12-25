var stravaData = require('../strava/stravaData'),
	exampleData = require('../strava/exampleData');

function mainStatsRoute (app) {
	app
		.get('/', function (req, res) {
			res.render('index');
		})
		.get('/api/summary', function (req, res) {
			stravaData.init();
			stravaData.getActivities({
				res: res,
				page: 1,
				isExampleData: req.query.isExampleData
			});
		})
		.get('/api/exampleJson', function (req, res) {
			res.json(exampleData.getData());
		})
		.get('/api/splits', function (req, res) {
			stravaData.getSplits(res, req.query.id);
		})
		.get('/api/segments', function (req, res) {
			stravaData.getSegments(res, req.query.id);
		})
		.get('/api/segmentLeaderboard', function (req, res) {
			stravaData.getSegmentLeaderboard(res, req.query.id, req.query.distance);
		})
		.get('/api/segmentMyEfforts', function (req, res) {
			stravaData.getSegmentMyEfforts(res, req.query.id);
		})
		.get('/api/segmentMap', function (req, res) {
			stravaData.getSegmentMap(res, req.query.id);
		});
}

module.exports = mainStatsRoute;
