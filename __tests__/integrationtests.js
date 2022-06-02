const { default: waitForExpect } = require('wait-for-expect');
const ksqljs = require('../ksqljs/ksqlJS.js');
// Pre-requisite: start a docker container
/* To add to README: Prior to running test with 'npm test', please start the ksqlDB
server using the command 'docker compose-up'. This will spin up a ksqlDB server on
'http://localhost:8088'
*/

// ** INTEGRATION TEST INSTRUCTIONS **

// Prior to running the test files, please ensure an instance of the ksqldb server is running
// Steps to starting the ksqldb server can be found here: (https://ksqldb.io/quickstart.html)
// Once the ksqlDB server is running, tests can be run with terminal line: (npm test)

describe('--Integration Tests--', () => {
  describe('--Method Tests--', () => {
    beforeAll((done) => {
      client = new ksqljs({ ksqldbURL: 'http://localhost:8088' });
      done();
    });

    afterAll(async () => {
      await client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');
    })

    it('.createStream properly creates a stream', async () => {
      const result = await client.createStream('TESTJESTSTREAM', ['name VARCHAR', 'email varchar', 'age INTEGER'], 'testJestTopic', 'json', 1);
      const streams = await client.ksql('LIST STREAMS;');
      const allStreams = streams.streams;
      let streamExists = false;
      for (let i = 0; i < allStreams.length; i++) {
        if (allStreams[i].name === "TESTJESTSTREAM") {
          streamExists = true;
          break;
        }
      }
      expect(streamExists).toEqual(true);
    })
  
    it('.push properly creates a push query', () => {
      let pushActive = false;
      client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;', async (data) => {
        if (JSON.parse(data).queryId) {
          pushActive = true;
        }
        expect(pushActive).toEqual(true)
      });
    })
  
    it('.terminate properly terminates a push query', () => {
      client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 3;', async (data) => {
        const terminateRes = await client.terminate(JSON.parse(data).queryId);
        expect(terminateRes.wasTerminated).toEqual(true);
      })
    })
  
    it('.insertStream properly inserts a row into a stream', async () => {
      const response = await client.insertStream('TESTJESTSTREAM', [
        { "name": "stab-rabbit", "email": "123@mail.com", "age": 100 }
      ]);
      console.log(response);
      const data = [];
      await client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES;', async (chunk) => {
        data.push(JSON.parse(chunk));
        if (data[1]) {
          client.terminate(data[0].queryId);
          expect(data[1]).toEqual(["stab-rabbit", "123@mail.com", 100])
        }
      });
    })
  
    it('.pull receives the correct data from a pull query', async () => {
      const pullData = await client.pull("SELECT * FROM TESTJESTSTREAM;");
      console.log(pullData[1]);
      expect(pullData[1]).toEqual(["stab-rabbit", "123@mail.com", 100]);
    })

    it('.pullFromTo receives all the data', async () => {
      const pullData = await client.pull("SELECT * FROM TESTJESTSTREAM;");
      const data = await client.pullFromTo('TESTJESTSTREAM', 'America/Los_Angeles', ['2022-01-01', '00', '00', '00']);
      const expectPullData = pullData[1];
      const expectData = data[0].slice(0, 3);
      expect(expectPullData).toEqual(expectData);
    })
  })

  // describe('--Materialized Views Test--', () => {
  //   beforeAll( async () => {
  //     client = new ksqljs({ ksqldbURL: 'http://localhost:8088'});
  //     const waitForExpect = require('wait-for-expect');
  //     await client.ksql('CREATE STREAM NEWTESTSTREAM (NAME VARCHAR, AGE INTEGER, LOCATION VARCHAR, WEIGHT INTEGER) WITH (kafka_topic= \'testJestTopic2\', value_format=\'json\', partitions=1);')
  //   });
  //   afterAll(async () => {
  //     await client.ksql('DROP TABLE IF EXISTS TABLEOFSTREAM DELETE TOPIC;')
  //     await client.ksql('DROP STREAM IF EXISTS NEWTESTSTREAM DELETE TOPIC;')
  //   })
  //   it('creates a materialized table view of a stream', async () => {
  //     await client.createTableAs('TABLEOFSTREAM', 'NEWTESTSTREAM', ['name', 'LATEST_BY_OFFSET(age) AS recentAge', 'LATEST_BY_OFFSET(weight) AS recentweight'], {topic:'newTopic'},{WHERE: 'age >= 21', GROUP_BY: 'name'});
  //     const tables = await client.ksql('LIST TABLES;');
  //     const allTables = tables.tables;
  //     let tableCheck = false;
  //     for (let i = 0; i < allTables.length; i++){
  //       if (allTables[i].name === 'TABLEOFSTREAM') {
  //         tableCheck = true;
  //         break;
  //       }
  //     }
  //     expect(tableCheck).toEqual(true);
      
  //   })
  //   it('materialized table view updates with source stream', async () => {
  //     let rowCheck = false;
  //     // push query for the table
  //     // console.log('testing materialized view')
  //     await client.push('SELECT * FROM TABLEOFSTREAM EMIT CHANGES LIMIT 1;', async (data) => {
  //       console.log('QUERY INFO',data)
  //       if (Array.isArray(JSON.parse(data))){
  //         if (JSON.parse(data)[0] === "firstTester" && JSON.parse(data)[1] === 25 &&  JSON.parse(data)[2] === 130){
  //           rowCheck = true;
  //         }
  //       }
  //     })
  //     await client.insertStream('NEWTESTSTREAM', [{"NAME":"firstTester", "AGE":25, "LOCATION": "Seattle", "WEIGHT": 130}]);
  //     await waitForExpect(() => expect(rowCheck).toEqual(true))
  //   })
  // })

  describe('--Health Tests--', () => {
    beforeAll((done) => {
      client = new ksqljs({ ksqldbURL: 'http://localhost:8088' });
      done();
    });
  
    afterAll(async () => {
      await client.ksql('DROP STREAM IF EXISTS TESTSTREAM2;');
    })

    it('.inspectQueryStatus checks if a stream is created successfully', async () => {
      const streamName = 'TESTSTREAM2'
      const create = await client.ksql(`CREATE STREAM IF NOT EXISTS ${streamName}
                      (name VARCHAR,
                      email varchar,
                      age INTEGER)
                   WITH (
                       KAFKA_TOPIC = 'testJestTopic',
                       VALUE_FORMAT = 'json',
                       PARTITIONS = 1
                   );`);
      const commandId = create ? create.commandId : `stream/${streamName}/create`;
      const status = await client.inspectQueryStatus(commandId);
      // response should be { status: 'SUCCESS', message: 'Stream created', queryId: null }
      expect(status.data).toEqual(expect.objectContaining({
        status: expect.any(String),
        message: expect.any(String),
        queryId: null
      }));
    })
  
    it('.inspectServerInfo returns the server info and status', async () => {
      const status = await client.inspectServerInfo();
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
          serverStatus: expect.any(String)
        })
      }));
    })
  
    it('.inspectServerHealth returns the server health', async () => {
      const status = await client.inspectServerHealth();
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
          commandRunner: expect.anything()
        })
      })
      );
    })
  
    it('.inspectClusterStatus returns the cluster status', async () => {
      const status = await client.inspectClusterStatus();
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
        clusterStatus: expect.anything()
      })
      );
    })
  
    it('.isValidProperty returns true if a server configuration property is not prohibited from setting', async () => {
      const status = await client.isValidProperty('test');
      // should return true
      expect(status.data).toEqual(true);
    })
  
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
  })
})
