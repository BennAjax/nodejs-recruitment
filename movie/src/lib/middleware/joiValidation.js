const BadRequestError = require('../errors/BadRequestError');
const { REQUEST_BODY } = require('../constants');

const validate =
  (schema, source = REQUEST_BODY) =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source], { abortEarly: false });

      if (!error) return next();

      const { details } = error;
      const messageDetails = details.map((i) => i.message.replace(/['"]+/g, '')).join(', ');

      return next(new BadRequestError(messageDetails));
    } catch (error) {
      return next(error);
    }
  };

module.exports = validate;
