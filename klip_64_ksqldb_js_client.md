# KLIP 64 - ksqlDB JavaScript Client

**Author**: Javan Ang (@javanang) | Gerry Bong (@ggbong734) | Jonathan Luu @(jonathanluu17) | Michael Snyder (@MichaelCSnyder) | Matthew Xing (@aengil)
**Release Target**: TBD |
**Status**: _In Discussion_ |
**Discussion**: TBD

**tl;dr:** Create a ksqlDB client for JavaScript using Node.js. The client should make it easier for JavaScript (Node.JS) developers to adopt ksqlDB and write stream processing applications on Kafka.

## Motivation and background

Simplify the use of ksqlDB in JavaScript. Creating an easy-to-use library would benefit developers looking to implement ksqlDB. Building a streaming architecture today requires putting together multiple subsystems: one to acquire events from existing data sources, another to store them, another to process them, etc. ksqlDB consolidates these subsystems into two components (storage and compute) and provides a simple SQL syntax to interact with the underlying Kafka clusters.

## What is in scope

At the minimum, the JavaScript client will support these operations:

- Push query
- Pull query
- Insert rows into an existing stream
- Terminate push query
- List streams/topics/queries
- Create & delete tables/streams

We will include documentation & examples.

## What is not in scope

We are not creating a new RESTful API. We will be leveraging ksqlDB API.

We can add support for any requested operation in the future. We are open to suggestions!!

At this point, we are not working on adding connector functionality (e.g., `CREATE SINK`, `CREATE SOURCE`).

## Value/Return

We hope that this could be transformative for the ksqlDB project in terms of increasing adoption among JavaScript developers. It would position ksqlDB as a great choice for writing stream processing applications, which are currently hard to write using ksqlDB alone.

## Public APIS

N/A. We are utilizing ksqlDB API.

## Design

The JavaScript client will provide an interface to make requests to ksqlDB APIs based on the axios module and the built-in http2 module in Node.js.

The JavaScript client will be packaged as a npm package (ksql-js) and will be available for download/installation at npm.

## Test plan

We will include integration tests using Jest.

## LOEs and Delivery Milestones

TBD

## Compatibility Implications

N/A

## Security Implications

N/A
