import { Router } from 'express';
import * as user from '../controllers/userController.js';

const router = Router();

router.get('/list', async (req, res, next) => {
	try {
		const { email } = req.session;
		let { page, pageSize, searchText } = req.query;

		page = page ? parseInt(page, 10) : 1;
		pageSize = pageSize ? parseInt(pageSize, 10) : 10;
		searchText = searchText ? searchText : '';

		res.data = await user.list(email, page, pageSize, searchText);
		next();
	} catch (err) {
		next(err);
	}
});

router.get('/verifyUserExists', async (req, res, next) => {
	try {
		const { email } = req.query;

		res.data = await user.verifyUserExists(email);
		next();
	} catch (err) {
		next(err);
	}
});

router.get('/inviteUser', async (req, res, next) => {
	try {
		const { email: invitedBy } = req.session;
		const { email } = req.query;

		res.data = await user.inviteUser(invitedBy, email);
		next();
	} catch (err) {
		next(err);
	}
});

router.get('/fetchUser', async (req, res, next) => {
	try {
		const { email } = req.query;

		res.data = await user.fetchUser(email);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/updateUser', async (req, res, next) => {
	try {
		const { email } = req.session;
		const { name, dob, phoneNumber, gender, currentCompany, currentCTC, experience, resumeUrl } = req.body;

		const userData = {
			name: name ? name : undefined,
			dob: dob ? new Date(dob) : undefined,
			phoneNumber: phoneNumber ? phoneNumber : undefined,
			gender: gender ? gender : undefined,
			currentCompany: currentCompany ? currentCompany : undefined,
			currentCTC: currentCTC ? currentCTC : undefined,
			experience: experience ? experience : undefined,
			resumeUrl: resumeUrl ? resumeUrl : undefined,
		};

		res.data = await user.updateUser(email, userData);
		next();
	} catch (err) {
		next(err);
	}
});

export default router;
