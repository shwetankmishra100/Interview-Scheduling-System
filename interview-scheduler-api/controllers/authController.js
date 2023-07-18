import { generateHash } from '../utils/encryption.js';
import * as auth from './../services/authService.js';
import * as user from './../services/userService.js';

export const signup = async (userData) => {
	try {
		if(userData.password !== userData.confirmPassword){
			throw new Error('Passwords do not match.');
		}

		await user.verifyUserExists(userData.email);
		
		userData.password = await generateHash(userData.password);
		delete userData.confirmPassword;

		return await user.createUser(userData);
	} catch (err) {
		throw err;
	}
};

export const login = async (email, password) => {
	try {
		return auth.verifyLogin(email, password);
	} catch (err) {
		throw err;
	}
};

export const logout = async (sessionId) => {
	try {
		return await auth.verifyLogout(sessionId);
	} catch (err) {
		throw err;
	}
};

export const sendPasswordVerificationMail = async (email) => {
	try {
		return await auth.sendPasswordVerificationMail(email);
	} catch (err) {
		throw err;
	}
}

export const createNewPassword = async (email, passwordVerificationToken, newPassword) => {
	try {
		await auth.verifyPasswordToken(email, passwordVerificationToken);
		return auth.setNewPassword(email, newPassword);
	} catch (err) {
		throw err;
	}
}

export const updatePassword = async (email, currentPassword, newPassword) => {
	try {
		await auth.verifyCurrentPassword(email, currentPassword);
		return await auth.setNewPassword(email, newPassword);
	} catch (err) {
		throw err;
	}
}



