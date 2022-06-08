import { BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, DataTypes, Model, Optional } from 'sequelize';
import AppDatabase from '../database';
import { hashPassword } from '../helpers';
import Organization from './organization';
import { UserOrganizationAttributes } from './userOrganization';

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  verified?: boolean,
  contactNumber: string;
  status?: string;
  lastLogginIn?: Date,
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {

  declare id: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;

  declare password: string;
  declare verified: boolean;
  declare contactNumber: string;
  declare status?: string;
  declare lastLogginIn: Date;


  // timestamps!
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public validPassword(candidatePwd) {
    return hashPassword.compareHash(candidatePwd, this.password)
  }

  declare addOrganization: BelongsToManyAddAssociationMixin<Organization, UserOrganizationAttributes>;
  declare getOrganizations: BelongsToManyGetAssociationsMixin<Organization>;

  declare countOrganizations: BelongsToManyCountAssociationsMixin;

}

const setPassword = (user: User) => {
  if (user.changed('password')) {
    user.password = hashPassword.hash(user.password)
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: new DataTypes.STRING(255),
      allowNull: false
    },
    lastname: {
      type: new DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg:
            '"email" field should be email type text ie. username@apptile.com'
        }
      }
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    contactNumber: {
      type: new DataTypes.STRING(255),
    },
    status: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'active'
    },
    lastLogginIn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
  },
  {
    tableName: 'users',
    sequelize: AppDatabase.sequelize,
    hooks: {
      beforeCreate: setPassword,
      beforeUpdate: setPassword,
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      }
    }
  }
);


