require('moment/locale/ru');

const rx = require('rxjs/Rx');
const _ = require('lodash');
const moment = require('moment');
const strava = require('strava-v3');
const decodePolyline = require('decode-google-map-polyline');
const axios = require('axios');

const config = require('../config');
const exampleData = require('../strava/exampleData');
const accessToken = config.accessToken;

let activities;

function getSpeed (distance, time) {
	const timeH = time / 60 / 60;
	const distanceKm = distance / 1000;

	return _.round(distanceKm / timeH, 1);
}

function getTimeToH (time) {
	return time / 60 / 60;
}

function formatDistance (distance) {
	return _.round(distance / 1000, 1);
}

function formatDate (date) {
	return moment(date).format('DD MMM YYYY');
}

function formatDateMs (date) {
	return (new Date(date)).valueOf();
}

function getRestTime (activity) {
	return activity.elapsed_time - activity.moving_time;
}

function getIsSki (activity) {
	return activity.type === 'BackcountrySki' || activity.type === 'NordicSki';
}

function getSeason (activity, isSki) {
	const year = moment(activity.start_date).format('YYYY');
	const month = moment(activity.start_date).format('MM');
	let season = year;

	if (isSki && month < 10) {
		season--;
	}

	return season;
}

function getSeasonName (activity, season) {
	return getIsSki(activity) ? `${season}/${parseInt(season, 10) + 1}` : season;
}

function formatSeason (season, key) {
	const activities = season.activities;
	const elapsedTimeTotal = _.round(getTimeToH(_.sum(_.map(activities, 'elapsed_time'))), 2);
	const companyRides = _.filter(activities, function (el) { return el.name.includes('(+)');	});

	_.merge(season, {
		ridesAmount: _.keys(_.groupBy(activities, 'date_display')).length,
		totalDistance: _.round(_.sum(_.map(activities, 'distance')), 2),
		elapsedTime: elapsedTimeTotal,
		movingTime: _.round(_.sum(_.map(activities, 'moving_time')), 2),
	});

	season.movingSpeed = _.round(season.totalDistance / season.movingTime, 1);
	season.totalSpeed = _.round(season.totalDistance / season.elapsedTime, 1);

	if (key === 'Ski') {
		const notQuickRides = _.filter(activities, 'is_not_quick');
		const notQuickRidesDistance = _.sum(_.map(notQuickRides, 'distance'));

		season.quickRides = _.filter(activities, 'is_quick');
		season.quickRidesAmount = _.keys(_.groupBy(season.quickRides, 'date_display')).length;
		season.quickRidesDistance = _.sum(_.map(season.quickRides, 'distance'));
		season.quickRidesMovingTime = _.sum(_.map(season.quickRides, 'moving_time'));
		season.quickRidesMovingSpeed = season.quickRidesDistance / season.quickRidesMovingTime;
		season.quickRidesElapsedTime = getTimeToH(_.sum(_.map(season.quickRides, 'elapsed_time')));
		season.quickRidesTotalSpeed = _.round(season.quickRidesDistance / season.quickRidesElapsedTime, 1);
		season.notQuickRidesMovingSpeed = _.round(notQuickRidesDistance / _.sum(_.map(notQuickRides, 'moving_time')), 1);
		season.notQuickRidesTotalSpeed = _.round(notQuickRidesDistance / getTimeToH(_.sum(_.map(notQuickRides, 'elapsed_time'))), 1);
		season.quickRidesDistance = _.round(season.quickRidesDistance, 1);
		season.quickRidesMovingSpeed = _.round(season.quickRidesMovingSpeed, 1);
		season.quickRidesElapsedTime = _.round(season.quickRidesElapsedTime, 1);
		season.onBaseDistance = _.sum(_.map(_.filter(activities, 'is_on_base'), 'distance'));
	}

	_.merge(season, {
		companyRidesDistance: _.round(_.sum(_.map(companyRides, 'distance')), 1),
		companyRidesAmount: _.keys(_.groupBy(companyRides, 'date_display')).length,
		companyRidesTime: _.round(getTimeToH(_.sum(_.map(companyRides, 'elapsed_time'))), 1),
		distanceByMonths: [],
	});

	const months$ = rx.Observable
		.range(1, 12)
		.filter(month => {
			return (key === 'Ski' ? (month <= 4 || month >= 11) : month);
		});

	months$.subscribe((i) => {
		const monthActivities = _.filter(activities, function (el) {
			return moment(el.date).format('MM') == i;
		});

		let index;

		index = key === 'Ski' && i > 9 ? i - 13 : i;

		if ((key === 'Ride' && i >= 4 && i <= 10) || key === 'Ski' || (key === 'Run' && i >= 4 && i <= 11)) {
			season.distanceByMonths.push({
				index: index,
				name: moment(i, 'M').format('MMMM'),
				value: _.round(_.sum(_.map(monthActivities, 'distance')), 1)
			});
		}
	});

	if (key === 'Ski') {
		season.distanceByMonths = _.sortBy(season.distanceByMonths, (el) => {
			return el.index;
		});
	}

	_.unset(season, 'activities');
}

