const axios = require("axios");
const http2 = require("http2");
const { getPriority } = require("os");
const queryBuilder = require('./queryBuilder.js');
const builder = new queryBuilder();

class ksqljs {
  constructor(config) {
    this.ksqldbURL = config.ksqldbURL;
    this.API = config.API ? config.API : null;
    this.secret = config.secret ? config.secret : null;
  }

  //---------------------Pull queries (fetch a single batch of existing rows)-----------------
  pull = (query) => {
    return axios
      .post(this.ksqldbURL + "/query-stream",
        {
          sql: query,
        },
        {
          // headers: {
          //   Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, 'utf8').toString('base64')}`
          // }
        })
      .then((res) => res.data)
      .catch((error) => { throw error });
  }

  //---------------------Push queries (continue to receive updates to stream)-----------------

  push(query, cb) {
    return new Promise((resolve, reject) => {
      let sentQueryId = false;
      const session = http2.connect(this.ksqldbURL);

      session.on("error", (err) => reject(err));

      const req = session.request({
        ":path": "/query-stream",
        ":method": "POST",
      });

      const reqBody = {
        sql: query,
        Accept: "application/json, application/vnd.ksqlapi.delimited.v1",
      };

      req.write(JSON.stringify(reqBody), "utf8");
      req.end();
      req.setEncoding("utf8");

      req.on("data", (chunk) => {
        if (!sentQueryId) {
          sentQueryId = true;
          cb(chunk);
          resolve(JSON.parse(chunk)?.queryId)
        }
        else {
          cb(chunk);
        }
      });

      req.on("end", () => session.close());
    })
  }

  terminate(queryId) {
    return axios.post(this.ksqldbURL + '/ksql', { ksql: `TERMINATE ${queryId};` })
      .then(res => res.data[0])
      .catch(error => { return error });
    // return new Promise((resolve, reject) => {
    // const session = http2.connect(this.ksqldbURL);
    // session.on("error", (err) => console.error(err));

    // const req = session.request({
    //   ":path": "/close-query",
    //   ":method": "POST",
    // });

    // const reqBody = {
    //   queryId: queryId,
    //   Accept: "application/json, application/vnd.ksqlapi.delimited.v1",
    // };

    // req.write(JSON.stringify(reqBody), "utf8");
    // req.end();
    // req.setEncoding("utf8");

    // req.on("data", (response) => {
    //   console.log(response);
    //   resolve(response);
    // })

    // req.on("end", () => session.close());
    // })
  }

  ksql(query) {
    return axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .then(res => res.data[0])
      .catch(error => console.log(error));
  }

  createStream(name, columnsType, topic, value_format = 'json', partitions = 1, key) {
    console.log(this.ksqldbURL);
    if (typeof name !== 'string' || typeof columnsType !== 'object' || typeof topic !== 'string' || typeof partitions !== 'number') {
      return console.log("invalid input(s)")
    }
    const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
    const query = `CREATE STREAM ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`;

    return axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .then(res => res)
      .catch(error => console.log(error));
  }

  //---------------------Create tables-----------------
  createTable = (name, columnsType, topic, value_format = 'json', partitions) => {
    const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
    const query = `CREATE TABLE ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`

    axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .catch(error => console.log(error));
  }

  //---------------------Create tables as select-----------------
  createTableAs = (tableName, source, selectArray, propertiesObj, conditionsObj) => {
    let selectColStr = selectArray.reduce((result, current) => result + ', ' + current);

    // expect user to input properties object of format {topic: ... , value_format: ..., partitions: ...}
    // check for properties object, look for properties, if any are missing assign it a default value, if there's no property 
    const defaultProps = {
      topic: tableName,
      value_format: 'json',
      partitions: 1
    };
    if (propertiesObj){
        for (let key in defaultProps){
          if (!propertiesObj[key]){
            propertiesObj[key] = defaultProps[key];
          }
        }
      }
    else {
      const propertiesObj = {};
      for (let key in defaultProps){
        propertiesObj[key] = defaultProps[key];
      }
    }
    // if there's no properties Obj, assign them all default values

    // expect user to input a conditions object of format {WHERE: condition, GROUP_BY: condition, HAVING: condition};
    // generate conditions string based on object
    let conditionQuery = '';
    if (conditionsObj){
    const conditionsArr = ['WHERE', 'GROUP_BY', 'HAVING'];
    for (let i = 0; i < conditionsArr.length; i++){
      if (conditionsObj[conditionsArr[i]]){
        const sqlClause = conditionsArr[i].replace('_', ' ');
        conditionQuery = conditionQuery + `${sqlClause} ${conditionsObj[conditionsArr[i]]} `
      }
    }
  }

    // reformat for builder
    tableName = [tableName];
    selectColStr = [selectColStr];
    source = [source];
    conditionQuery = [conditionQuery]

    const builder = new queryBuilder();
    const query = builder.build(`CREATE TABLE ? WITH (kafka_topic=?, value_format=?, partitions=?) AS SELECT ? FROM ? ?EMIT CHANGES;`, tableName, propertiesObj.topic, propertiesObj.value_format, propertiesObj.partitions, selectColStr, source, conditionQuery)

    return axios.post(this.ksqldbURL + '/ksql', { ksql: query })
    .catch(error => console.log(error));
  }
  //---------------------Insert Rows Into Existing Streams-----------------
  insertStream = (stream, rows) => {
    return new Promise((resolve, reject) => {
      const msgOutput = [];

      const session = http2.connect(this.ksqldbURL);
      const req = session.request({
        ":path": "/inserts-stream",
        ":method": "POST",
      });

      let reqBody = `{ "target": "${stream}" }`;

      for (let row of rows) {
        reqBody += `\n${JSON.stringify(row)}`;
      }

      req.write(reqBody, "utf8");
      req.end();
      req.setEncoding("utf8");

      req.on("data", (chunk) => {
        msgOutput.push(JSON.parse(chunk));
      });

      req.on("end", () => {
        resolve(msgOutput);
        session.close();
      });
    })
  }

