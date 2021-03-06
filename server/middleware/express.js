const { RoleList, Student, isStudent } = require('../../helpers/user');
const logger = require('../logs');
const msg = require('../utils/message');
const joiSchema = require('./schema');
const requestMiddleware = require('./request');
/**
 * Creates a middleware that tries to execute a function
 * and catch eventual errors to send them as a json response
 * @param {(req: Request, res: Response) => any} fn
 * @returns {(res: Request, res: Response) => Promise<any>}
 */
const handleErrors = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: err.message || err.Message || err.toString() });
  }
};
const defautlMiddleware = (req, res, next) => next();
/**
 * Creates a middleware that extract listing parameters,
 * pass them to a listing function and return the result
 * as a json response
 * @param {(req: Request, res: Response) => any} listFn
 */
const getCollection = (listFn) => [
  requestMiddleware(joiSchema.request.get, 'params'),
  handleErrors(async (req, res) => res.json(await listFn({ id: req.params.id }))),
];
const updateCollection = (middleware = defautlMiddleware, listFn) => [
  requestMiddleware(joiSchema.request.update, 'params'),
  middleware,
  handleErrors(async (req, res) =>
    res.json(await listFn({ id: req.params.id, data: req.body, req })),
  ),
];

const profileCollection = (middleware = defautlMiddleware, listFn) => [
  requestMiddleware(joiSchema.user.all.user.reqUser, 'user'),
  middleware,
  handleErrors(async (req, res) => res.json(await listFn(req))),
];

const deleteCollection = (listFn) => [
  requestMiddleware(joiSchema.request.delete, 'params'),
  handleErrors(async (req, res) => res.json(await listFn({ id: req.params.id }))),
];

const listCollection = (listFn) => [
  requestMiddleware(joiSchema.request.list, 'query'),
  handleErrors(async ({ query: { offset, limit } }, res) => {
    res.json(
      await listFn({
        offset: Number(offset) || undefined,
        limit: Number(limit) || undefined,
      }),
    );
  }),
];

const authCheck = (roleName) =>
  handleErrors(({ user }, res, next) => {
    let message = null;

    if (!user) message = msg.notAuthorized;
    else if (!roleName || (roleName === '*' && !RoleList.includes(user.role))) {
      message = msg.wrongInfo('role');
    } else if (roleName !== '*') {
      if (roleName === Student) {
        if (!isStudent(user)) message = msg.wrongInfo('role');
      } else if (!RoleList.includes(roleName) || user.role !== roleName) {
        message = msg.wrongInfo('role');
      }
    }
    if (message) res.status(401).json({ authenticated: false, message });
    else next();
  });

module.exports = {
  handleErrors,
  listCollection,
  getCollection,
  deleteCollection,
  updateCollection,
  profileCollection,
  authCheck,
};
