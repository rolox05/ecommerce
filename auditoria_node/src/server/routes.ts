"use strict";

import * as express from "express";
import * as token from "../token";
import * as error from "../server/error";

// rolo dependnecies
import { NextFunction } from "connect";
import * as orderService from "../orderAudit/orderAudit.service";
import * as userService from "../authAudit/userAudit.service";
import * as articleService from "../articleAudit/articleAudit.service";
import * as imageService from "../imageAudit/imageAudit.service";


/**
 * Modulo auditoría información sobre entidades, generado por otros microservicios
 */
export function init(app: express.Express) {
  app.route("/v1/audit/order").get(validateToken, getAllOrderEntries);
  app.route("/v1/audit/order/:orderId").get(validateToken, getOrderEntries);

  app.route("/v1/audit/user").get(validateToken, getAllUserEntries);
  app.route("/v1/audit/user/:userId").get(validateToken, getUserEntries);

  app.route("/v1/audit/article").get(validateToken, getAllArticlesEntries);
  app.route("/v1/audit/article/:articleId").get(validateToken, getArticleEntries);

  app.route("/v1/audit/image").get(validateToken, getAllImagesEntries);
  app.route("/v1/audit/image/:imageId").get(validateToken, getImageEntries);
}

interface IUserSessionRequest extends express.Request {
  user: token.ISession;
}

interface IOrderRequest extends express.Request {
  orderId: string;
  from: number;
  to: number;
}
/**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
function validateToken(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  const auth = req.header("Authorization");
  if (!auth) {
    return error.handle(res, error.newError(error.ERROR_UNAUTHORIZED, "Unauthorized"));
  }

  token.validate(auth)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => error.handle(res, err));
}

/**
 * @api {get} /v1/audit/order/{orderId} Audit Order
 * @apiName AuditOrder
 * @apiGroup Auditoria
 *
 * @apiDescription Permite Auditar las acciones realizadas sobre la orden orderId
 * @apiSuccessExample {string} Body
 *    HTTP/1.1 200 Ok
 *         [
 *           {
 *               "_id": "{id de acción}"
 *               "fecha": "{timestamp}",
 *               "cartId": "{string}",
 *               "userId": "{string}",
 *               "articles": [
 *               		articleId: String,
 *                  quantity: number
 * 	              ],
 *             	 "method": String
 *            	 "amount": number,
 *           },
 *           ...
 *       ]
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function getOrderEntries(req: IOrderRequest, res: express.Response) {
  try {
    let from: Date;
    let to: Date;
    if (req.query) {
      if (req.query.from) {
        from = new Date(+req.query.from);
      }
      if (req.query.to) {
        to = new Date(+req.query.to);
      }
    }

    let orderId: string;
    if (req.params && req.params.orderId) {
      orderId = req.params.orderId;
    }

    const orders = await orderService.findOrderEntries({
      orderId: orderId,
      from: from,
      to: to
    });

    res.json(orders);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}


async function getAllOrderEntries(req: IOrderRequest, res: express.Response) {
  try {
    const orders = await orderService.findAllOrdersEntries();

    res.json(orders);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}

// User for audit of auth queries
interface IUserRequest extends express.Request {
  userId: string;
  from: number;
  to: number;
}

/**
 * @api {get} /v1/audit/user/{userId} Audit User
 * @apiName Audituser
 * @apiGroup Auditoria
 *
 * @apiDescription Permite Auditar las acciones realizadas por el usuario userId
 * @apiSuccessExample {json} Mensaje
 *     {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         "userData": {
 *             name: string,
 *             login: string,
 *             permissions: string[],
 *             updated: Date,
 *             created: Date,
 *             enabled: Boolean
 *             editor: editor,
 *             target: target,
 *             changes: changes, (roles added/removed)
 *             action: action (grant, revoke, enable, disable)
 *           },
 *   		 "user": string,
 *    	 "action": string
 *    }
 */
