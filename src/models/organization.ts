

import { DataTypes, Model, Optional } from "sequelize";
import AppDatabase from "../database";

interface OrganizationAttributes {
  id: number;
  uuid: string;
  name: string;
  hostname: string;
  website: string;
  status: string;
}

interface OrganizationCreationAttributes
  extends Optional<
  OrganizationAttributes,
  "id"
  > { }

export default class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes {
  declare id: number; // Note that the `null assertion` `!` is required in strict mode.
  declare uuid: string;
  declare name: string;
  declare hostname: string;
  declare website: string;
  declare status: string;

  // timestamps!
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

 }

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },

    hostname: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    website: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "organizations",
    sequelize: AppDatabase.sequelize,
  }
);
