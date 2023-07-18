import * as Mongo from '../data/mongo/mongoHelper.js';
import { USERS } from '../data/mongo/mongoCollections.js';
import * as auth from './authService.js';
import { USER_TYPES } from '../utils/constants.js';

const prepareUserData = async (userData) => {
	userData.dob = userData.dob ? new Date(userData.dob).toISOString() : undefined;

	delete userData._id;
	delete userData.password;
	delete userData.passwordVerificationToken;

	return userData;
}

export const verifyUserExists = async (email) => {
	let criteria = {
		email: email,
	};
    
	const userCount = await Mongo.findCountByCriteria(USERS, criteria);

	if (userCount >= 1) {
		throw new Error('User already exists with the given email.');
	}

    return "Email is available";
}

export const fetchUserIdByEmail = async (email) => {
	let criteria = {
		email: email,
	};
    
	const userData = await Mongo.findAndProject(USERS, criteria, ['_id']);

	if (!userData || (userData && !userData.length)) {
		throw new Error('No user with the given email exists.');
	}

    return userData[0]._id;
}

export const fetchUserEmailById = async (userId) => {
	let criteria = {
		_id: userId,
	};
    
	const userData = await Mongo.findAndProject(USERS, criteria, ['email']);

	if (!userData || (userData && !userData.length)) {
		throw new Error('No user with the given id exists.');
	}

    return userData[0].email;
}

export const fetchUserByEmail = async (email) => {
	let criteria = {
		email: email,
	};
    
	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}
	
	return await prepareUserData(userData);
}

export const fetchUserById = async (userId) => {
	let criteria = {
		_id: userId
	};
    
	const userData = await Mongo.findOneByCriteria(USERS, criteria);

	if (!userData) {
		throw new Error('No user with the given email exists.');
	}

	return await prepareUserData(userData);
}

export const createUser = async (userData) => {
	await Mongo.createOne(USERS, userData);

    return `User created with email ${userData.email}.`;
}

export const fetchUsers = async (email, page, pageSize, searchText) => {
	const criteria = {
		email: {$ne: email},
		type: USER_TYPES.USER.key,
	};

	if(searchText && searchText.length){
		criteria["$or"] = [{email: { $regex: searchText, $options: 'i' }}, {name: { $regex: searchText, $options: 'i' }}];
	}
	const userList = await Mongo.findByCriteriaPaginated(USERS, criteria, {name:1}, page, pageSize);

	if(!userList.length){
		throw new Error("No users found.");
	}

	return Promise.all(userList.map(async(userData) => {
		return await prepareUserData(userData);
	}));
}

export const inviteUser = async (userData) => {
	userData.invitedBy = await fetchUserIdByEmail(userData.invitedBy);

	await createUser(userData);
	await auth.sendPasswordVerificationMail(userData.email);

	return `User invited with email ${userData.email}.`;
}

export const updateUser = async (email, userData) => {
	let criteria = {
        email: email
    };

    const response = await Mongo.updateOneByCriteria(USERS, criteria, userData);
    if(!response){
        throw new Error('No user with the given email exists.');
    }

	return `User data updated for email ${email}.`;
}