import * as Joi from '@hapi/joi';

export default {
    create: {
        payload: Joi.object({
            _id: Joi.string().required(),
            senha: Joi.string().required(),
            token: Joi.string().required(),
            domain: Joi.string().required(),
            webhook: Joi.string().required(),
            autoload: Joi.boolean().required()
        })
    },
    updateById: {
        params: Joi.object({
            id: Joi.string().required(),
        }),
        payload: Joi.object({
            senha: Joi.string().required(),
            token: Joi.string().required(),
            domain: Joi.string().required(),
            webhook: Joi.string().required(),
            autoload: Joi.boolean().required()
        }),
    },
    getById: {
        params: {
            USER_ID: Joi.string().required(),
        },
    },
    deleteById: {
        params: Joi.object({
            id: Joi.string().required(),
        }),
    },
};
