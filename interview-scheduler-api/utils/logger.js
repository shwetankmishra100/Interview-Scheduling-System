import chalk from 'chalk';

export const serviceStamp = (stamp, defaultColor, customColor) => {
	if(customColor && chalk[customColor]){
		return `${chalk[customColor](stamp)}`;
	}else if(defaultColor && chalk[defaultColor]){
		return `${chalk[defaultColor](stamp)}`;
	}else{
		return `${chalk.white(stamp)}`;
	}
}

export const requestLogger = (req, res, next) => {
	console.log(`\n${chalk.blue('[Time]:')} ${new Date()} | ${chalk.blue('[Method]:')} ${req.method} | ${chalk.blue('[Route]:')} ${req.originalUrl}`);
	next();
};

export const responseLogger = (req, res, next) => {
	if (!res.data) {
		res.status(404).send({ ok: false, error: { reason: 'Invalid Endpoint', code: 404 } });
		return;
	}

	console.log(`${chalk.green('[Response]:')} ${req.method} ${req.originalUrl} ${res.statusCode}`);
    console.log(res.data);

	res.status(res.statusCode || 200).send({ ok: true, response: res.data });
};

export const errorLogger = (err, req, res, next) => {
	console.log(`${chalk.red('[Error]:')} ${req.method} ${req.originalUrl}`);
    console.log(err);
    
	res.status(err.status || 400).send({
		ok: false,
		error: {
			code: err.code || 1000,
			reason: err.message,
		},
	});
};
