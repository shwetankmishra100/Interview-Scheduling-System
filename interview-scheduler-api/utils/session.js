import * as _ from 'lodash';
import * as session from '../services/sessionService.js';
import * as user from '../services/userService.js';
import { validateSessionCheck } from '../routes/apiValidation.js';

export const prepareSession = async (req, res, next) => {
	try {
		if (validateSessionCheck(req.method, req._parsedUrl.pathname)) {
			const sessionId = req.headers['session-id'];

			if (!sessionId) {
				throw new Error('No session id found in the request. Unable to retrieve session.');
			}

			const sessionData = await session.fetchSession(sessionId);
			const userData = await user.fetchUserById(sessionData.userId);
			await session.updateSessionTimestamp(sessionId);

			req.session = {
				sessionId: sessionId,
				...userData,
			};
		}

		next();
	} catch (err) {
		next(err);
	}
};
