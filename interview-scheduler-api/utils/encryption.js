import * as bcrypt from 'bcrypt';
import * as uuid from "uuid";
import { serviceStamp } from './logger.js';

const saltRounds = 10;
let salt = null;

const getServiceStamp = (color) => {
	return serviceStamp('[Encryption]:', 'magenta', color);
};

export const initializeEncryption = async () => {
	try {
		salt = await generateSalt();
        console.log(getServiceStamp(), "Salt prepared.");
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};

export const generateSalt = async () => {
	try {
		return await bcrypt.genSalt(saltRounds);
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};

export const generateHash = async (value) => {
	try {
		return await bcrypt.hash(value, salt);
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
};

export const compareHash = async (value, hash) => {
    try {
		return await bcrypt.compare(value, hash);
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
}

export const generateRandomToken = () => {
	try {
		return uuid.v4();
	} catch (err) {
		console.log(getServiceStamp('red'), err);
	}
}
