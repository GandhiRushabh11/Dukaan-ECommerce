const Joi = require("joi");
const ErrorResponse = require("../utils/errorResponse");
class Validators {
  static createCategoryValidator() {
    return async (req, res, next) => {
      try {
        req.schema = Joi.object().keys({
          name: Joi.string()
            .trim()
            .required()
            .error(
              new ErrorResponse(`Please Provide Proper Category Name`, 404)
            ),
        });

        next();
      } catch (error) {
        new ErrorResponse(error, 500);
      }
    };
  }
}

module.exports = Validators;
