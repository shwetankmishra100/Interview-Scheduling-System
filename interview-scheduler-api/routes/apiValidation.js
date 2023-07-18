import { GENDER, USER_TYPES } from '../utils/constants.js';
import { serviceStamp } from '../utils/logger.js';

const validations = {
	POST: {
		'/auth/signup': {
			disableSessionCheck: true,
			body: {
				required: ['type', 'email', 'password', 'confirmPassword', 'name', 'phoneNumber', 'dob', 'gender'],
				optional: ['currentCompany', 'currentCTC', 'experience', 'resumeURL'],
			},
		},
		'/auth/login': {
			disableSessionCheck: true,
			body: {
				required: ['email', 'password'],
			},
		},
		'/auth/updatePassword': {
			body: {
				required: ['currentPassword', 'newPassword'],
			},
		},
		'/auth/createNewPassword': {
			disableSessionCheck: true,
			body: {
				required: ['email', 'passwordVerificationToken', 'newPassword'],
			},
		},
		'/auth/sendPasswordVerificationMail': {
			disableSessionCheck: true,
			body: {
				required: ['email'],
			},
		},
		'/scheduler/checkAvailability': {
			body: {
				required: ['userEmail', 'date', 'time', 'duration'],
			},
		},
		'/scheduler/schedule': {
			body: {
				required: ['user1Email', 'user2Email', 'date', 'time', 'duration'],
			},
		},
		'/user/updateUser': {
			body: {
				optional: ['name', 'phoneNumber', 'dob', 'gender', 'currentCompany', 'currentCTC', 'experience', 'resumeUrl'],
			},
		},
	},
	GET: {
		'/health': {
			disableSessionCheck: true,
		},
		'/auth/logout': {},
		'/scheduler/listUpcomingSchedules': {},
		'/scheduler/listPastSchedules': {},
		'/user/list': {},
		'/user/verifyUserExists': {
			query: {
				required: ['email'],
			},
		},
		'/user/inviteUser': {
			query: {
				required: ['email'],
			},
		},
		'/user/fetchUser': {
			query: {
				required: ['email'],
			},
		},
	},
	PUT: {},
	PATCH: {},
	DELETE: {
		'/scheduler/delete': {
			query: {
				required: ['scheduleId'],
			},
		},
	},
};

const schema = {
	email: {
		name: 'Email',
		type: 'email',
	},
	password: {
		name: 'Password',
		type: 'password',
	},
	confirmPassword: {
		name: 'Confirm password',
		type: 'password',
	},
	currentPassword: {
		name: 'Current password',
		type: 'password',
	},
	newPassword: {
		name: 'New password',
		type: 'password',
	},
	passwordVerificationToken: {
		name: 'Password verification token',
		type: 'string',
	},
	type: {
		name: 'User type',
		type: 'string',
		options: Object.keys(USER_TYPES),
	},
	name: {
		name: 'Name',
		type: 'string',
	},
	dob: {
		name: 'Date of birth',
		type: 'date',
	},
	resumeUrl: {
		name: 'Resume URL',
		type: 'url',
	},
	user1Email: {
		name: "User 1's email",
		type: 'email',
	},
	user2Email: {
		name: "User 2's email",
		type: 'email',
	},
	date: {
		name: 'Date',
		type: 'date',
	},
	time: {
		name: 'Time',
		type: 'time',
	},
	duration: {
		name: 'Duration',
		type: 'number',
		maximumValue: 120,
	},
	scheduleId: {
		name: 'Schedule Id',
		type: 'string',
		length: 24,
	},
	phoneNumber: {
		name: 'Phone number',
		type: 'number',
		length: 10,
	},
	currentCompany: {
		name: 'Current company',
		type: 'string',
	},
	currentCTC: {
		name: 'Current CTC',
		type: 'number',
	},
	experience: {
		name: 'Experience',
		type: 'number',
	},
	resumeURL: {
		name: 'Resume URL',
		type: 'url',
	},
	gender: {
		name: 'Gender',
		type: 'string',
		options: Object.keys(GENDER),
	},
};

const getServiceStamp = (color) => {
	return serviceStamp('[Validation]:', 'orange', color);
};

export const validateSessionCheck = (method, url) => {
	if (validations && validations[method] && validations[method][url]) {
		return !(validations[method][url].disableSessionCheck || false);
	}
	return true;
};

export const validateRequest = (req, res, next) => {
	try {
		const method = req.method;
		const url = req._parsedUrl.pathname;

		if (validations && validations[method] && validations[method][url]) {
			const body = validations[method][url].body || {};
			const query = validations[method][url].query || {};

			if (body.required && body.required.length) {
				validateSchema(req.body, body.required, true);
			}

			if (body.optional && body.optional.length) {
				validateSchema(req.body, body.optional, false);
			}

			if (query.required && query.required.length) {
				validateSchema(req.query, query.required, true);
			}

			if (query.optional && query.optional.length) {
				validateSchema(req.query, query.optional, false);
			}
		}

		next();
	} catch (err) {
		next(err);
	}
};

const getFieldName = (key) => {
	if (schema[key] && schema[key].name) {
		return schema[key].name;
	}
	return key;
};