function formatData (allActivities) {
	const data = {};

	const activities$ = rx.Observable.from(allActivities).map((el) => {
		return el;
	});

	activities$.subscribe((activity) => {
		const isSki = getIsSki(activity);
		const season = getSeason(activity, isSki);
		const type = isSki ? 'Ski' : activity.type;
		const seasonName = getSeasonName(activity, season);

		if (!data[type]) {
			data[type] = {
				seasons: {},
				activities: []
			};
		}

		if (!data[type].seasons[season]) {
			data[type].seasons[season] = {
				id: _.uniqueId(),
				title: seasonName,
				activities: []
			};
		}

		activity.season = seasonName;
		activity.name = _.trim(activity.name);
		activity.date_display = formatDate(activity.start_date);
		activity.date = formatDateMs(activity.start_date);
		activity.distance = _.round(activity.distance / 1000, 1);
		activity.total_speed = _.round(activity.distance / (activity.elapsed_time / 60 / 60), 1);
		activity.rest_time = getRestTime(activity);
		activity.elapsed_time = activity.elapsed_time;
		activity.moving_time = activity.moving_time / 60 / 60;
		activity.moving_speed = _.round(activity.distance / activity.moving_time, 1);
		activity.is_quick = _.lowerCase(activity.name).includes('пляж') || _.lowerCase(activity.name).includes('набережная');
		activity.is_on_base = _.lowerCase(activity.name).includes('чайк');
		activity.is_not_quick = !activity.is_on_base && !activity.is_quick;

		activity = _.pick(activity, [
			'name',
			'date',
			'date_display',
			'distance',
			'elapsed_time',
			'moving_time',
			'total_speed',
			'moving_speed',
			'rest_time',
			'season',
			'id',
			'is_quick',
			'is_not_quick',
			'is_on_base',
		]);

		data[type].activities.push(activity);
		data[type].seasons[season].activities.push(activity);
	});

	const types$ = rx.Observable.from(Object.getOwnPropertyNames(data)).map((type) => {
		return {
			data: data[type],
			type: type,
		};
	});

	types$
		.subscribe((params) => {
			const seasons$ = rx.Observable.from(Object.getOwnPropertyNames(params.data.seasons)).map((seasonName) => {
				return {
					type: params.type,
					season: params.data.seasons[seasonName]
				};
			});

			seasons$.subscribe((params) => {
				formatSeason(params.season, params.type);
			});
		});

	const typeNames$ = rx.Observable.from(Object.getOwnPropertyNames(data));

	typeNames$
		.subscribe(typeName => {
			data[typeName].seasons = _.values(data[typeName].seasons);
		});

	return data;
}

function init () {
	activities = [];
}

function getActivities (params) {
	let page = params.page;

	const res = params.res;
	const isExample$ = rx.Observable.of(params.isExampleData).partition(el => el === 'true');
	const example$ = isExample$[0];
	const realData$ = isExample$[1];

	example$.subscribe(() => {
		res.json(exampleData.getData());
	});

	realData$.subscribe(() => {
		strava.athlete.listActivities({
			access_token: params.token,
			per_page: 200,
			page: page
		}, function (err, payload) {
			const isError$ = rx.Observable.of(err).partition(el => {
				return !!el;
			});

			const onError$ = isError$[0];
			const onDone$ = isError$[1];

			onError$.subscribe(() => {
				res.json(err);
			});

			onDone$.subscribe(() => {
				const isHasNextPage$ = rx.Observable.of(payload && payload.length).partition(el => {
					return !!el;
				});

				const onNextPage$ = isHasNextPage$[0];
				const onNoNextPage$ = isHasNextPage$[1];

				onNextPage$.subscribe(() => {
					activities = activities.concat(payload);
					page++;

					getActivities({
						res,
						page,
						token: params.token
					});
				});

				onNoNextPage$.subscribe(() => {
					res.json({data: formatData(activities)});
				});
			});
		});
	});
}

function getSplits (res, id) {
	getTokenPromise().then(function (response) {
		strava.activities.get({
			access_token: response.data.access_token,
			id: id
		}, function (err, payload) {
			const detail = {
				splits: []
			};

			const isError$ = rx.Observable.of(err).partition(el => {
				return !!el;
			});

			const onError$ = isError$[0];
			const onDone$ = isError$[1];

			onError$.subscribe(() => {
				res.json(err);
			});

			onDone$.subscribe(() => {
				detail.name = payload.name;

				rx.Observable
					.from(payload.splits_metric)
					.map((split, index) => {
						var distance = split.distance / 1000,
							displayDistance = _.round(distance, 1),
							movingTime = split.moving_time / 60 / 60,
							movingSpeed = _.round(distance / movingTime, 1),
							totalTime = split.elapsed_time / 60 / 60,
							totalSpeed = _.round(distance / totalTime, 1);

						if (displayDistance) {
							detail.splits.push({
								index: index + 1,
								distance: _.round(distance, 2),
								moving_speed: movingSpeed,
								total_speed: totalSpeed,
								rest_time: getRestTime(split)
							});
						}
					})
					.subscribe();

				res.json(detail);
			})
		});
	});
}

