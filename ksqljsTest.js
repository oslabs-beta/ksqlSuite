const ksqljs = require('./ksqljs/ksqlJS');
require('dotenv').config();
const util = require('util')

// const client = new ksqljs({
//     ksqldbURL: 'https://pksqlc-755v2.us-east-2.aws.confluent.cloud:443',
//     API: process.env.KSQL_API_KEY,
//     secret: process.env.KSQL_API_SECRET
// });

const client = new ksqljs({ ksqldbURL: 'http://localhost:8088' })
let metadata;

//---------------------Test PUll Queries-------------------
/* const pullTest = async () => {
    const result = await client.pull('SELECT * FROM riderlocations;');
    console.log('this is the result', result);
}

pullTest();

//---------------------Test Push Queries-------------------
const pushTest = async () => {
    // metadata = await client.push('SELECT * FROM riderlocations EMIT CHANGES LIMIT 1;', (row) => console.log(row));
    // console.log('this is the metadata returned ', metadata);
    let pushActive = false;
    await client.createStream('TESTJESTSTREAM', ['age INTEGER'], 'testJestTopic', 'json', 1);
    // await client.push('SELECT * FROM TESTJESTSTREAM EMIT CHANGES LIMIT 1;', (data) => {
    //   console.log(data);
    //   console.log('HERE IS DATA ', JSON.parse(data).queryId)
    //   if(JSON.parse(data).queryId){
    //     pushActive = true;
    //   }
    //   client.ksql(`TERMINATE ${JSON.parse(data).queryId};`)
    //   client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');
    // });
    // await client.ksql('DROP STREAM IF EXISTS TESTJESTSTREAM DELETE TOPIC;');

    /* const pushTest = async () => {
    try {
        metadata = await client.push('SELECT * FROM riderlocations EMIT CHANGES LIMIT 1;', (row) => console.log(row));
        console.log('this is the metadata returned ', metadata);
    } catch (error) {
        console.log(error);
    }

    metadata = await client.push('SELECT * FROM riderlocations EMIT CHANGES LIMIT 1;', (row) => console.log(row));
    console.log('this is the metadata returned ', metadata);

    metadata = await client.push('SELECT * FROM riderlocations EMIT CHANGES LIMIT 1;', (row) => console.log(row));
    console.log('this is the metadata returned ', metadata);
};

pushTest();

//---------------------Test Termination of Queries-------------------
/* const terminateTest = async () => {
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
// const createStreamTest = () => {
//     client.createStream('TestStream', ['name VARCHAR', 'email varchar', 'age INTEGER'], 'testTopic', 'json', 1);
// }

// createStreamTest();

//---------------------Test Table Creation-------------------
/* const createTableTest = () => {
    client.createTable('AnotherTestTable', ['name VARCHAR PRIMARY KEY', 'email VARCHAR', 'age INTEGER'], 'users', 'json', 1);
};

createTableTest(); */

//---------------------Test Table Create As-------------------
const createTableAsTest = async () => {

    await client.ksql('CREATE STREAM RIDERLOCATIONS (PROFILEID VARCHAR, LATITUDE DOUBLE, LONGITUDE DOUBLE) WITH (KAFKA_TOPIC=\'locations\', value_format=\'json\', partitions=1);')
    await client.createTableAs('currentlocation', 'riderlocations', ['profileid','LATEST_BY_OFFSET(latitude) AS la', 'LATEST_BY_OFFSET(longitude) AS lo'], {}, {GROUP_BY: 'profileId'})
    // let x;
    // await client.push('SELECT * FROM CURRENTLOCATION EMIT CHANGES LIMIT 1;', async (data) => {
    //     console.log('push query data', JSON.parse(data))
    //     // x = await client.ksql('LIST QUERIES;');
    //     // console.log('querylist', x.queries)
    // })

    // console.log(await client.ksql('LIST QUERIES;'));
    // console.log('first x', x)
    await client.insertStream('RIDERLOCATIONS', [{'PROFILEID':'abc123abcddzzz', 'latitude':9999999,'longitude':999999}])
    // console.log('second x', x)
    // console.log(await client.pull('SELECT * FROM TABLEOFSTREAM;'));
}

createTableAsTest()

