const ksqljs = require('../ksqljs/ksqlJS.js');

describe('Integration Tests', () => {
  beforeAll((done) => {
    client = new ksqljs({ksqldbURL: 'http://localhost:8088'});
    done();
  });

  afterAll(async () => {
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
    expect(pullData[1]).toEqual([ 'stab-rabbit', '123@mail.com', 100 ]);
  })
})