  pullFromTo = async (streamName, timezone='Greenwich', from=[undefined, '00', '00', '00'], to=['2200-03-14', '00', '00', '00']) => {
    if(!streamName || typeof timezone !== 'string' || !from 
    || typeof from[0] !== 'string' || typeof from[1] !== 'string' || typeof from[2] !== 'string' || typeof from[3] !== 'string'  
    || typeof to[0] !== 'string' || typeof to[1] !== 'string' || typeof to[2] !== 'string' || typeof to[3] !== 'string'  
    || from[0].length !== 10 || to[0].length !== 10 || from[1].length !== 2 || to[1].length !== 2 || from[2].length !== 2 || to[2].length !== 2 || from[3].length !== 2 || to[3].length !== 2
    ){
      return new Error('invalid inputs');
    }
    const userFrom = `${from[0]}T${from[1]}:${from[2]}:${from[3]}`;
    const userTo = `${to[0]}T${to[1]}:${to[2]}:${to[3]}`;
    const userFromUnix = new Date(userFrom).getTime();
    const userToUnix = new Date(userTo).getTime();
    const query = builder.build("SELECT *, CONVERT_TZ(FROM_UNIXTIME(ROWTIME), 'UTC', ?) AS DATE, ROWTIME FROM ?;", timezone, [streamName]);
    const data = await this.pull(query);
    data.shift();
    console.log(data);
    const filtered = [];
    data.map((element) => {
      if(element[element.length - 1] >= userFromUnix && element[element.length - 1] <= userToUnix){
        filtered.push(element.slice(0, element.length - 1));
      }
    })
    return filtered;
  }

  //---------------------Inspect push query status -----------------
  // https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/status-endpoint/
  // @commandId - this id is obtained when using the .ksql method (/ksql endpoint)
  //               to run CREATE, DROP, TERMINATE commands
  // The returned JSON object has two properties:
  // status (string): One of QUEUED, PARSING, EXECUTING, TERMINATED, SUCCESS, or ERROR.
  // message (string): Detailed message regarding the status of the execution statement.
  inspectQueryStatus(commandId) {
    return axios.get(this.ksqldbURL + `/status/${commandId}`)
      .then(response => response)
      .catch(error => console.log(error));
  }


  //---------------------Inspect server status -----------------
  // https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/info-endpoint/
  // The /info endpoint gives information about the version, clusterId and ksqlservice id.
  // The /healthcheck gives the health status of the ksqlDB server.
  inspectServerInfo() {
    return axios.get(this.ksqldbURL + `/info`)
      .then(response => response)
      .catch(error => console.log(error));
  }

  inspectServerHealth() {
    return axios.get(this.ksqldbURL + `/healthcheck`)
      .then(response => response)
      .catch(error => console.log(error));
  }


  //---------------------Inspect cluster status -----------------
  // https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/cluster-status-endpoint/
  // The /clusterStatus resource gives you information about the status of all ksqlDB servers in a ksqlDB cluster, which can be useful for troubleshooting
  inspectClusterStatus() {
    return axios.get(this.ksqldbURL + `/clusterStatus`)
      .then(response => response)
      .catch(error => console.log(error));
  }

  //---------------------Terminate cluster -----------------
  // https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/terminate-endpoint/
  //  To terminate a ksqlDB cluster, first shut down all of the servers, except one.
  // Then, send the TERMINATE CLUSTER request to the /ksql/terminate endpoint in the last remaining server.
  terminateCluster() {
    return axios.post(this.ksqldbURL + `/ksql/terminate`, {}, {
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        'Accept': 'application/vnd.ksql.v1+json',
        'Content-Type': 'application/vnd.ksql.v1+json'
      }
    })
      .then(response => response)
      .catch(error => console.log(error));
  }


  //---------------------Get validity of a property -----------------
  // https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/is_valid_property-endpoint/
  // The /is_valid_property resource tells you whether a property is prohibited from setting.
  isValidProperty(propertyName) {
    return axios.get(this.ksqldbURL + `/is_valid_property/${propertyName}`)
      .then(response => response)
      .catch(error => console.log(error));
  }
};

module.exports = ksqljs;
