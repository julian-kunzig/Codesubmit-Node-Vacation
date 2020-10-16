const Joi = require('joi');
const { UserModule } = require('../modules');
const { validate } = require('../middleware');

const userRegisterSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	role: Joi.string()
});

module.exports = (app) => {
	/**
	 * Get the Users List
	 * 
	 */
	app.get('/v1/users', (req, res, next) => {
		const payload = {
      userId: req.query.userId,
		};
		
		UserModule.getUsers(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});

	/**
	 * Register the user
	 * 
	 */
	app.post('/v1/users', validate(userRegisterSchema), (req, res, next) => {
		const payload = req.body;

		const cred = {
			name: payload.name,
			email: payload.email,
			role: payload.role || 'employee'
		};

		UserModule.registerUser(cred)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
	});
};