const validateSchema = (data = {}, keys = [], allKeysRequired = false) => {
	if (allKeysRequired) {
		let keysNotFound = [];
		keys.forEach((key) => {
			if (!Object.keys(data).includes(key)) {
				keysNotFound.push(key);
			}
		});

		if (keysNotFound.length) {
			if (keysNotFound.length === 1) {
				throw new Error(`${getFieldName(keysNotFound[0])} is required.`);
			} else {
				throw new Error(
					`${keysNotFound
						.slice(0, keysNotFound.length - 1)
						.map((key) => getFieldName(key))
						.join(', ')} and ${getFieldName(keysNotFound[keysNotFound.length - 1])} are required.`
				);
			}
		}
	}

	let errors = [];
	Object.keys(data).forEach((key) => {
		if (Object.keys(schema).includes(key)) {
			let field = getFieldName(key);
			let type = schema[key].type;
			let value = data[key];

			switch (type) {
				case 'number':
					errors.push(validateNumber(field, value));
					if (schema[key].options) {
						errors.push(validateOptions(field, value, schema[key].options));
					}
					if (schema[key].minimumValue) {
						errors.push(validateMinimumValue(field, value, schema[key].minimumValue));
					}
					if (schema[key].maximumValue) {
						errors.push(validateMaximumValue(field, value, schema[key].maximumValue));
					}
					break;

				case 'string':
					errors.push(validateString(field, value));
					if (schema[key].length) {
						errors.push(validateLength(field, value, schema[key].length));
					}
					if (schema[key].minimumLength) {
						errors.push(validateMinimumLength(field, value, schema[key].minimumLength));
					}
					if (schema[key].maximumLength) {
						errors.push(validateMaximumLength(field, value, schema[key].maximumLength));
					}
					if (schema[key].options) {
						errors.push(validateOptions(field, value, schema[key].options));
					}
					break;

				case 'array':
					errors.push(validateArray(field, value));
					if (schema[key].length) {
						errors.push(validateLength(field, value, schema[key].length));
					}
					if (schema[key].minimumLength) {
						errors.push(validateMinimumLength(field, value, schema[key].minimumLength));
					}
					if (schema[key].maximumLength) {
						errors.push(validateMaximumLength(field, value, schema[key].maximumLength));
					}
					break;

				case 'object':
					errors.push(validateObject(field, value));
					break;

				case 'boolean':
					errors.push(validateBoolean(field, value));
					break;

				case 'email':
					errors.push(validateEmail(field, value));
					break;

				case 'password':
					errors.push(validatePassword(field, value));
					break;

				case 'date':
					errors.push(validateISODate(field, value));
					break;

				case 'time':
					errors.push(validateTime(field, value));
					break;

				case 'url':
					errors.push(validateURL(field, value));
					break;
			}
		}
	});

	errors = errors.filter((error) => error);
	if (errors.length) {
		throw new Error(`${errors.join(', ')}`);
	}
};

const validateNumber = (field, value) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (isNaN(value)) {
		return `${field} is not a valid number.`;
	}
};

const validateString = (field, value) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (typeof value !== 'string') {
		return `${field} is not a valid string.`;
	}
};

const validateObject = (field, value) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (typeof value !== 'object' || Array.isArray(field)) {
		return `${field} is not a valid object.`;
	}
};

const validateArray = (field, value) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (typeof value !== 'object' || !Array.isArray(value)) {
		return `${field} is not a valid array.`;
	}
};

const validateBoolean = (field, value) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (typeof value !== 'boolean') {
		return `${field} is not a valid boolean.`;
	}
};

const validateLength = (field, value, length) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['string', 'array'].includes(typeof value)) {
		return `Length of ${field} cannot be validated. Length validation works only with string and array.`;
	} else if (value.length !== length) {
		return `${field} should be ${length} units in length.`;
	}
};

const validateMinimumLength = (field, value, length) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['string', 'array'].includes(typeof value)) {
		return `Length of ${field} cannot be validated. Length validation works only with string and array.`;
	} else if (value.length < length) {
		return `${field} should be minimum ${length} units in length.`;
	}
};

const validateMaximumLength = (field, value, length) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['string', 'array'].includes(typeof value)) {
		return `Length of ${field} cannot be validated. Length validation works only with string and array.`;
	} else if (value.length > length) {
		return `${field} should be maximum ${length} units in length.`;
	}
};

const validateMinimumValue = (field, value, limit) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['number'].includes(typeof value)) {
		return `Value of ${field} cannot be validated. Minimum value validation works only with number.`;
	} else if (value < limit) {
		return `Value of ${field} should be greater than or equal to ${limit}.`;
	}
};

const validateMaximumValue = (field, value, limit) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['number'].includes(typeof value)) {
		return `Value of ${field} cannot be validated. Maximum value validation works only with number.`;
	} else if (value > limit) {
		return `Value of ${field} should be less than or equal to ${limit}.`;
	}
};

const validateOptions = (field, value, options) => {
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!['string', 'number'].includes(typeof value)) {
		return `Options of ${field} cannot be validated. Options validation works only with string and number.`;
	} else if (!options.includes(value)) {
		return `Value of ${field} should be among [${options.join(', ')}].`;
	}
};

const validateEmail = (field, value) => {
	let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!emailRegex.test(value)) {
		return `${field} is not a valid email.`;
	}
};

const validatePassword = (field, value) => {
	let passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,15}$/;
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!passwordRegex.test(value)) {
		return `${field} is not a valid password. ${field} must be 8-15 characters, should contain atleast 1 special character, 1 digit, 1 lower case and 1 upper case character.`;
	}
};

const validateISODate = (field, value) => {
	let dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!dateRegex.test(value)) {
		return `${field} is not a valid date. ${field} must be in ISO string format.`;
	}
};

const validateTime = (field, value) => {
	let timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!timeRegex.test(value)) {
		return `${field} is not a valid time. ${field} must be in HH:MM format.`;
	}
};

const validateURL = (field, value) => {
	let urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
	if (!value) {
		return `${field} is empty or not defined.`;
	} else if (!urlRegex.test(value)) {
		return `${field} is not a valid URL.`;
	}
};
