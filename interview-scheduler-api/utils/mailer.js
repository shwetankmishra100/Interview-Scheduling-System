import config from 'config';
import Mailjet from 'node-mailjet';
import { serviceStamp } from './logger.js';

let mailer = null;

const getServiceStamp = (color) => {
	return serviceStamp('[Mailer]:', 'magenta', color);
};

export const initializeMailer = async () => {
	try {
		mailer = Mailjet.apiConnect(config.mailer.apiKey, config.mailer.apiSecret, {
			config: {},
			options: {},
		});

		console.log(getServiceStamp(), 'Mailer initialized.');
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};

export const sendMail = async (to = [], subject = '', text = '', html = '') => {
	try {
		if(!mailer){
			throw new Error("No mailer client instance found.");
		}
		
		const response = await mailer.post('send', { version: 'v3.1' }).request({
			Messages: [
				{
					From: {
						Email: config.mailer.mailerId,
						Name: config.mailer.mailerName,
					},
					To: to.map((user) => ({ Email: user.email, Name: user.name || user.email })),
					Subject: subject,
					TextPart: text,
					HTMLPart: html,
				},
			],
		});

		if (response) {
			console.log(getServiceStamp(), `Mail sent to ${[to.map((user) => user.email).join(', ')]}`);
		}
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};
