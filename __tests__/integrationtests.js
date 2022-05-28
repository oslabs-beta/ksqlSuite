const ksqljs = require('../ksqljs/ksqljs.js');

describe('Integration Tests', () => {
  beforeAll((done) => {
    client = new ksqljs({ksqldbURL: 'http://localhost:8088'});
    done();
  });

  beforeEach(async () => {
    await client.createStream('TESTJESTSTREAM', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
  });

  afterEach(async () => {
    await client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');
  });
  
  describe('Stream Tests', () => {
    it('properly creates a stream', async () => {
      const streams = await client.ksql('LIST STREAMS;');
      const allStreams = streams.streams;
      let streamExists = false;
      // console.log('these are the streams: ', allStreams);
      for(let i = 0; i < allStreams.length; i++){
        if(allStreams[i].name === "TESTJESTSTREAM"){
          streamExists = true;
          break;
        }
      }
      expect(streamExists).toEqual(true);
    });
    
    it('properly inserts a row into a stream', async () => {
      const results = await client.insertStream('TESTJESTSTREAM', [{ "name": "matty", "email": "123@mail.com", "age": 100 }])
      expect(results[0].status).toBe('ok');
    });
  });

  describe('Push Query Tests', () => {
    jest.setTimeout(10000);
    
    it('properly creates a push query', async () => {
      const queryId = await client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;', async (data) => {});
      await client.terminate(queryId);
      expect(queryId).not.toBeUndefined();
    });
  
    it('properly terminates a push query', async () => {
      let pushId;
      let pushIdExists = false;
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
    });
  });
  
  describe('Pull Query Tests', () => {
    it('receives the correct data from a pull query', async () => {
      await client.ksql("INSERT INTO TESTJESTSTREAM (name, email, age) VALUES ('jestName', 'jestName@jestEmail.com', 9);");
      const pullData = await client.pull("SELECT * FROM TESTJESTSTREAM;");
      expect(pullData[1]).toEqual(['jestName', 'jestName@jestEmail.com', 9]);
    });
  });

})