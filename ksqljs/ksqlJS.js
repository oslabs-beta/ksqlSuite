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
    if(typeof name !== 'string' || typeof columnsType !== 'object' || typeof topic !== 'string' || typeof partitions !== 'number'){
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

      axios.post(this.ksqldbURL + '/ksql', {ksql: query})
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
};

module.exports = ksqljs;