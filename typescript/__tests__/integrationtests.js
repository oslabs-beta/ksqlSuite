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
const ksqldb = require("../ksqldb/ksqldb");
// Pre-requisite: start a docker container
/* To add to README: Prior to running test with 'npm test', please start the ksqlDB
server using the command 'docker-compose up'. This will spin up a ksqlDB server on
'http://localhost:8088'. If the command was run before, the created container might
need to be removed first.
*/
// ** INTEGRATION TEST INSTRUCTIONS **
// Prior to running the test files, please ensure an instance of the ksqldb server is running
// Steps to starting the ksqldb server can be found here: (https://ksqldb.io/quickstart.html)
// Once the ksqlDB server is running, tests can be run with terminal line: (npm test)
let client;
jest.setTimeout(30000);
describe("--Integration Tests--", () => {
    describe("--Method Tests--", () => {
        beforeAll((done) => {
            client = new ksqldb({ ksqldbURL: "http://localhost:8088" });
            done();
        });
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield client.ksql("DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;");
        }));
        it(".createStream properly creates a stream", () => __awaiter(void 0, void 0, void 0, function* () {
            yield client.ksql("DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;");
            const result = yield client.createStream("TESTJESTSTREAM", ["name VARCHAR", "email varchar", "age INTEGER"], "testJestTopic", "json", 1);
            const streams = yield client.ksql("LIST STREAMS;");
            const allStreams = streams.streams;
            let streamExists = false;
            for (let i = 0; i < allStreams.length; i++) {
                if (allStreams[i].name === "TESTJESTSTREAM") {
                    streamExists = true;
                    break;
                }
            }
            expect(streamExists).toEqual(true);
        }));
        it(".push properly creates a push query", () => __awaiter(void 0, void 0, void 0, function* () {
            let pushActive = false;
            yield client.push("SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;", (data) => __awaiter(void 0, void 0, void 0, function* () {
                if (JSON.parse(data).queryId) {
                    pushActive = true;
                }
                expect(pushActive).toEqual(true);
            }));
        }));
        it(".terminate properly terminates a push query", () => {
            client.push("SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 3;", (data) => __awaiter(void 0, void 0, void 0, function* () {
                const terminateRes = yield client.terminate(JSON.parse(data).queryId);
                expect(terminateRes.wasTerminated).toEqual(true);
            }));
        });
        it(".insertStream properly inserts a row into a stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = [];
            yield client.push("SELECT * FROM TESTJESTSTREAM EMIT CHANGES;", (chunk) => __awaiter(void 0, void 0, void 0, function* () {
                data.push(JSON.parse(chunk));
                if (data[1]) {
                    client.terminate(data[0].queryId);
                    expect(data[1]).toEqual(["stab-rabbit", "123@mail.com", 100]);
                }
            }));
            const response = yield client.insertStream("TESTJESTSTREAM", [
                { name: "stab-rabbit", email: "123@mail.com", age: 100 },
            ]);
        }));
        it(".pull receives the correct data from a pull query", () => __awaiter(void 0, void 0, void 0, function* () {
            const pullData = yield client.pull("SELECT * FROM TESTJESTSTREAM;");
            expect(pullData[1]).toEqual(["stab-rabbit", "123@mail.com", 100]);
        }));
        it(".pullFromTo receives all the data", () => __awaiter(void 0, void 0, void 0, function* () {
            const pullData = yield client.pull("SELECT * FROM TESTJESTSTREAM;");
            const data = yield client.pullFromTo("TESTJESTSTREAM", "America/Los_Angeles", ["2022-01-01", "00", "00", "00"]);
            const expectPullData = pullData[1];
            const expectData = data[0].slice(0, 3);
            expect(expectPullData).toEqual(expectData);
        }));
        describe("--Materialized Streams and Tables--", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                yield client.ksql("DROP STREAM IF EXISTS testAsStream;");
                yield client.ksql("DROP TABLE IF EXISTS testAsTable;");
                yield client.ksql("DROP STREAM IF EXISTS newTestStream DELETE TOPIC;");
                yield client.createStream("newTestStream", ["name VARCHAR", "age INTEGER"], "newTestTopic", "json", 1);
            }));
            afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
                yield client.ksql("DROP STREAM IF EXISTS newTestStream DELETE TOPIC;");
            }));
            describe("--Materialized Streams Tests--", () => {
                let testAsQueryId;
                beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                    // await client.ksql('DROP STREAM IF EXISTS testAsStream;')
                    // await client.ksql('DROP STREAM IF EXISTS newTestStream DELETE TOPIC;');
                    // await client.createStream('newTestStream', ['name VARCHAR', 'age INTEGER'], 'newTestTopic', 'json', 1);
                    testAsQueryId = yield client.createStreamAs("testAsStream", ["name", "age"], "newTestStream", {
                        kafka_topic: "newTestTopic",
                        value_format: "json",
                        partitions: 1,
                    }, "age > 50");
                }));
                afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield client.ksql("DROP STREAM IF EXISTS testAsStream;");
                    // await client.ksql('DROP STREAM IF EXISTS newTestStream DELETE TOPIC;');
                }));
                it("creates materialized stream", () => __awaiter(void 0, void 0, void 0, function* () {
                    let streamFound = false;
                    const { streams } = yield client.ksql("LIST STREAMS;");
                    for (let i = 0; i < streams.length; i++) {
                        if ((streams[i].name, streams[i].name === "TESTASSTREAM")) {
                            streamFound = true;
                            break;
                        }
                    }
                    expect(streamFound).toBe(true);
                }));
            });
            describe("--Materialized Tables Tests--", () => {
                beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield client.createTableAs("testAsTable", "newTestStream", ["name", "LATEST_BY_OFFSET(age) AS recentAge"], { topic: "newTestTopic" }, { WHERE: "age >= 21", GROUP_BY: "name" });
                }));
                afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield client.ksql("DROP TABLE IF EXISTS testAsTable;");
                    // await client.ksql('DROP TABLE IF EXISTS TABLEOFSTREAM DELETE TOPIC;')
                    // await client.ksql('DROP STREAM IF EXISTS NEWTESTSTREAM DELETE TOPIC;')
                }));
                it("creates a materialized table view of a stream", () => __awaiter(void 0, void 0, void 0, function* () {
                    const { tables } = yield client.ksql("LIST TABLES;");
                    let tableFound = false;
                    for (let i = 0; i < tables.length; i++) {
                        if (tables[i].name === "TESTASTABLE") {
                            tableFound = true;
                            break;
                        }
                    }
                    expect(tableFound).toEqual(true);
                }));
            });
        });
    });
    describe("--Health Tests--", () => {
        beforeAll((done) => {
            client = new ksqldb({ ksqldbURL: "http://localhost:8088" });
            done();
        });
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield client.ksql("DROP STREAM IF EXISTS TESTSTREAM2;");
        }));
        it(".inspectQueryStatus checks if a stream is created successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const streamName = "TESTSTREAM2";
            const create = yield client.ksql(`CREATE STREAM IF NOT EXISTS ${streamName}
                      (name VARCHAR,
                      email varchar,
                      age INTEGER)
                   WITH (
                       KAFKA_TOPIC = 'testJestTopic',
                       VALUE_FORMAT = 'json',
                       PARTITIONS = 1
                   );`);
            const commandId = create
                ? create.commandId
                : `stream/${streamName}/create`;
            const status = yield client.inspectQueryStatus(commandId);
            // response should be { status: 'SUCCESS', message: 'Stream created', queryId: null }
            expect(status.data).toEqual(expect.objectContaining({
                status: expect.any(String),
                message: expect.any(String),
                queryId: null,
            }));
        }));
        it(".inspectServerInfo returns the server info and status", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield client.inspectServerInfo();
            // should return something like: {
            //   KsqlServerInfo: {
            //     version: '0.25.1',
            //     kafkaClusterId: '0Yxd6N5OSKGDUalltPWvXg',
            //     ksqlServiceId: 'default_',
            //     serverStatus: 'RUNNING'
            //   }
            // }
            expect(status.data).toEqual(expect.objectContaining({
                KsqlServerInfo: expect.objectContaining({
                    version: expect.any(String),
                    kafkaClusterId: expect.any(String),
                    serverStatus: expect.any(String),
                }),
            }));
        }));
        it(".inspectServerHealth returns the server health", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield client.inspectServerHealth();
            // should return something like: {
            //   isHealthy: true,
            //   details: {
            //     metastore: { isHealthy: true },
            //     kafka: { isHealthy: true },
            //     commandRunner: { isHealthy: true }
            //   }
            // }
            expect(status.data).toEqual(expect.objectContaining({
                isHealthy: expect.any(Boolean),
                details: expect.objectContaining({
                    metastore: expect.anything(),
                    kafka: expect.anything(),
                    commandRunner: expect.anything(),
                }),
            }));
        }));
        it(".inspectClusterStatus returns the cluster status", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield client.inspectClusterStatus();
            // should return something like: {
            //   clusterStatus: {
            //     'ksqldb-server:8088': {
            //       hostAlive: true,
            //       lastStatusUpdateMs: 1653164479237,
            //       activeStandbyPerQuery: [Object],
            //       hostStoreLags: [Object]
            //     }
            //   }}
            expect(status.data).toEqual(expect.objectContaining({
                clusterStatus: expect.anything(),
            }));
        }));
        it(".isValidProperty returns true if a server configuration property is not prohibited from setting", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield client.isValidProperty("test");
            // should return true
            expect(status.data).toEqual(true);
        }));
        // it('isValidProperty returns an error if the server property is prohibited from setting', async () => {
        //   const status = await client.isValidProperty('ksql.connect.url');
        //   // should return something like
        //   // {
        //   //   "@type": "generic_error",
        //   //   "error_code": 40000,
        //   //   "message": "One or more properties overrides set locally are prohibited by the KSQL server (use UNSET to reset their default value): [ksql.service.id]"
        //   // }
        //   expect(status.data).toEqual(expect.objectContaining({
        //     type: expect.any(String),
        //     error_code: expect.any(Number),
        //     message: expect.any(String),
        //   }));
        // })
    });
});
