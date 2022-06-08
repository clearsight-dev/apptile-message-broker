import {config as defaults} from "./lib/defaults";
import {config as devConfig} from "./lib/dev";
import {config as prodConfig} from "./lib/prod";
import {config as stageConfig} from "./lib/staging";
import {merge} from "lodash";

export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : NestedPartial<T[K]>;
};

export interface ICookie {
  name: string;
  maxAgeDuration: number;
  maxAgeLongDuration: number;
}

export interface ISite {
  protocol: string;
  domainName: string;
}

export interface IApp {
  secret: string;
  cookie: ICookie;
  site: ISite;
  port: number;
  debug: boolean;
}

export interface IMain {
  host: string;
  user: string;
  password: string;
  database: string;
  charset: string;
}

export interface IDb {
  main: IMain;
}

export interface IAppConfig {
  app: IApp;
  db: IDb;
}

function __getEnvConfig(): NestedPartial<IAppConfig> {
  switch (process.env.NODE_ENV) {
    case "production":
      return prodConfig;
    case "staging":
      return stageConfig;
    case "development":
      return devConfig;
    default:
      return {};
  }
}

// var config = {};
// exports = module.exports = _.defaultsDeep(config, __getEnvConfig(), defaults);

// export const AppConfig: IAppConfig = defaults;
export const AppConfig: IAppConfig = merge(defaults, __getEnvConfig());
