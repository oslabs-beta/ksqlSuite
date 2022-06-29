# ksqlDB-JS

<div align="center">

<a href="https://github.com/oslabs-beta/ksqljs"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a href="https://github.com/oslabs-beta/ksqljs/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/oslabs-beta/ksqljs"></a>
<a href="https://github.com/oslabs-beta/ksqljs/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/oslabs-beta/ksqljs"></a>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/ksqljs">

<a href="https://www.npmjs.com/package/ksqldb-js"><img src="https://img.shields.io/badge/available%20on-npm-lightblue.svg?logo=npm&labelColor=lightgrey" /></a>
<a href="https://www.npmjs.com/package/ksqldb-js"><img src="https://img.shields.io/badge/npm-v^1.1.0-lightgrey?logo=npm"/></a>

   <p align="center"> <strong>A native Node.js client for ksqlDB</strong></p>
   </div>

## Table of Contents

- [About the project](#about)
- [Getting Started](#getting-started)
  - [Usage](#usage)
- [Features](#features)
- [Developers](#developers)
- [Contributions](#contributions)
- [License](#license)

## <a name="about"></a> About the Project

ksqlDB-JS - a ksqlDB client for Node.js

### Prerequisites

> Node.js - https://nodejs.org/en/
>
> ksqlDB - https://ksqldb.io/
>
> Docker (for tests) -https://www.docker.com/

## <a name="getting-started"></a> Getting Started

Install package from Node package manager

```
npm install ksqldb-js
```

### <a name="usage"></a> Usage

Create a client in the application file:

```
const ksqldb = require('ksqldb-js');
const client = new ksqldb({ksqldbURL: '<url to ksqlDB server>'})
```

To run tests initiate Docker containers included in yaml file:

```
docker-compose up
npm test
```

## <a name="features"></a> Features

- #### Create a pull query

```
client.pull("SELECT * FROM myTable;");
```

- #### Create a push query

```
client.push('SELECT * FROM myTable EMIT CHANGES;',
  (data) => {
  console.log(data);
});
```

- #### Terminate persistent query
  e.g. a push query

```
client.terminate(queryId);
```

- #### Insert rows of data into a stream

```
client.insertStream('myTable', [
    { "name": "jack", "email": "123@mail.com", "age": 25 },
    { "name": "john", "email": "456@mail.com", "age": 20 }
]);
```

- #### List streams/queries

```
client.ksql('LIST STREAMS;');
```

- #### Create table/streams

```
client.createStream('testStream',
    columnsType = ['name VARCHAR', 'email varchar', 'age INTEGER'],
    topic = 'testTopic',
    value_format = 'json',
    partitions = 1);
```

- #### For custom SQL statements including complex joins use the .ksql method

```
client.ksql('DROP STREAM IF EXISTS testStream;');
```

- #### SQL Query builder

Please use the built-in query builder to parametrize any SQL query to avoid SQL injection.

```
const builder = new queryBuilder();
const query = 'SELECT * FROM table WHERE id = ? AND size = ?';
const finishedQuery = builder.build(query, 123, "middle");

client.ksql(finishedQuery);
```

- #### Create table as

Generating a materialized view that can be

```
client.createTableAs('testTable', 'sourceStream', selectArray = ['name', 'LATEST_BY_OFFSET(age) AS recentAge'],
    propertiesObj = {topic:'newTestTopic'},
    conditionsObj = {WHERE: 'age >= 21', GROUP_BY: 'name'});
```

- #### Create stream as

```
client.createStreamAs('testStream', selectColumns = ['name', 'age'], 'sourceStream',
      propertiesObj = {
        kafka_topic: 'testTopic',
        value_format: 'json',
        partitions: 1
      },
      conditions = 'age > 50');
```

- #### Pull from to

Pull stream data between two time points

```
client.pullFromTo('TESTSTREAM', 'America/Los_Angeles',
    from = ['2022-01-01', '00', '00', '00'],
    to = ['2022-01-01', '00', '00', '00']);
```

- #### Troubleshooting methods (.inspectServerStatus, .inspectQueryStatus, .inspectClusterStatus )

## <a name="developers"></a> Developers

- [Javan Ang](https://github.com/javanang)
- [Gerry Bong](https://github.com/ggbong734)
- [Jonathan Luu](https://github.com/jonathanluu17)
- [Michael Snyder](https://github.com/MichaelCSnyder)
- [Matthew Xing](https://github.com/Aengil)

## <a name="contributions"></a> Contributions

Contributions to the code, examples, documentation, etc. are very much appreciated.

- Please report issues and bugs directly in this [GitHub project](https://github.com/oslabs-beta/ksqljs/issues).

## <a name="license"></a> License

This product is licensed under the MIT License - see the LICENSE.md file for details.

This is an open source product.

This product is accelerated by OS Labs.

ksqlDB is licensed under the [Confluent Community License](https://github.com/confluentinc/ksql/blob/master/LICENSE).

_Apache, Apache Kafka, Kafka, and associated open source project names are trademarks of the [Apache Software Foundation](https://www.apache.org/)_.
