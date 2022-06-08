import express, { Router } from 'express';
import { AppConfig } from '../config';
import { jwt, ResponseBuilder } from '../helpers';
import User from '../models/user';

const UsersRouter = Router();
UsersRouter.use(express.json());

UsersRouter.post('/register', async function (req: express.Request, res: express.Response) {
  const payload = req.body;
  const email = payload.email.toLowerCase()
  try {
    const user = await User.create({
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: email,
      password: payload.password,
      contactNumber: payload.contactNumber,
    });

    const tokenPayload = {
      loggedIn: true,
      email,
      userId: user.get('id'),
    };

    const token = jwt.createToken(
      tokenPayload,
      (AppConfig.app.cookie.maxAgeDuration) / 1000
    );
    user.lastLogginIn = new Date()
    user.save()
    ResponseBuilder.Created(res, { accessToken: token })

  }
  catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      ResponseBuilder.BadRequest(res, `Email ${payload.email} already exists!`)
    } else {
      ResponseBuilder.InternalServerError(res, e)
    }
  }
});


UsersRouter.post('/login', async function (req: express.Request, res: express.Response) {
  const payload = req.body;
  const email = payload.email?payload.email.toLowerCase():undefined;
  const password = payload.password;
  const rememberMe = payload?.rememberMe ? true : false;

  try {
    const user = await User.scope("withPassword").findOne({
      where: { email: email },
    })

    if (!user) throw new Error('username does not exists!');

    if (!user.validPassword(password)) {
      throw new Error('Wrong username/password!')
    };

    const tokenPayload = {
      loggedIn: true,
      email,
      userId: user.get('id'),
    };

    const token = jwt.createToken(
      tokenPayload,
      (rememberMe
        ? AppConfig.app.cookie.maxAgeLongDuration
        : AppConfig.app.cookie.maxAgeDuration) / 1000
    );
    user.lastLogginIn = new Date()
    user.save()
    ResponseBuilder.Created(res, { accessToken: token })
  } catch (error) {
    ResponseBuilder.Unauthorized(res, error)
  }
});


export default UsersRouter;
