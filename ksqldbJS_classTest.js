const ksqljs = require('./ksqljs/ksqldbJS_class');

const client = new ksqljs('http://localhost:8088');

//---------------------Test PUll Queries-------------------
/* const pullTest = async () => {
    const result = await client.pull('SELECT * FROM riderlocations;');
    console.log('this is the result', result);
}

pullTest(); */

//---------------------Test Push Queries-------------------
/* const pushTest = async () => {
    metadata = await client.push('SELECT * FROM riderlocations EMIT CHANGES LIMIT 1;', (row) => console.log(row));
    console.log('this is the metadata returned ', metadata);
};

pushTest();

//---------------------Test Termination of Queries-------------------
const terminateTest = async () => {
    client.terminate(metadata);
};

setTimeout(() => terminateTest(metadata), 2000); */

//---------------------Test List Queries-------------------
/* const listQueries = async () => {
    console.log(await client.ksql('LIST QUERIES;'));
    console.log(await client.ksql('LIST STREAMS;'));
    console.log(await client.ksql('LIST TABLES;'));
    console.log(await client.ksql('LIST TOPICS;'));
}

listQueries(); */

//---------------------Test Stream Creation-------------------
/* const createStreamTest = () => {
    client.createStream('AnotherTestStream', ['name VARCHAR','email varchar','age INTEGER'], 'testTopic', 'json', 1);
}

createStreamTest(); */

//---------------------Test Table Creation-------------------
/* const createTableTest = () => {
    client.createTable();
} */

//---------------------Test Table Creation-------------------
const createJestTest = () => {
    client.jestTests();
}

createJestTest();