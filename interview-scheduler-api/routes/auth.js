import { Router } from 'express';
import * as auth from '../controllers/authController.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
	try {
		const { email, password, confirmPassword, type, name, phoneNumber, dob, gender, currentCompany, currentCTC, experience, resumeURL } = req.body;

		const userData = {
			type,
			email,
			password,
			confirmPassword,
			name, 
			phoneNumber, 
			dob, 
			gender, 
			currentCompany: currentCompany || "", 
			currentCTC: currentCTC || "", 
			experience: experience || "", 
			resumeURL: resumeURL || ""
		};

		res.data = await auth.signup(userData);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		res.data = await auth.login(email, password);
		next();
	} catch (err) {
		next(err);
	}
});

router.get('/logout', async (req, res, next) => {
	try {
		const { sessionId } = req.session;

		res.data = await auth.logout(sessionId);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/updatePassword', async (req, res, next) => {
	try {
		const { email } = req.session;
		const { currentPassword, newPassword } = req.body;

		res.data = await auth.updatePassword(email, currentPassword, newPassword);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/sendPasswordVerificationMail', async (req, res, next) => {
	try {
		const { email } = req.body;

		res.data = await auth.sendPasswordVerificationMail(email);
		next();
	} catch (err) {
		next(err);
	}
});

router.post('/createNewPassword', async (req, res, next) => {
	try {
		const { email, passwordVerificationToken, newPassword } = req.body;

		res.data = await auth.createNewPassword(email, passwordVerificationToken, newPassword);
		next();
	} catch (err) {
		next(err);
	}
});

export default router;
