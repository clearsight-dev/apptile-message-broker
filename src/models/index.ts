import Organization from './organization';
import User from './user';
import UserOrganization from './userOrganization';

export function dbInit() {
  // Here we associate which actually populates out pre-declared `association` static and other methods.


  Organization.belongsToMany(User, { through: UserOrganization,  foreignKey: "organizationId", as:'users', otherKey:"userId"});
  User.belongsToMany(Organization, { through: UserOrganization, foreignKey: "userId", otherKey: "organizationId", as:'organizations'});

}
