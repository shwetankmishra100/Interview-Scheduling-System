import * as mailer from './../utils/mailer.js';

export const sendPasswordCreationMail = async (name = '', to = '', passwordToken = '') => {
	try {
		name = name || "there";
		const link = `http://localhost:4200/createnewpassword?email=${to}&passwordtoken=${passwordToken}`;
		const html = `<span style="font-weight:500; font-size:18px">Hi ${name},</span><br /><br /><div>We received a request to reset your password. Please click on the button below to create a new password.<br /><br /><a href="${link}"><button style="width: 12rem; height: 3rem; background-color:#65c8f0; color:white; font-weight: bold; font-size: 16px; border-radius: 8px; text-align:center; border-width:2px;">Create new password</button></a><br /><br />Not working? Use this link to <a href="${link}">create a new password</a>.</div>`;

		mailer.sendMail([{ name: name, email: to }], 'Interview Scheduler: Account verification', '', html);
	} catch (err) {
		throw err;
	}
};

export const sendScheduleMail = async (name = '', to = '', scheduleData={}) => {
	try {
		name = name || "there";
		const link = `http://localhost:4200/interview-scheduler/view-interviews/upcoming`;
		const html = `<span style="font-weight:500; font-size:18px">Hi ${name},</span><br /><br /><div>We have scheduled an interview with ${scheduleData.scheduledWith}, on behalf of ${scheduleData.scheduledBy}. <br/>The interview shall start at <span style="color:#65c8f0">${scheduleData.scheduledFrom}</span> and end at <span style="color:#65c8f0">${scheduleData.scheduledTo}</span>. <br/>Please click on the <a href="${link}">link</a> to know more.</div>`;

		mailer.sendMail([{ name: name, email: to }], 'Interview Scheduler: Interview Scheduled', '', html);
	} catch (err) {
		throw err;
	}
};
