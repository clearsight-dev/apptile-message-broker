import express from 'express';
import _ from 'lodash';
import User from '../models/user';
import { jwt } from '../helpers';
// import {AppConfig} from '../config';
// import * as Helpers from '../helpers';
// import User from '../models/user';

export async function authenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Missing Bearer token in authorization header" });
    return;
  }

  if (authHeader) {
    const matches = authHeader.match(/^Bearer (.+)$/);
    if (!matches) {
      res.status(401).json({ message: "Missing Bearer token in authorization header" });
      return;
    }

    const authPayload = jwt.verifyToken(matches[1]);
    if (authPayload && authPayload.loggedIn) {
      const email = authPayload.email.toLowerCase();
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        req["user"] = user.toJSON();
        next();
        return
      }
    }
  }
  res.status(401).send();
}


