const axios = require("axios");
const http2 = require("http2");

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
          headers: {
            Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, 'utf8').toString('base64')}`
          }
        })
      .then((res) => res.data)
      .catch((error) => { throw error });
  }

  //---------------------Push queries (continue to receive updates to stream)-----------------
  push = (query, cb) => {
    return new Promise((resolve, reject) => {
      let sentQueryId = false;
      const session = http2.connect(this.ksqldbURL);
  
      session.on("error", (err) => console.error(err));

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
          resolve(JSON.parse(chunk)?.queryId)
        } else cb(chunk);
      });
  
      req.on("end", () => session.close());
    })
  }

  //---------------------Terminate existing push queries-----------------
  terminate = (queryId) => {
    return axios.post(this.ksqldbURL + '/ksql', { ksql: `TERMINATE ${queryId};` })
      .then(res => res.data[0])
      .catch(error => {throw error});
  }

  //---------------------List existing streams, tables, topics, and queries-----------------
  ksql = (query) => {
    return axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .then(res => res.data[0])
      .catch(error => console.log(error));
  }

  //---------------------Create streams-----------------
  createStream = (name, columnsType, topic, value_format = 'json', partitions = 1, key) => {
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

};

module.exports = ksqljs;