async function getUserEntries(req: IUserRequest, res: express.Response) {
  try {
    let from: Date;
    let to: Date;
    if (req.query) {
      if (req.query.from) {
        from = new Date(+req.query.from);
      }
      if (req.query.to) {
        to = new Date(+req.query.to);
      }
    }

    let userId: string;
    if (req.params && req.params.userId) {
      userId = req.params.userId;
    }

    const userEntries = await userService.findUserEntries({
      userId: userId,
      from: from,
      to: to
    });

    res.json(userEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}


async function getAllUserEntries(req: IUserRequest, res: express.Response) {
  try {
    const userEntries = await userService.findAllUsersEntries();

    res.json(userEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}

// Article for audit of articles queries
interface IArticleRequest extends express.Request {
  articleId: string;
  from: number;
  to: number;
}

/**
 * @api {get} /v1/audit/article/{articleId} Audit Artículo
 * @apiName AuditArticle
 * @apiGroup Auditoria
 *
 * @apiDescription Permite Auditar las acciones realizadas sobre el artículo articleId
 * @apiSuccessExample {string} Body
 *    HTTP/1.1 200 Ok
 *         [
 *            {
 *               "userId": "String",
 *               "userName": "string",
 *               "action": "string",
 *               "articleName": "string",
 *               "articleId": "string",
 *               "date": "Date",
 *               "_id": "string",
 *               "articleData": {
 *                   "id": "string",
 *                   "name": "string",
 *                   "description": "string",
 *                   "price": number,
 *                   "stock": number,
 *                   "enabled": boolean,
 *                   "quantity": number,
 *                   "orderId": string
 *               },
 *               "__v": 0
 *           }
 *           ...
 *       ]
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function getArticleEntries(req: IArticleRequest, res: express.Response) {
  try {
    let from: Date;
    let to: Date;
    if (req.query) {
      if (req.query.from) {
        from = new Date(+req.query.from);
        console.log(from);
      }
      if (req.query.to) {
        to = new Date(+req.query.to);
        console.log(to);
      }
    }

    let articleId: string;
    if (req.params && req.params.articleId) {
      articleId = req.params.articleId;
    }

    const articleEntries = await articleService.findArticleEntries({
      articleId: articleId,
      from: from,
      to: to
    });

    res.json(articleEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}


async function getAllArticlesEntries(req: IArticleRequest, res: express.Response) {
  try {
    const articleEntries = await articleService.findAllArticlesEntries();

    res.json(articleEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}


// Image for audit of images queries
interface IImageRequest extends express.Request {
  imageId: string;
  from: number;
  to: number;
}

/**
 * @api {get} /v1/audit/image/{imageId} Audit Image
 * @apiName AuditImage
 * @apiGroup Auditoria
 *
 * @apiDescription Permite Auditar las acciones realizadas sobre el imagen imageId
 * @apiSuccessExample {string} Body
 *    HTTP/1.1 200 Ok
 *         [
 *           {
 *               "_id": "{id de acción}"
 *        	     "imagenid": "{imagenId}",
 *              “action”: “{action}”,
 *              "date": "{timeStamp}"
 *           },
 *           ...
 *       ]
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function getImageEntries(req: IImageRequest, res: express.Response) {
  try {
    let from: Date;
    let to: Date;
    if (req.query) {
      if (req.query.from) {
        from = new Date(+req.query.from);
      }
      if (req.query.to) {
        to = new Date(+req.query.to);
      }
    }

    let imageId: string;
    if (req.params && req.params.imageId) {
      imageId = req.params.imageId;
    }

    const imageEntries = await imageService.findImageEntries({
      imageId: imageId,
      from: from,
      to: to
    });

    res.json(imageEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}


async function getAllImagesEntries(req: IImageRequest, res: express.Response) {
  try {
    const imageEntries = await imageService.findAllImagesEntries();

    res.json(imageEntries);
    //   .map(u => {
    //   return {
    //     id: u.id,
    //     name: u.name,
    //     login: u.login,
    //     permissions: u.permissions,
    //     enabled: u.enabled
    //   };
    // }));
  } catch (err) {
    error.handle(res, err);
  }
}
