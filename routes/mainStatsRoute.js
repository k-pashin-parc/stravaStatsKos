const stravaData = require('../strava/stravaData');
const exampleData = require('../strava/exampleData');
const config = require('./../config');

function mainStatsRoute (app) {
	app
		.get('/', function (req, res) {
			res.sendFile('/index.html');
		})
		.get('/segments', function (req, res) {
			res.sendFile('/index.html');
		})
		.get('/splits', function (req, res) {
			res.sendFile('/index.html');
		})
		.get('/api/summary', function (req, res) {
			stravaData.init();

			if (req.query.isExampleData === true) {
				stravaData.getActivities({
					res: res,
					page: 1,
					isExampleData: true
				});
			} else {
				stravaData.getTokenPromise(req.query.code).then(function (response) {
					stravaData.getActivities({
						res: res,
						page: 1,
						token: response.data.access_token
					});
				});
			}
		})
		.get('/api/exampleJson', function (req, res) {
			res.json(exampleData.getData());
		})
		.get('/api/splits', function (req, res) {
			stravaData.getSplits(res, req.query.id, req.query.code);
		})
		.get('/api/segments', function (req, res) {
			stravaData.getSegments(res, req.query.id, req.query.code);
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
