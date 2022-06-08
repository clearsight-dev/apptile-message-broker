import { DataTypes, Model, Optional } from 'sequelize';
import AppDatabase from '../database';
import Organization from './organization';
import User from './user';

export interface UserOrganizationAttributes {
  id: number;
  userId: number;
  organizationId: number;
  deletedAt?: Date,
}
interface UserOrganizationCreationAttributes extends Optional<UserOrganizationAttributes, 'id'> {}

export default class UserOrganization
  extends Model<UserOrganizationAttributes, UserOrganizationCreationAttributes>
  implements UserOrganizationAttributes
{
  declare id: number;  
  declare userId: number;
  declare organizationId: number;
  declare deletedAt?: Date;

  // timestamps!
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
 

UserOrganization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: 'id'
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    tableName: 'user_organizations',
    sequelize: AppDatabase.sequelize
  }
);
