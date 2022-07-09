"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const https = require("node:https");
const http2 = require("http2");
const { ksqlDBError } = require("./customErrors");
const validateInputs = require("./validateInputs");
const queryBuilder = require("./queryBuilder");
const builder = new queryBuilder();
class ksqldb {
    constructor(config) {
        /**
         * Pulls data between two different time points.
         *
         * <p>This method may be used to pull data from within two specific points in time. The first three
         * parameters are required, with the fourth parameter being optional.
         *
         * <p>This method is sql injection protected with the use of queryBuilder.
         *
         * @param {string} streamName the name of the stream to pull data from.
         * @param {string} timeZone desired timezone that the data should conform to.
         * @param {array} from array of the format ['2200-01-01', '16', '10', '20'], with the values being
         * date, hour, minute, and second respectively.
         * @param {array} to array of the format ['2000-01-01', '16', '10', '20'], with the values being
         * date, hour, minute, and second respectively. This defaults to ['2200-03-14', '00', '00', '00'].
         * @return {array} this method returns an array that contains arrays with the data, along with an extra value at
         *         the end of the array that includes the time that the data was inserted into the ksqldb.
         */
        this.pullFromTo = (streamName, timezone = "Greenwich", from = [undefined, "00", "00", "00"], to = ["2200-03-14", "00", "00", "00"]) => __awaiter(this, void 0, void 0, function* () {
            validateInputs([streamName, "string", "streamName", true], [timezone, "string", "timezone", true], [from, "array", "from", true], [to, "array", "to", true]);
            const userFrom = `${from[0]}T${from[1]}:${from[2]}:${from[3]}`;
            const userTo = `${to[0]}T${to[1]}:${to[2]}:${to[3]}`;
            const userFromUnix = new Date(userFrom).getTime();
            const userToUnix = new Date(userTo).getTime();
            const query = builder.build("SELECT *, CONVERT_TZ(FROM_UNIXTIME(ROWTIME), 'UTC', ?) AS DATE, ROWTIME FROM ?;", timezone, [streamName]);
            const data = yield this.pull(query);
            data.shift();
            const filtered = [];
            data.map((element) => {
                if (element[element.length - 1] >= userFromUnix &&
                    element[element.length - 1] <= userToUnix) {
                    filtered.push(element.slice(0, element.length - 1));
                }
            });
            return filtered;
        });
        this.ksqldbURL = config.ksqldbURL;
        this.API = config.API ? config.API : null;
        this.secret = config.secret ? config.secret : null;
        this.httpsAgentAxios = config.httpsAgent
            ? new https.Agent(config.httpsAgent)
            : null;
        this.httpsAgentHttp2 = config.httpsAgent ? config.httpsAgent : null;
    }
    /**
     * Executes a pull query and returns the results.
     *
     * <p>This method may be used to execute pull queries, and returns an array containing all the data
     * received. The first value of the array will be an object containing ->
     * queryId: a string that contains the id of the stream that the pull query is being executed upon.
     * columnNames: an array that contains the names of the columns in the format of strings.
     * columnTypes: an array that contains the names of the columnTypes in the format of strings.
     *
     * Any subsequent values of the array are arrays that contain the data received.
     *
     * <p>If user input is used to build the query, please use the queryBuilder method to protect against sql injection.
     *
     * @param {string} query sql statement of query to execute
     * @return {Promise} a promise that completes once the server response is received, and contains the query
     *         result if successful.
     *
     *         Example: [{object that contains the metadata}, [data], [data], ...}]
     */
    pull(query) {
        validateInputs([query, "string", "query"]);
        const validatedQuery = builder.build(query);
        return axios
            .post(this.ksqldbURL + "/query-stream", {
            sql: validatedQuery,
        }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .then((res) => res.data)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Executes a push query, and returns the results one row at a time.
     *
     * <p>This method may be used to issue a push query against a stream, with the first piece of data being an object
     * containing queryId, the id of the push query that can be used to terminate the push query being executed.
     * Otherwise, the push query will continuously run until terminated, returning results one at a time.
     *
     * <p>If user input is used to build the query, please use the queryBuilder method to protect against sql injection.
     *
     * @param {string} query sql statement of query to execute
     * @param {function} cb a callback function that is ran against each piece of data returned.
     * @return {Promise} a promise that completes once the server response is received, and contains the query
     *         result if successful.
     */
    push(query, cb) {
        validateInputs([query, "string", "query", true], [cb, "function", "cb", true]);
        const validatedQuery = builder.build(query);
        return new Promise((resolve, reject) => {
            let sentQueryId = false;
            const session = http2.connect(this.ksqldbURL, this.httpsAgentHttp2 ? this.httpsAgentHttp2 : {});
            session.on("error", (err) => reject(err));
            const req = session.request(this.secret && this.API
                ? {
                    ":path": "/query-stream",
                    ":method": "POST",
                    Authorization: this.API && this.secret
                        ? `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`
                        : "",
                }
                : {
                    ":path": "/query-stream",
                    ":method": "POST",
                });
            const reqBody = {
                sql: validatedQuery,
                Accept: "application/json, application/vnd.ksqlapi.delimited.v1",
            };
            req.write(JSON.stringify(reqBody), "utf8");
            req.end();
            req.setEncoding("utf8");
            req.on("data", (chunk) => {
                var _a, _b;
                // check for chunk containing errors
                if ((_a = JSON.parse(chunk)["@type"]) === null || _a === void 0 ? void 0 : _a.includes("error"))
                    throw new ksqlDBError(JSON.parse(chunk));
                // continue if chunk indicates a healthy response
                if (!sentQueryId) {
                    sentQueryId = true;
                    cb(chunk);
                    resolve((_b = JSON.parse(chunk)) === null || _b === void 0 ? void 0 : _b.queryId);
                }
                else {
                    cb(chunk);
                }
            });
            req.on("end", () => session.close());
        });
    }
    /**
     * Executes a terminate query that ends a push query.
     *
     * <p>This method may be used to end an active push query, and returns an object signifying whether the push query was
     * terminated properly or not.
     *
     * <p>This method is sql injection protected with the use of queryBuilder.
     *
     * @param {string} queryId a string that is the id of the push query to be terminated.
     * @return {Promise} a promise that completes once the server response is received, and is an object that signifies
     *         if the termination was successful.
     */
    terminate(queryId) {
        validateInputs([queryId, "string", "queryId"]);
        return axios
            .post(this.ksqldbURL + "/ksql", {
            ksql: `TERMINATE ${queryId};`,
        }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .then((res) => res.data[0])
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Executes a query and returns the result(s).
     *
     * <p>This method may be used to issue custom sql queries against ksqldb without constraints.
     *
     * <p>If user input is used to build the query, please use the queryBuilder method to protect against sql injection.
     *
     * @param {string} query statement of a query to execute.
     * @return {Promise} a promise that completes once the server response is received, and returns the requested data.
     */
    ksql(query) {
        validateInputs([query, "string", "query"]);
        const validatedQuery = builder.build(query);
        return axios
            .post(this.ksqldbURL + "/ksql", {
            ksql: validatedQuery,
        }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .then((res) => res.data[0])
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Executes a query to create a stream.
     *
     * <p>This method is used to create a stream.
     *
     * <p>This method is sql injection protected with the use of queryBuilder.
     *
     * @param {string} name the name of the stream to be created.
     * @param {array} columnsType an array that contains the name of the columns and the associated types e.g [name VARCHAR, age INTEGER, ...]
     * @param {string} topic the name of the topic the stream is listening to. The topic is created if it does not currently exist.
     * @param {string} value_format a string specifying the value format.
     * @param {integer} partitions the number of partitions the stream should have.
     * @param {integer} key the key of the string.
     * @return {Promise} a promise that completes once the server response is received, and returns a response object.
     */
    createStream(name, columnsType, topic, value_format = "json", partitions = 1, key) {
        validateInputs([name, "string", "name", true], [columnsType, "array", "columnsType", true], [topic, "string", "topic"], [partitions, "number", "partitions"]);
        const columnsTypeString = columnsType.reduce((result, currentType) => result + ", " + currentType);
        const query = `CREATE STREAM ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`;
        return axios
            .post(this.ksqldbURL + "/ksql", { ksql: query }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     *
     * @param {string} streamName - the name of the stream to be created
     * @param {string[]} selectColumns - the columns from the underlying stream to be included in the new materialized stream
     * @param {string} sourceStream - the underlying stream from which the new materialized stream will be created
     * @param {object} propertiesObj - an object whose keys are property names and values are the associated values
     * @param {string} conditions - a string containing the conditional statement (i.e., the 'WHERE' statement)
     * @param {string} partitionBy - column by which data will be distributed
     * @returns {Promise} - a promise that completes once the server response is received, and returns a query ID
     */
    createStreamAs(streamName, selectColumns, sourceStream, propertiesObj, conditions, partitionBy = "") {
        validateInputs([streamName, "string", "streamName", true], [selectColumns, "array", "selectColumns", true], [sourceStream, "string", "sourceStream", true], [propertiesObj, "object", "propertiesObj"], [conditions, "string", "conditions"], [partitionBy, "string", "partitionBy"]);
        const propertiesArgs = [];
        const selectColStr = selectColumns.reduce((result, current) => result + ", " + current);
        // begin with first consistent portion of query
        let builderQuery = "CREATE STREAM ? ";
        // include properties in query if provided
        if (Object.keys(propertiesObj).length > 0) {
            builderQuery += "WITH (";
            for (const [key, value] of Object.entries(propertiesObj)) {
                const justStarted = builderQuery[builderQuery.length - 1] === "(";
                if (!justStarted)
                    builderQuery += ", ";
                builderQuery += "? = ?";
                propertiesArgs.push([key], value);
            }
            builderQuery += ") ";
        }
        // continue building the query to be sent to the builder
        builderQuery += `AS SELECT ${selectColStr} FROM ? `;
        if (conditions.indexOf(";") === -1)
            builderQuery += `WHERE ${conditions} `;
        builderQuery += partitionBy || "";
        builderQuery += "EMIT CHANGES;";
        // utilize query with variables to build actual query
        const query = builder.build(builderQuery, [streamName], ...propertiesArgs, [
            sourceStream,
        ]);
        return axios
            .post(this.ksqldbURL + "/ksql", { ksql: query }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .then((res) => res.data[0].commandStatus.queryId)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    //---------------------Create tables-----------------
    /**
     * Executes a query to create a table.
     *
     * <p>This method is used to create a table.
     *
     * <p>This method is sql injection protected with the use of queryBuilder.
     *
     * @param {string} name the name of the table to be created.
     * @param {array} columnsType an array that contains the name of the columns and the associated types e.g [name VARCHAR, age INTEGER, ...]
     * @param {string} topic name of the topic the table is listening to. The topic is created if it does not currently exist.
     * @param {string} value_format string specifying the value format.
     * @param {integer} partitions number of partitions the table should have.
     * @return {Promise} a promise that completes once the server response is received, and returns a response object.
     */
    createTable(name, columnsType, topic, value_format = "json", partitions) {
        validateInputs([name, "string", "name", true], [columnsType, "array", "columnsType", true], [topic, "string", "topic", true], [value_format, "string", "value_format", true], [partitions, "number", "partitions"]);
        const columnsTypeString = columnsType.reduce((result, currentType) => result + ", " + currentType);
        const query = `CREATE TABLE ${name} (${columnsTypeString}) WITH (kafka_topic='${topic}', value_format='${value_format}', partitions=${partitions});`;
        axios
            .post(this.ksqldbURL + "/ksql", {
            ksql: query,
        }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    //---------------------Create tables as select-----------------
    /**
     * Execute a query to create a new materialized table view of an existing table or stream
     *
     * <p>This method is used to create a materialized table view
     *
     * <p>This method is sql injection protected with the use of queryBuilder.
     *
     * @param {string} tableName name of the table to be created
     * @param {string} source name of the source stream / table materialized view is based on
     * @param {array} selectArray an array that contains the values (strings, aggregate functions) of the columns for the materialized view table
     * @param {object} propertiesObj an object containing key value pairs for supported table properties e.g {topic: 'myTopic', value_format: 'json', partitions: '1'}. {} for default values
     * @param {object} conditionsObj an object containing key value pairs for supported query conditions e.g {WHERE: 'a is not null', GROUP_BY: 'profileID', HAVING: 'COUNT(a) > 5' }
     * @returns {Promise} a promise that completes once the server response is received, returning a response object
     */
    createTableAs(tableName, source, selectArray, propertiesObj, conditionsObj) {
        validateInputs([tableName, "string", "tableName", true], [source, "string", "source", true], [selectArray, "array", "selectArray", true], [propertiesObj, "object", "propertiesObj"], [conditionsObj, "object", "conditionsObj"]);
        let selectColStr = selectArray.reduce((result, current) => result + ", " + current);
        // expect user to input properties object of format {topic: ... , value_format: ..., partitions: ...}
        // check for properties object, look for properties, if any are missing assign it a default value, if there's no property
        const defaultProps = {
            topic: tableName,
            value_format: "json",
            partitions: 1,
        };
        Object.assign(defaultProps, propertiesObj);
        // if there's no properties Obj, assign them all default values
        // expect user to input a conditions object of format {WHERE: condition, GROUP_BY: condition, HAVING: condition};
        // generate conditions string based on object
        // const builder = new queryBuilder();
        let conditionQuery = "";
        if (conditionsObj) {
            const conditionsArr = ["WHERE", "GROUP_BY", "HAVING"];
            const sqlClauses = [];
            let i = 0;
            while (conditionsArr.length) {
                if (conditionsObj[conditionsArr[0]]) {
                    sqlClauses[i] = [conditionsArr[0].replace("_", " ")]; // clause values are set as arrays for query builder
                    sqlClauses[i + 1] = [
                        " " +
                            conditionsObj[conditionsArr[0]] +
                            " ",
                    ];
                }
                else {
                    sqlClauses[i] = [""];
                    sqlClauses[i + 1] = [""];
                }
                i += 2;
                conditionsArr.shift();
            }
            conditionQuery = builder.build(`${sqlClauses[0][0]}${sqlClauses[1][0]}????`, sqlClauses[2], sqlClauses[3], sqlClauses[4], sqlClauses[5]);
        }
        // tableName, selectColstr, source, conditionQuery wrapped in array for query builder
        // to recognize that the string should not include semi-colon
        const query = builder.build(`CREATE TABLE ? WITH (kafka_topic=?, value_format=?, partitions=?) AS SELECT ? FROM ? ${[
            conditionQuery,
        ]} EMIT CHANGES;`, [tableName], defaultProps.topic, defaultProps.value_format, defaultProps.partitions, [selectColStr], [source]);
        return axios
            .post(this.ksqldbURL + "/ksql", { ksql: query }, {
            headers: this.API && this.secret
                ? {
                    Authorization: `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`,
                }
                : {},
            httpsAgent: this.httpsAgentAxios ? this.httpsAgentAxios : null,
        })
            .catch((error) => console.log(error));
    }
    /**
     * Inserts rows of data into a stream.
     *
     * <p>This method may be used to insert new rows of data into a stream.
     *
     * <p>This method is sql injection protected with the use of queryBuilder.
     *
     * @param {string} stream the name of the stream to insert data into.
     * @param {object} rows an array that contains data that is being inserted into the stream.
     * @return {Promise} this method returns a promise that resolves into an array describing the status of the row inserted.
     */
    //---------------------Insert Rows Into Existing Streams-----------------
    insertStream(stream, rows) {
        validateInputs([stream, "string", "stream", true], [rows, "array", "rows", true]);
        return new Promise((resolve, reject) => {
            const msgOutput = [];
            const session = http2.connect(this.ksqldbURL, this.httpsAgentHttp2 ? this.httpsAgentHttp2 : {});
            session.on("error", (err) => reject(err));
            const req = session.request(this.secret && this.API
                ? {
                    ":path": "/inserts-stream",
                    ":method": "POST",
                    Authorization: this.API && this.secret
                        ? `Basic ${Buffer.from(this.API + ":" + this.secret, "utf8").toString("base64")}`
                        : "",
                }
                : {
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
                var _a;
                // check for chunk containing errors
                if ((_a = JSON.parse(chunk)["@type"]) === null || _a === void 0 ? void 0 : _a.includes("error"))
                    throw new ksqlDBError(JSON.parse(chunk));
                // continue if chunk indicates a healthy response
                msgOutput.push(JSON.parse(chunk));
            });
            req.on("end", () => {
                session.close();
                resolve(msgOutput);
            });
        });
    }
    /**
     * Inspects a specific query and returns the results.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/status-endpoint/
     *
     * <p> This method may be used to inspect the status of a query.
     *
     * @param {string} commandId this id is obtained when using the .ksql method (/ksql endpoint) to run CREATE, DROP, TERMINATE commands.
     * @return {Promise} this method returns a promise, that resolves to a JSON object that has the following two properties->
     *
     *         status (string): One of QUEUED, PARSING, EXECUTING, TERMINATED, SUCCESS, or ERROR.
     *
     *         message (string): Detailed message regarding the status of the execution statement.
     */
    inspectQueryStatus(commandId) {
        validateInputs([commandId, "string", "commandId", true]);
        return axios
            .get(this.ksqldbURL + `/status/${commandId}`)
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Inspects a ksqlDB server and returns the results.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/info-endpoint/
     *
     * <p>This method is mainly used for troubleshooting.
     *
     * @return {Promise} this method returns a promise that resolves to an object containing the version, clusterId, and ksqlservice id.
     */
    inspectServerInfo() {
        return axios
            .get(this.ksqldbURL + `/info`)
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Inspects the health status of a ksqlDB server.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/info-endpoint/
     *
     * <p>This method may be used to give the health status of a ksqlDB server.
     *
     * @return {Promise} this method returns a promise that resolves to an object containing the metastore, kafka, and commandRunner info.
     */
    inspectServerHealth() {
        return axios
            .get(this.ksqldbURL + `/healthcheck`)
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Inspects all servers in a ksqlDB cluster and returns the results.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/cluster-status-endpoint/
     *
     * <p>This method may be used to get information about the status of all ksqlDB servers in a ksqlDB cluster, which can be useful
     * for troubleshooting.
     *
     * @return {Promise} this method returns a promise that resolves to an object containing information about the ksqlDB servers.
     */
    inspectClusterStatus() {
        return axios
            .get(this.ksqldbURL + `/clusterStatus`)
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Terminates a ksqlDB cluster.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/terminate-endpoint/
     *
     * <p>This method may be used to terminate a ksqlDB cluster. First, shut down all the servers except one.
     *
     * @param {string[]} topicsToDelete an array of topic names or regular expressions for topic names to delete.
     * @return {Promise} this method returns a promise that returns a response object.
     */
    terminateCluster(topicsToDelete = []) {
        validateInputs([topicsToDelete, "array", "topicsToDelete", true]);
        return axios
            .post(this.ksqldbURL + `/ksql/terminate`, {
            deleteTopicList: topicsToDelete,
        }, {
            headers: {
                // 'application/json' is the modern content-type for JSON, but some
                // older servers may use 'text/json'.
                Accept: "application/vnd.ksql.v1+json",
                "Content-Type": "application/vnd.ksql.v1+json",
            },
        })
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
    /**
     * Checks whether a ksqldb server property is allowed to be changed.
     *
     * @link https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-rest-api/is_valid_property-endpoint/
     *
     * <p>This method may be used to check if a property in a ksqldb server is prohibited from being changed.
     *
     * <p>If the property is prohibited from setting, the following object will be returned:
     * {
     *   "@type": "generic_error",
     *   "error_code": 40000,
     *   "message": "One or more properties overrides set locally are prohibited by the KSQL server (use UNSET to reset their default value): [ksql.service.id]"
     * }
     *
     * @param {string} propertyName - the name of the property to validate
     * @return {Promise} this method returns a promise that resolves to a boolean true if the property is allowed to be changed.
     */
    isValidProperty(propertyName) {
        validateInputs([propertyName, "string", "propertyName", true]);
        return axios
            .get(this.ksqldbURL + `/is_valid_property/${propertyName}`)
            .then((response) => response)
            .catch((error) => {
            var _a;
            throw ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data["@type"])
                ? new ksqlDBError(error.response.data)
                : error;
        });
    }
}
module.exports = ksqldb;
