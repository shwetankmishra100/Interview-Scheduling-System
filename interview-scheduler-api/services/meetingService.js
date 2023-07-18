import * as googleApis from './../utils/googleApis.js';

export const createMeeting = async (scheduleData = {}) => {
	try {
		let event = {
			summary: `Interview Scheduled`,
			description: `This is an interview for the job you applied, scheduled by ${scheduleData.scheduledBy}. Attendees are ${scheduleData.emails.join(", ")}`,
			start: {
				dateTime: new Date(scheduleData.scheduledFrom),
				timeZone: 'Asia/Kolkata',
			},
			end: {
				dateTime: new Date(scheduleData.scheduledTo),
				timeZone: 'Asia/Kolkata',
			},
			attendees: ["interviewscheduler.donotreply@gmail.com"],
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'email', minutes: 24 * 60 },
					{ method: 'popup', minutes: 10 },
				],
			},
		};

		await googleApis.insertEventInGoogleCalendar(event);
	} catch (err) {
		throw err;
	}
};
