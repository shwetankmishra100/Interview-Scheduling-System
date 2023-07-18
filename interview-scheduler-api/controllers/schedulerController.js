import { USER_TYPES } from '../utils/constants.js';
import * as scheduler from './../services/schedulerService.js';
import * as user from './../services/userService.js';
import * as meeting from './../services/meetingService.js';
import { sendScheduleMail } from '../services/mailService.js';

export const listUpcomingSchedules = async (email, page, pageSize) => {
	try {
		const userId = await user.fetchUserIdByEmail(email);
		return await scheduler.fetchSchedules(userId, page, pageSize, true);
	} catch (err) {
		throw err;
	}
};

export const listPastSchedules = async (email, page, pageSize) => {
	try {
		const userId = await user.fetchUserIdByEmail(email);
		return await scheduler.fetchSchedules(userId, page, pageSize, false);
	} catch (err) {
		throw err;
	}
};

export const checkAvailability = async (scheduleData) => {
	try {
		let scheduleDateTime = new Date(scheduleData.date);
		scheduleData.time = scheduleData.time.split(':');
		scheduleDateTime.setHours(scheduleData.time[0]);
		scheduleDateTime.setMinutes(scheduleData.time[1]);

		if (scheduleDateTime < new Date()) {
			throw new Error('Cannot schedule a meeting in past time.');
		}

		let formattedScheduleData = {
			userId: await user.fetchUserIdByEmail(scheduleData.userEmail),
			scheduledFrom: scheduleDateTime.toISOString(),
		};

		scheduleDateTime.setTime(scheduleDateTime.getTime() + scheduleData.duration * 60 * 1000);
		formattedScheduleData = {
			...formattedScheduleData,
			scheduledTo: scheduleDateTime.toISOString(),
		};

		const userSchedules = await scheduler.fetchUpcomingSchedulesByDate(formattedScheduleData.userId, formattedScheduleData.scheduledFrom, formattedScheduleData.scheduledTo);

		if (userSchedules.length) {
			let error = `${scheduleData.user1Email} is occupied in the following slots: [${userSchedules
				.map((schedule) => `${new Date(schedule.scheduledFrom).toUTCString()} to ${new Date(schedule.scheduledTo).toUTCString()}`)
				.join(', ')}]. `;
			throw new Error(error);
		}

		return `Provided time slots are available for ${scheduleData.userEmail}.`;
	} catch (err) {
		throw err;
	}
};

export const createSchedule = async (email, scheduleData) => {
	try {
		if (scheduleData.user1Email === scheduleData.user2Email) {
			throw new Error('Cannot schedule a meeting between same users.');
		}

		const userId = await user.fetchUserIdByEmail(email);

		if (userId.type === USER_TYPES.COMPANY.alias) {
			throw new Error('Only company accounts can create a schedule.');
		}

		let scheduleDateTime = new Date(scheduleData.date);
		scheduleData.time = scheduleData.time.split(':');
		scheduleDateTime.setHours(scheduleData.time[0]);
		scheduleDateTime.setMinutes(scheduleData.time[1]);

		if (scheduleDateTime < new Date()) {
			throw new Error('Cannot schedule a meeting in past time.');
		}

		let formattedScheduleData = {
			user1Id: await user.fetchUserIdByEmail(scheduleData.user1Email),
			user2Id: await user.fetchUserIdByEmail(scheduleData.user2Email),
			scheduledBy: userId,
			scheduledFrom: scheduleDateTime.toISOString(),
		};

		scheduleDateTime.setTime(scheduleDateTime.getTime() + scheduleData.duration * 60 * 1000);
		formattedScheduleData = {
			...formattedScheduleData,
			scheduledTo: scheduleDateTime.toISOString(),
		};

		const user1Schedules = await scheduler.fetchUpcomingSchedulesByDate(formattedScheduleData.user1Id, formattedScheduleData.scheduledFrom, formattedScheduleData.scheduledTo);
		const user2Schedules = await scheduler.fetchUpcomingSchedulesByDate(formattedScheduleData.user2Id, formattedScheduleData.scheduledFrom, formattedScheduleData.scheduledTo);

		if (user1Schedules.length || user2Schedules.length) {
			let error = '';

			if (user1Schedules.length) {
				error += `${scheduleData.user1Email} is occupied in the following slots: [${user1Schedules
					.map((schedule) => `${new Date(schedule.scheduledFrom).toUTCString()} to ${new Date(schedule.scheduledTo).toUTCString()}`)
					.join(', ')}]. `;
			}
			if (user2Schedules.length) {
				error += `${scheduleData.user1Email} is occupied in the following slots: [${user2Schedules
					.map((schedule) => `${new Date(schedule.scheduledFrom).toUTCString()} to ${new Date(schedule.scheduledTo).toUTCString()}`)
					.join(', ')}]`;
			}

			throw new Error(error);
		}

		const response = await scheduler.createSchedule(formattedScheduleData);

		const meetingData = {
			emails: [scheduleData.user1Email, scheduleData.user2Email, email],
			scheduledFrom: new Date(formattedScheduleData.scheduledFrom),
			scheduledTo: new Date(formattedScheduleData.scheduledTo),
			scheduledBy: email,
		};
		await meeting.createMeeting(meetingData);

		const mailData = {
			scheduledFrom: new Date(formattedScheduleData.scheduledFrom).toUTCString(),
			scheduledTo: new Date(formattedScheduleData.scheduledTo).toUTCString(),
			scheduledBy: email,
		};
		await sendScheduleMail("", scheduleData.user2Email, { ...mailData, scheduledWith: scheduleData.user1Email });
		await sendScheduleMail("", scheduleData.user1Email, { ...mailData, scheduledWith: scheduleData.user2Email });

		return response;
	} catch (err) {
		throw err;
	}
};

export const deleteSchedule = async (email, scheduleId) => {
	try {
		let userId = await user.fetchUserIdByEmail(email);
		let scheduleData = await scheduler.getSchedule(scheduleId);

		if (`${scheduleData.scheduledBy}` !== `${userId}`) {
			throw new Error('Schedule can be deleted only by the scheduler user.');
		}

		return await scheduler.deleteSchedule(scheduleId);
	} catch (err) {
		throw err;
	}
};
