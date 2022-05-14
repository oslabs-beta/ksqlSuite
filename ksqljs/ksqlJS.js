const axios = require("axios");
const http2 = require("http2");

const ksqljs = (ksqldbURL) => {
  return {
    //---------------------Pull queries (fetch a single batch of existing rows)-----------------
    pull: (query) => {
      return axios
        .post(ksqldbURL + "/query-stream", {
          sql: query,
        })
        .then((res) => res.data)
        .catch((error) => console.log(error));
    },
    //---------------------Push queries (continue to receive updates to stream-----------------
    push: (query, cb) => {
      return new Promise((resolve, reject) => {
        let sentQueryId = false;
        let queryMetadata;
        const session = http2.connect(ksqldbURL);
  
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
            queryMetadata = chunk;
            resolve(JSON.parse(chunk)?.queryId);
          }
          cb(chunk);
        });
  
        req.on("end", () => session.close());
      });
    },
    //---------------------Terminate existing push queries-----------------
    terminate: (queryId) => {
        return axios.post(ksqldbURL + '/close-query', {queryId: queryId})
        .then(res => res)
        .catch(error => console.log(error));
    },
    //---------------------List existing streams, tables, topics, and queries-----------------
    ksql: (query) => {
        return axios.post(ksqldbURL + '/ksql', {ksql: query})
        .then(res => res.data[0])
        .catch(error => console.log(error));
    },
    //---------------------Create streams-----------------
    createStream: (name, columnsType, topic, value_format = 'json', partitions=1, key) => {
        const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
        const query = `CREATE STREAM ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`;

        axios.post(ksqldbURL + '/ksql', {ksql: query})
        .catch(error => console.log(error));
    },
    //---------------------Create tables-----------------
    createTable: (name, columnsType, topic, value_format = 'json') => {
      const columnsTypeString = columnsType.reduce((result, currentType) => result + ', ' + currentType);
      const query = `CREATE TABLE ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}');`

      axios.post(ksqldbURL + '/ksql', {ksql: query})
      .catch(error => console.log(error));
    }
  };
};

module.exports = ksqljs;
 