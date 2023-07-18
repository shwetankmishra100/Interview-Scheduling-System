import * as Mongo from '../data/mongo/mongoHelper.js';
import { SCHEDULES } from '../data/mongo/mongoCollections.js';
import * as user from './userService.js';
import { USER_TYPES } from '../utils/constants.js';

const prepareScheduleData = async (scheduleData) => {
	scheduleData.scheduleId = scheduleData._id;
	scheduleData.user1Data = await user.fetchUserById(scheduleData.user1Id);
	scheduleData.user2Data = await user.fetchUserById(scheduleData.user2Id);
	scheduleData.scheduledByData = await user.fetchUserById(scheduleData.scheduledBy);

	delete scheduleData._id;
	delete scheduleData.user1Id;
	delete scheduleData.user2Id;
	delete scheduleData.scheduledBy;

	return scheduleData;
};

export const fetchSchedules = async (userId, page, pageSize, listUpcoming = true) => {
	const criteria = {};

	const currentTimeStamp = new Date();
	const userData = await user.fetchUserById(userId);

	if (userData.type === USER_TYPES.COMPANY.key) {
		criteria['scheduledBy'] = userId;
	} else if (userData.type === USER_TYPES.USER.key) {
		criteria['$or'] = [{ user1Id: userId }, { user2Id: userId }];
	}

	if (listUpcoming) {
		criteria['scheduledFrom'] = { $gte: currentTimeStamp.toISOString() };
	} else {
		criteria['scheduledFrom'] = { $lt: currentTimeStamp.toISOString() };
	}

	const scheduleList = await Mongo.findByCriteriaPaginated(SCHEDULES, criteria, { scheduledFrom: listUpcoming ? 1 : -1 }, page, pageSize);

	if (!scheduleList.length) {
		throw new Error('No schedules found.');
	}

	return Promise.all(
		scheduleList.map(async (scheduleData) => {
			return await prepareScheduleData(scheduleData);
		})
	);
};

export const fetchUpcomingSchedulesByDate = async (userId, scheduledFrom, scheduledTo) => {
	const criteria = {
		$and: [
			{ $or: [{ user1Id: userId }, { user2Id: userId }] },
			{
				$or: [
					{ scheduledFrom: { $lte: scheduledFrom }, scheduledTo: { $gte: scheduledTo } },
					{ scheduledFrom: { $lte: scheduledFrom }, scheduledTo: { $gte: scheduledFrom } },
					{ scheduledFrom: { $lte: scheduledTo }, scheduledTo: { $gte: scheduledTo } },
				],
			},
		],
	};
	
	const scheduleList = await Mongo.findByCriteria(SCHEDULES, criteria);

	return scheduleList.length ? scheduleList : [];
};

export const getSchedule = async (scheduleId) => {
	const criteria = {
		_id: scheduleId
	};

	const scheduleData = await Mongo.findOneByCriteria(SCHEDULES, criteria);

	if (!scheduleData) {
		throw new Error('No schedule with the given id exists.');
	}

    return scheduleData;
}

export const createSchedule = async (scheduleData) => {
	await Mongo.createOne(SCHEDULES, scheduleData);

	return `Schedule created.`;
};

export const deleteSchedule = async (scheduleId) => {
	const criteria = {
		_id: scheduleId
	};

	await Mongo.deleteOneByCriteria(SCHEDULES, criteria);

	return `Schedule deleted.`;
};
