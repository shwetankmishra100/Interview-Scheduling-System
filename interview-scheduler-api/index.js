import express from 'express';
import cors from 'cors';

import { validateRequest } from './routes/apiValidation.js';
import { errorLogger, requestLogger, responseLogger, serviceStamp } from './utils/logger.js';
import { prepareSession } from './utils/session.js';
import { initializeMongo } from './data/mongo/mongoHelper.js';
import { initializeEncryption } from './utils/encryption.js';
import { initializeMailer } from './utils/mailer.js';
import { initializeGoogleAPIs } from './utils/googleApis.js';

import auth from './routes/auth.js';
import scheduler from "./routes/scheduler.js";
import user from "./routes/user.js";

const getServiceStamp = (color) => {
	return serviceStamp("[App]:", "cyan", color);
}

console.log(`\n${getServiceStamp()} Initializing application ...`);

const app = express();

app.use(express.json());

app.use(cors({
	origin: '*'
}))

app.use(requestLogger);
app.use(validateRequest);
app.use(prepareSession);

app.get('/health', async(req, res, next) => {
	res.data = 'API is healthy.';
	next();
});

app.use('/auth', auth);
app.use('/scheduler', scheduler);
app.use('/user', user);

app.use(responseLogger);
app.use(errorLogger);

const PORT = 31000;
app.listen(PORT, async (error) => {
	if (!error) {
		await initializeMongo();
		await initializeEncryption();
		await initializeMailer();
		await initializeGoogleAPIs();
		console.log(getServiceStamp(), `Server is successfully running, and app is listening on port ${PORT}.`);
	} else {
		console.log(getServiceStamp("red"), `Error occurred, server can't start.`, error);
	}
});
