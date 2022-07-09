import { Agent } from "node:https";

export interface ksqlResponse {
  streams: [{ name?: string }];
  data: [];
  wasTerminated?: boolean;
  tables: { name?: string }[];
  commandId: string;
}

export interface Iksqldb {
  ksqldbURL: string | null;
  API: string | null;
  secret: string | null;
  httpsAgentAxios: Agent | null;
  httpsAgentHttp2: Object | null;
  pull: (query: string) => Promise<(string | object | number | [])[]>;
  push: (query: string, cb: Function) => Promise<ksqlResponse>;
  terminate: (queryId: string) => Promise<ksqlResponse>;
  ksql: (query: string) => Promise<ksqlResponse>;
  createStream: (
    name: string,
    columnsType: string[],
    topic: string,
    value_format: string,
    partitions: number,
    key?: number
  ) => Promise<[]>;
  createStreamAs: (
    streamName: string,
    selectColumns: string[],
    sourceStream: string,
    propertiesObj: object,
    conditions: string,
    partitionBy?: string
  ) => Promise<string>;
  createTable: (
    name: string,
    columnsType: string[],
    topic: string,
    value_format: string,
    partitions: number
  ) => void;
  createTableAs: (
    tableName: string | string[],
    source: string | string[],
    selectArray: string[],
    propertiesObj: object,
    conditionsObj: { WHERE?: string; GROUP_BY?: string; HAVING?: string }
  ) => Promise<[]>;
  insertStream: (stream: string, rows: object[]) => Promise<string[]>;
  pullFromTo: (
    streamName: string,
    timezone?: string,
    from?: (undefined | string)[],
    to?: (undefined | string)[]
  ) => Promise<(string | boolean | number)[][]>;
  inspectQueryStatus: (commandId: string) => Promise<ksqlResponse>;
  inspectServerInfo: () => Promise<ksqlResponse>;
  inspectServerHealth: () => Promise<ksqlResponse>;
  inspectClusterStatus: () => Promise<ksqlResponse>;
  terminateCluster: (topicsToDelete: string[]) => Promise<object>;
  isValidProperty: (propertyName: string) => Promise<ksqlResponse>;
}

export interface ksqlConfig {
  ksqldbURL: string | null;
  API: string | null;
  secret: string | null;
  httpsAgent: Agent | null;
}

export interface IqueryBuilder {
  build: (
    query: string,
    ...params: (string | number | boolean | string[])[]
  ) => string;
  _bind: (
    query: string,
    ...params: (string | number | boolean | string[])[]
  ) => string;
  _replaceWith: (
    param: string | number | boolean | string[]
  ) => Error | string | boolean | number;
  _checkEmptyQuery: (query: string) => boolean;
}
