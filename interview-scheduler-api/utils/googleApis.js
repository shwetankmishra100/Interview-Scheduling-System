import config from "config";
import {google} from 'googleapis';
import { serviceStamp } from './logger.js';

let client = null;
const calendar = google.calendar({version : "v3"});
const scopes = 'https://www.googleapis.com/auth/calendar';
const credentials = config.google.credentials;
const calendarId = config.google.calendarId;

const getServiceStamp = (color) => {
	return serviceStamp('[Google APIs]:', 'magenta', color);
};

export const initializeGoogleAPIs = async () => {
	try {
		client = new google.auth.JWT(
			credentials.client_email,
			null,
			credentials.private_key,
			scopes
		);

		console.log(getServiceStamp(), 'Google APIs initialized.');
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};


// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

export const insertEventInGoogleCalendar = async (event) => {
	try {
		if(!client){
			throw new Error("No google api client instance found.");
		}
		let response = await calendar.events.insert({
            auth: client,
            calendarId: calendarId,
            resource: event
        });

		if (response) {
			console.log(getServiceStamp(), 'Event inserted.', response);
		}
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
}