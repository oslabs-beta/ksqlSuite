const ksqljs = require('../ksqljs/ksqldbJS_class.js');

describe('Integration Tests', () => {
  beforeAll(() => {
    return client = new ksqljs('http://localhost:8088');
  })

  afterEach(async () => {
    await client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');
    setTimeout(() => {}, 5000)
  })

  it('properly creates a stream', async () => {
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    const streams = await client.ksql('LIST STREAMS;');
    const allStreams = streams.streams;
    let streamExists = false;
    for(let i = 0; i < allStreams.length; i++){
      if(allStreams[i].name === "TESTJESTSTREAM"){
        streamExists = true;
        break;
      }
    }
    expect(streamExists).toEqual(true);
  })

  it('properly creates a push query', async () => {
    let pushActive = false;
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    await client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;', async (data) => {
      if(JSON.parse(data).queryId){
        pushActive = true;
      }
      await client.terminate(JSON.parse(data).queryId);
      expect(pushActive).toEqual(true);
    });
  })

  it('properly terminates a push query', async () => {
    let pushId;
    let pushIdExists = false;
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    pushId = await client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 3;', () => {});
    await client.terminate(pushId);
    const result = await client.ksql("LIST QUERIES;");
    const resultQueries = result.queries;
    for(let i = 0; i < resultQueries.length; i++){
      if(resultQueries[i].id === pushId){
        pushIdExists = true;
      }
    }
    expect(pushIdExists).toEqual(false);
  })
  
  it('receives the correct data from a pull query', async () => {
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    await client.ksql("INSERT INTO TESTJESTSTREAM (name, email, age) VALUES ('jestName', 'jestName@jestEmail.com', 9);");
    const pullData = await client.pull("SELECT * FROM TESTJESTSTREAM;");
    expect(pullData[1]).toEqual(['jestName', 'jestName@jestEmail.com', 9]);
  })

  it('properly inserts a row into a stream', async () => {
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    await client.insertStream('TESTJESTSTREAM', [
      { "name": "matty", "email": "123@mail.com", "age": 100 }
    ]);
    const data = [];
    await client.push('SELECT * FROM TESTJESTSTREAM;', (chunk) => {data.push(chunk)});
    expect(data[1]).toEqual('["matty","123@mail.com",100]\n');
  })

})