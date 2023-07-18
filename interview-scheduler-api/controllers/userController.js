import { USER_TYPES } from '../utils/constants.js';
import * as user from './../services/userService.js';

export const list = async (email, page, pageSize, searchText) => {
	try {
        return await user.fetchUsers(email, page, pageSize, searchText);
	} catch (err) {
		throw err;
	}
};

export const verifyUserExists = async (email) => {
	try {
		return await user.verifyUserExists(email);
	} catch (err) {
		throw err;
	}
};

export const inviteUser = async (invitedBy, email) => {
	try {
        await user.verifyUserExists(email);

		const userData = {
            email: email,
            type: USER_TYPES.USER.key,
			inviteAccepted: false,
			invitedBy: invitedBy,
			invitedAt: new Date()
        };

        return await user.inviteUser(userData);
	} catch (err) {
		throw err;
	}
};

export const fetchUser = async (email) => {
	try {
		return await user.fetchUserByEmail(email);
	} catch (err) {
		throw err;
	}
};

export const updateUser = async (email, userData) => {
	try {
		if(!Object.keys(userData).length){
			throw new Error("No data to update.");
		}

		return await user.updateUser(email, userData);
	} catch (err) {
		throw err;
	}
};
