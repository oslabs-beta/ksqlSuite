const ksqljs = require('../ksqljs/ksqlJS.js');

// Pre-requisite: start a docker container
/* To add to README: Prior to running test with 'npm test', please start the ksqlDB
server using the command 'docker compose-up'. This will spin up a ksqlDB server on
'http://localhost:8088'
*/

describe('Integration Tests', () => {
  beforeAll((done) => {
    client = new ksqljs({ ksqldbURL: 'http://localhost:8088' });
    done();
  });

  afterAll(async () => {
    await client.ksql('DROP STREAM IF EXISTS TESTSTREAM2;');
    await client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');
  })

  it('properly creates a stream', async () => {
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR', 'email varchar', 'age INTEGER'], 'testJestTopic', 'json', 1);
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

  it('properly creates a push query', () => {
    let pushActive = false;
    client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;', async (data) => {
      if (JSON.parse(data).queryId) {
        pushActive = true;
      }
      expect(pushActive).toEqual(true)
    });
  })

  it('properly terminates a push query', () => {
    client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 3;', async (data) => {
      const terminateRes = await client.terminate(JSON.parse(data).queryId);
      expect(terminateRes.wasTerminated).toEqual(true);
    })
  })

  it('properly inserts a row into a stream', async () => {
    await client.insertStream('TESTJESTSTREAM', [
      { "name": "stab-rabbit", "email": "123@mail.com", "age": 100 }
    ]);
    const data = [];
    await client.push('SELECT * FROM TESTJESTSTREAM;', async (chunk) => {
      data.push(JSON.parse(chunk));
      if (data[1]) {
        client.terminate(data[0].queryId);
        expect(data[1]).toEqual(["stab-rabbit", "123@mail.com", 100])
      }
    });
  })

  it('receives the correct data from a pull query', async () => {
    const pullData = await client.pull("SELECT * FROM TESTJESTSTREAM;");
    expect(pullData[1]).toEqual(['stab-rabbit', '123@mail.com', 100]);
  })


  it('inspectQueryStatus checks if a stream is created successfully', async () => {
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

  it('inspectServerInfo returns the server info and status', async () => {
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

  it('inspectServerHealth returns the server health', async () => {
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

  it('inspectClusterStatus returns the cluster status', async () => {
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

  it('isValidProperty returns true if a server configuration property is not prohibited from setting', async () => {
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
