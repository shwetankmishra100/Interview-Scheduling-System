import * as Mongo from '../data/mongo/mongoHelper.js';
import { USERS } from '../data/mongo/mongoCollections.js';
import { compareHash, generateHash, generateRandomToken } from '../utils/encryption.js';
import { createSession, deleteSession } from './sessionService.js';
import { sendPasswordCreationMail } from './mailService.js';

export const verifyLogin = async (email, password) => {
	let criteria = {
		email: email,
	};

	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	if (!userData.password) {
		throw new Error('No password associated with the given email.');
	}
	
	if (!(await compareHash(password, userData.password))) {
		throw new Error('Password entered is incorrect.');
	}

	const session = await createSession(userData._id);
	userData['sessionId'] = session;

	delete userData._id;
	delete userData.password;
	delete userData.passwordVerificationToken;

	return userData;
};

export const verifyLogout = async (sessionId) => {
	await deleteSession(sessionId);

	return 'User logged out.';
};

export const sendPasswordVerificationMail = async (email) => {
	let criteria = {
		email: email,
	};

	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	const passwordVerificationToken = generateRandomToken();
	await Mongo.updateOneByCriteria(USERS, criteria, { passwordVerificationToken });
	await sendPasswordCreationMail(userData.name, email, passwordVerificationToken);

	return `Password verification email sent to ${email}`;
};

export const verifyPasswordToken = async (email, passwordVerificationToken) => {
	let criteria = {
		email: email,
	};

	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	if (!userData.passwordVerificationToken) {
		throw new Error('No password token associated with the given email.');
	}

	if (passwordVerificationToken !== userData.passwordVerificationToken) {
		throw new Error('Password verification token entered is incorrect.');
	}

	return true;
};

export const verifyCurrentPassword = async (email, currentPassword) => {
	let criteria = {
		email: email,
	};

	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	if (!userData.password) {
		throw new Error('No password associated with the given email.');
	}

	if (!(await compareHash(currentPassword, userData.password))) {
		throw new Error('Current password entered is incorrect.');
	}

	return true;
};

export const setNewPassword = async (email, newPassword) => {
	let criteria = {
		email: email,
	};

	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	const passwordHash = await generateHash(newPassword);
	const response = await Mongo.rawUpdateOneByCriteria(USERS, criteria, { $set: { password: passwordHash }, $unset: { passwordVerificationToken: '', inviteAccepted: "" } });

	if (!response) {
		throw new Error('Some unknown error occured. Unable to update password.');
	}

	return `New password set for ${email}`;
};