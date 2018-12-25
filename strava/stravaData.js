require('moment/locale/ru');

const rx = require('rxjs/Rx');
const _ = require('lodash');
const moment = require('moment');
const strava = require('strava-v3');
const decodePolyline = require('decode-google-map-polyline');

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
		movingSpeed: _.round(season.totalDistance / season.movingTime, 1),
		totalSpeed: _.round(season.totalDistance / season.elapsedTime, 1),
	});

	if (key === 'Ski') {
		const notQuickRides = _.filter(activities, 'is_not_quick');
		const notQuickRidesDistance = _.sum(_.map(notQuickRides, 'distance'));

		_.merge(season, {
			quickRides: _.filter(activities, 'is_quick'),
			quickRidesAmount: _.keys(_.groupBy(season.quickRides, 'date_display')).length,
			quickRidesDistance: _.sum(_.map(season.quickRides, 'distance')),
			quickRidesMovingTime: _.sum(_.map(season.quickRides, 'moving_time')),
			quickRidesMovingSpeed: season.quickRidesDistance / season.quickRidesMovingTime,
			quickRidesElapsedTime: getTimeToH(_.sum(_.map(season.quickRides, 'elapsed_time'))),
			quickRidesTotalSpeed: _.round(season.quickRidesDistance / season.quickRidesElapsedTime, 1),
			notQuickRidesMovingSpeed: _.round(notQuickRidesDistance / _.sum(_.map(notQuickRides, 'moving_time')), 1),
			notQuickRidesTotalSpeed: _.round(notQuickRidesDistance / getTimeToH(_.sum(_.map(notQuickRides, 'elapsed_time'))), 1),
			quickRidesDistance: _.round(season.quickRidesDistance, 1),
			quickRidesMovingSpeed: _.round(season.quickRidesMovingSpeed, 1),
			quickRidesElapsedTime: _.round(season.quickRidesElapsedTime, 1),
		});
	}

	_.merge(season, {
		companyRidesDistance: _.round(_.sum(_.map(companyRides, 'distance')), 1),
		companyRidesAmount: _.keys(_.groupBy(companyRides, 'date_display')).length,
		companyRidesTime: _.round(getTimeToH(_.sum(_.map(companyRides, 'elapsed_time'))), 1),
		distanceByMonths: [],
	});

	const months$ = rx.Observable.range(1, 12);

	months$.subscribe((i) => {
		const monthActivities = _.filter(activities, function (el) {
			return moment(el.date).format('MM') == i;
		})

		let index;

		if (monthActivities.length) {
			index = key === 'Ski' && i > 9 ? i - 13 : i;

			season.distanceByMonths.push({
				index: index,
				title: moment(i, 'M').format('MMMM'),
				value: _.round(_.sum(_.map(monthActivities, 'distance')), 1)
			});
		}
});

	if (key === 'Ski') {
		season.distanceByMonths = _.sortBy(season.distanceByMonths, 'index');
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

		_.merge(activity, {
			season: seasonName,
			name: _.trim(activity.name),
			date_display: formatDate(activity.start_date),
			date: formatDateMs(activity.start_date),
			distance: _.round(activity.distance / 1000, 1),
			total_speed: _.round(activity.distance / (activity.elapsed_time / 60 / 60), 1),
			rest_time: getRestTime(activity),
			elapsed_time: activity.elapsed_time,
			moving_time: activity.moving_time / 60 / 60,
			moving_speed: _.round(activity.distance / activity.moving_time, 1),
			is_quick: _.lowerCase(activity.name).includes('пляж') || _.lowerCase(activity.name).includes('набережная'),
			is_on_base: _.lowerCase(activity.name).includes('чайк'),
			is_not_quick: !activity.is_on_base && !activity.is_quick,
		});

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
		return data[type];
	});

	types$
		.subscribe((type) => {
			const seasons$ = rx.Observable.from(Object.getOwnPropertyNames(type.seasons)).map((seasonName) => {
				return {
					type: type,
					season: type.seasons[seasonName]
				};
			});

			seasons$.subscribe((params) => {
				formatSeason(params.season, params.type);
			});

			type.seasons = _.values(type.seasons);
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
			access_token: accessToken,
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
						page
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
	strava.activities.get({
		access_token: accessToken,
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
}

function getSegments (res, id) {
	strava.activities.get({
		access_token: accessToken,
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

module.exports = {
	getActivities,
	init,
	getSplits,
	getSegments,
	getSegmentLeaderboard,
	getSegmentMyEfforts,
	getSegmentMap,
};