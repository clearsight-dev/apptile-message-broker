import express, { Router } from 'express';
import Organization from '../models/organization';
import { ResponseBuilder } from '../helpers';
import { authenticated } from '../middlewares/auth';
import User from '../models/user';

const OrgRouter = Router();
OrgRouter.use(express.json());

OrgRouter.get('/', authenticated, async function (req: express.Request, res: express.Response) {
  const authUser = req["user"]
  const userOrgs = await User.findByPk(authUser.id, {
    include: [
      {
        model: Organization,
        as: "organizations",
        attributes: ["uuid", "name"],
        through: {
          attributes: [],
        },
      },
    ],
    order: [
      ['organizations' ,'apps','id', 'DESC'], 
    ]
  })

  ResponseBuilder.Ok(res, userOrgs.get('organizations'))
});

export default OrgRouter;
