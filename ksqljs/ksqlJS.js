const axios = require("axios");
const http2 = require("http2");

class ksqljs {
  constructor(ksqldbURL) {
    this.ksqldbURL = ksqldbURL;
  }

  pull = (query) => {
    return axios
      .post(this.ksqldbURL + "/query-stream", {
        sql: query,
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

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
          resolve(JSON.parse(chunk)?.queryId);
        }
        cb(chunk);
      });
  
      req.on("end", () => session.close());
    });
  }

  terminate = (queryId) => {
    return axios.post(this.ksqldbURL + '/close-query', { queryId: queryId })
      .then(res => res)
      .catch(error => console.log(error));
  }

  ksql = (query) => {
    return axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .then(res => res.data[0])
      .catch(error => console.log(error));
  }

  createStream = (name, columnsType, topic, value_format = 'json', partitions = 1, key) => {
    const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
    const query = `CREATE STREAM ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`;

    axios.post(this.ksqldbURL + '/ksql', { ksql: query })
      .catch(error => console.log(error));
  }

  createTable = (name, columnsType, topic, value_format = 'json', partitions = 1) => {
    const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
    const query = `CREATE TABLE ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}');`

    axios.post(this.ksqldbURL + '/ksql', {ksql: query})
    .catch(error => console.log(error));
  }

};

module.exports = ksqljs;
