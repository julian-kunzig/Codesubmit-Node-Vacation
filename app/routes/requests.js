const Joi = require('joi');
const { RequestModule } = require('../modules');
const { validate } = require('../middleware');

const requestRegisterSchema = Joi.object({
	email: Joi.string().email().required(),
  vacation_start_date: Joi.date().required(),
  vacation_end_date: Joi.date().required()
});

const requsetDecisionSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
  resolved_by: Joi.string().required()
});

module.exports = (app) => {
  /**
   * View the requestions.
   * 
   */
  app.get('/v1/requests/:userId', (req, res, next) => {
    const payload = {
      userId: req.params.userId,
      filter: req.query.filter
    };

		RequestModule.getRequestsByUser(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
  });

  /**
   * Get the remaining days by User.
   * 
   */
  app.get('/v1/requests/remain/:userId', (req, res, next) => {
    const payload = {
      userId: req.params.userId
    };

    RequestModule.getRemainByUser(payload)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  })

  /**
   * Get the overlapping requests.
   * 
   */
  app.get('/v1/admin/requests/overlap', (req, res, next) => {
    const payload = {
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    RequestModule.getOverlapRequest(payload)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  });
  
  /**
   * Make the requestion.
   * 
   */
  app.post('/v1/requests', validate(requestRegisterSchema), (req, res, next) => {
    const payload = req.body;

		RequestModule.registerRequestByUser(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err));
  });
  
  /**
   * Update the requestion
   * Approve or Reject
   * 
   */
  app.put('/v1/admin/requests', validate(requsetDecisionSchema), (req, res, next) => {
		const payload = req.body;

		RequestModule.updateRequest(payload)
			.then(result => res.status(200).json(result))
			.catch(err => next(err))
  });
};