//---------------------Test Insert Stream-------------------
/* const insertStreamTest = () => {
    client.insertStream('TestStream', [
        { "name": "matt", "email": "123@mail.com", "age": 1000 },
        { "name": "jonathan", "email": "234@mail.com", "age": 99 }
    ]);
/* const insertStreamTest = async () => {
    const test = await client.insertStream('TestStream', [
        { "name": "matt", "email": "123@mail.com", "age": 1000 },
        { "name": "jonathan", "email": "234@mail.com", "age": 99 }
    ]);
    console.log('returned array: ', test);
*/
/* 
const insertStreamTest = async () => {
    // const test = await client.insertStream('TestStream', [
        // { "name": "Scrooge", "email": "mcduck@mail.com", "age": 59 },
        // { "name": "jonathan", "email": "234@mail.com", "age": 99 }
    // ]);
    // console.log('returned array: ', test);
};

// insertStreamTest();

const pullFromToTest = async () => {
    const data = await client.pullFromTo('TESTSTREAM', 'America/Los_Angeles', ['2022-05-18', '00', '00', '00'], ['2022-05-20', '00', '00', '00']);
    // console.log(data);
}

pullFromTo();
// const insertStreamTest = async () => {
//     const test = await client.insertStream('TestStream', [
//         { "name": "matt", "email": "123@mail.com", "age": 1000 },
//         { "name": "jonathan", "email": "234@mail.com", "age": 99 }
//     ]);
//     // console.log('returned array: ', test);
// };

// insertStreamTest();


//---------------------Test Inspect query status -------------------
// const inspectQueryStatusTest = async () => {
//     // PLEASE CHANGE streamName to a nonexisting stream in order for this test to work.
//     const streamName = 'TestStream4'
//     const create = await client.ksql(`CREATE STREAM IF NOT EXISTS ${streamName}
//                     (name VARCHAR,
//                     email varchar,
//                     age INTEGER)
//                  WITH (
//                      KAFKA_TOPIC = 'testTopic',
//                      VALUE_FORMAT = 'json',
//                      PARTITIONS = 1
//                  );`);
//     const commandId = create ? create.commandId : `stream/${streamName}/create`;
//     const status = await client.inspectQueryStatus(commandId);
//     console.log(status.data);
//     // response should be { status: 'SUCCESS', message: 'Stream created', queryId: null }
// };

// inspectQueryStatusTest();


//---------------------Test Inspect server status-------------------

// const inspectServerInfoTest = async () => {
//     const status = await client.inspectServerInfo();
//     console.log(status.data);
//     // should return something like: {
//     //   KsqlServerInfo: {
//     //     version: '0.25.1',
//     //     kafkaClusterId: '0Yxd6N5OSKGDUalltPWvXg',
//     //     ksqlServiceId: 'default_',
//     //     serverStatus: 'RUNNING'
//     //   }
//     // }
// };

// inspectServerInfoTest();

// const inspectServerHealthTest = async () => {
//     const status = await client.inspectServerHealth();
//     console.log(status.data);
//     // should return something like: {
//     //   isHealthy: true,
//     //   details: {
//     //     metastore: { isHealthy: true },
//     //     kafka: { isHealthy: true },
//     //     commandRunner: { isHealthy: true }
//     //   }
//     // }
// };

// inspectServerHealthTest();

//---------------------Test Inspect cluster status-------------------


// const inspectClusterStatusTest = async () => {
//     // need to have the following config in docker-compose.yml under ksqldb-server.environment
//     // KSQL_KSQL_HEARTBEAT_ENABLE: "true"
//     // KSQL_KSQL_LAG_REPORTING_ENABLE: "true"
//     let status = await client.inspectClusterStatus();
//     console.log(util.inspect(status.data, { showHidden: false, depth: null, colors: true }));
//     // should return something like: {
//     //   clusterStatus: {
//     //     'ksqldb-server:8088': {
//     //       hostAlive: true,
//     //       lastStatusUpdateMs: 1653164479237,
//     //       activeStandbyPerQuery: [Object],
//     //       hostStoreLags: [Object]
//     //     }
//     //   }
// };

// inspectClusterStatusTest();

//---------------------Test check validity of property-------------------
// const isValidPropertyTest = async () => {
//     let status = await client.isValidProperty('test');
//     console.log(util.inspect(status.data, { showHidden: false, depth: null, colors: true }));
//     // should return true
// };

// isValidPropertyTest();*/
