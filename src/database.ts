import {Sequelize} from 'sequelize';
import {merge} from 'lodash';
import sequelizeOptions from './config/database.js';

class Database {
  private _sequelize: Sequelize;
  private config: object;

  connect(options = {}): void {
    if (this._sequelize) {
      return;
    }
    this.config = merge({}, sequelizeOptions[process.env.NODE_ENV || 'development'], options);
    console.log(this.config);
    this._sequelize = new Sequelize(this.config);
  }

  get sequelize(): Sequelize {
    if (!this._sequelize) {
      this.connect();
    }

    return this._sequelize;
  }

  close(done: CallableFunction): void {
    if (!this._sequelize) {
      done();
      return;
    }

    this._sequelize.close().then(() => done());
  }
}

const AppDatabase = new Database();

export default AppDatabase;
