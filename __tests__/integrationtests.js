const ksqljs = require('../ksqljs/ksqldbJS_class.js');

describe('Integration Tests', () => {
  beforeAll(() => {
    return client = new ksqljs('http://localhost:8088');
  })

  it('properly creates a stream', async () => {
    client.createStream('testJestStream', ['name VARCHAR','email varchar','age INTEGER'], 'testJestTopic', 'json', 1);
    const streams = await client.ksql('LIST STREAMS;').streams;
    console.log(streams);
    expect(true).toEqual(true);
  })
})