"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestBody = void 0;
const validateRequestBody = (schema) => (req, res, next) => {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error.errors);
        return res
            .status(400)
            .json({
            errors: parsedData.error.flatten().fieldErrors,
            exotics: parsedData.error.flatten().formErrors,
        });
    }
    req.body = parsedData.data;
    next();
};
exports.validateRequestBody = validateRequestBody;
