import * as Mongo from '../data/mongo/mongoHelper.js';
import { SESSIONS } from '../data/mongo/mongoCollections.js';

export const createSession = async (userId) => {
    let sessionObj = {
        userId: userId,
        lastActiveAt: new Date(),
    };

    let session = await Mongo.createOne(SESSIONS, sessionObj);

    return session;
};

export const fetchSession = async (sessionId) => {
    let criteria = {
        _id: sessionId
    };

    const sessionData = await Mongo.findOneByCriteria(SESSIONS, criteria);

	if (!sessionData) {
		throw new Error('No session found for this user.');
	}

    return sessionData;
};

export const updateSession = async (sessionId, data) => {
    let criteria = {
        _id: sessionId
    };

    await Mongo.updateOneByCriteria(SESSIONS, criteria, data);
};

export const updateSessionTimestamp = async (sessionId) => {
    let criteria = {
        _id: sessionId
    };

    const response = await Mongo.updateOneByCriteria(SESSIONS, criteria, {lastActiveAt: new Date()});
    
    if(!response){
        throw new Error('No session found for this user.');
    }
};

export const deleteSession = async (sessionId) => {
    let criteria = {
        _id: sessionId
    };

    const response = await Mongo.deleteOneByCriteria(SESSIONS, criteria);

    if(!response){
        throw new Error('No session found for this user.');
    }
};