function getSegments (res, id) {
	getTokenPromise().then(function (response) {
		strava.activities.get({
			access_token: response.data.access_token,
			id: id
		}, function (err, payload) {
			const detail = {
				segments: []
			};

			const isError$ = rx.Observable.of(err).partition(el => {
				return !!el;
			});

			const onError$ = isError$[0];
			const onDone$ = isError$[1];

			onError$.subscribe(() => {
				res.json(err);
			});

			onDone$.subscribe(() => {
				detail.name = payload.name;
				detail.date = moment(payload.start_date).format('DD MMM YYYY');

				rx.Observable
					.from(payload.segment_efforts)
					.map((segment) => {
						detail.segments.push({
							id: segment.segment.id,
							name: segment.name,
							distance: formatDistance(segment.distance),
							achievements: _.pick(segment.achievements, 'type', 'rank'),
							moving_speed: getSpeed(segment.distance, segment.moving_time),
							total_speed: getSpeed(segment.distance, segment.elapsed_time),
							elapsed_time: segment.elapsed_time,
							rest_time: getRestTime(segment)
						});
					})
					.subscribe();

				res.json(detail);
			});
		});
	});
}

function getSegmentLeaderboard (res, id, distance) {
	strava.segments.listLeaderboard({
		access_token: accessToken,
		id: id,
		per_page: 200
	}, function (err, payload) {
		const detail = {
			entries: []
		};

		const distanceM = distance * 1000;

		const isError$ = rx.Observable.of(err).partition(el => {
			return !!el;
		});

		const onError$ = isError$[0];
		const onDone$ = isError$[1];

		onError$.subscribe(() => {
			res.json(err);
		});

		onDone$.subscribe(() => {
			detail.effort_count = payload.effort_count;
			detail.entry_count = payload.entry_count;

			rx.Observable
				.from(payload.entries)
				.map((el) => {
					const data = {};

					if (distance) {
						data.moving_speed = getSpeed(distanceM, el.moving_time);
						data.total_speed = getSpeed(distanceM, el.elapsed_time);
					}

					data.athlete_name = el.athlete_name;
					data.rank = el.rank;
					data.rest_time = getRestTime(el);
					data.elapsed_time = el.elapsed_time;

					detail.entries.push(data);
				})
				.subscribe();

				res.json(detail);
			});
	});
}

function getSegmentMyEfforts (res, id) {
	strava.segments.listEfforts({
		access_token: accessToken,
		id: id,
	}, function (err, payload) {
		const detail = [];

		const isError$ = rx.Observable.of(err).partition(el => {
			return !!el;
		});

		const onError$ = isError$[0];
		const onDone$ = isError$[1];

		onError$.subscribe(() => {
			res.json(err);
		});

		onDone$.subscribe(() => {
			rx.Observable
				.from(payload)
				.map((el) => {
					detail.push({
						id: el.activity.id,
						date: formatDateMs(el.start_date),
						date_display: formatDate(el.start_date),
						elapsed_time: el.elapsed_time,
						moving_time: el.moving_time,
						distance: formatDistance(el.distance),
						moving_speed: getSpeed(el.distance, el.moving_time),
						total_speed: getSpeed(el.distance, el.elapsed_time),
						rest_time: getRestTime(el),
						kom_rank: el.kom_rank,
						pr_rank: el.pr_rank,
						achievements: el.achievements
					});
				})
				.subscribe();

			res.json(_.orderBy(detail, 'date', 'desc'));
		});
	});
}

function getSegmentMap (res, id) {
	strava.segments.get({
		access_token: accessToken,
		id: id
	}, function (err, payload) {
		const isError$ = rx.Observable.of(err).partition(el => {
			return !!el;
		});

		const onError$ = isError$[0];
		const onDone$ = isError$[1];

		onError$.subscribe(() => {
			res.json(err);
		});

		onDone$.subscribe(() => {
			payload.route = decodePolyline(payload.map.polyline);

			res.json(_.pick(payload, [
				'start_latitude',
				'start_longitude',
				'end_latitude',
				'end_longitude',
				'route',
			]));
		});
	});
}


function getTokenPromise () {
	return axios({
		method: 'POST',
		url: 'https://www.strava.com/oauth/token',
		data: {
			client_id: config.client_id,
			client_secret: config.client_secret,
			code: config.code,
			grant_type: 'authorization_code'
		}
	});
}

module.exports = {
	getActivities,
	init,
	getSplits,
	getSegments,
	getSegmentLeaderboard,
	getSegmentMyEfforts,
	getSegmentMap,
	getTokenPromise,
};
