import { Router } from 'express';
import * as scheduler from '../controllers/schedulerController.js';

const router = Router();

router.get('/listUpcomingSchedules', async (req, res, next) => {
	try {
        const { email } = req.session;
		let { page, pageSize } = req.query;

        page = page ? parseInt(page, 10): 1;
		pageSize = pageSize ? parseInt(pageSize, 10): 10;

		res.data = await scheduler.listUpcomingSchedules(email, page, pageSize);
		next();
	} catch (err) {
		next(err);
	}
});

router.get('/listPastSchedules', async (req, res, next) => {
	try {
        const { email } = req.session;
		let { page, pageSize } = req.query;

        page = page ? parseInt(page, 10): 1;
		pageSize = pageSize ? parseInt(pageSize, 10): 10;

		res.data = await scheduler.listPastSchedules(email, page, pageSize);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/checkAvailability', async (req, res, next) => {
	try {
		const { userEmail, date, time, duration } = req.body;
		const scheduleData = {
			userEmail, 
			date, 
			time, 
			duration
		};

		res.data = await scheduler.checkAvailability(scheduleData);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/schedule', async (req, res, next) => {
	try {
        const { email } = req.session;
		const { user1Email, user2Email, date, time, duration } = req.body;
		const scheduleData = {
			user1Email, 
			user2Email, 
			date, 
			time, 
			duration
		};

		res.data = await scheduler.createSchedule(email, scheduleData);
		next();
	} catch (err) {
		next(err);
	}
});

router.delete('/delete', async (req, res, next) => {
	try {
        const { email } = req.session;
		let { scheduleId } = req.query;

		res.data = await scheduler.deleteSchedule(email, scheduleId);
		next();
	} catch (err) {
		next(err);
	}
});

export default router;
