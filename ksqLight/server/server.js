//---------------External Module Imports----------------
const express = require('express');
const axios = require('axios');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql');

//---------------Internal Module Imports----------------
const queryTypes = require('./queryTypes.js');

const app = express();

//---------------Global Middleware----------------
app.use(cors());

//---------------Custom Types----------------
const RealTimeType = new GraphQLObjectType({
    name: 'activeQueries2',
    description: 'Object containing x and y properties with the respective data as values',
    fields: () => ({
        x: {
            type: GraphQLInt,
            resolve: (parent, args, context) => parent[0]
        },
        y: {
            type: GraphQLString,
            resolve: (parent, args, context) => parent[1]
        }
    })
});

const ValidationType = new GraphQLObjectType({
    name: 'inputValidation',
    description: 'Object indicating input validity status and error message',
    fields: () => ({
        isValid: { type: GraphQLBoolean },
        error: { type: GraphQLString }
    })
})

//---------------Root Query Types----------------
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        ksqlDBMetrics: {
            type: new GraphQLList(RealTimeType),
            description: 'ksqlDB Metric',
            args: {
                metric: { type: GraphQLNonNull(GraphQLString)},
                start: { type: GraphQLNonNull(GraphQLInt)},
                end: { type: GraphQLNonNull(GraphQLInt)},
                resolution: { type: GraphQLNonNull(GraphQLInt)},
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, {start, end, resolution, metric, prometheusURL}) => {
                if (prometheusURL[prometheusURL.length - 1] === '/') prometheusURL = prometheusURL.slice(0, prometheusURL.length - 1);

                return axios.get(`${prometheusURL}/api/v1/query_range?step=${resolution}s&end=${end}&start=${start}&query=${queryTypes[metric]}`)
                .then(res => {
                    return res.data.data.result[0].values})
                .catch(error => error);
            }
        },
        livenessIndicator: {
            type: GraphQLBoolean,
            description: 'Boolean value representing whether the ksqlDB server up and emitting metrics.',
            args: {
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, { prometheusURL }) => {
                try {
                    return await axios.get(`${prometheusURL}/api/v1/query?query=ksql_ksql_engine_query_stats_liveness_indicator`)
                    .then(res => res.data.data.result[0].value[1] === "1")
                    .catch(error => {throw error});
                } catch (error) {
                    return error;
                }
            }
        },
        errorRate: {
            type: GraphQLInt,
            description: 'The number of messages that were consumed but not processed.',
            args: {
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, { prometheusURL }) => {
                try {
                    return await axios.get(`${prometheusURL}/api/v1/query?query=ksql_ksql_engine_query_stats_error_rate`)
                    .then(res => Number(res.data.data.result[0].value[1]))
                    .catch(error => {throw error});
                } catch (error) {
                    return error;
                }
            }
        },
        errorQueries: {
            type: GraphQLInt,
            description: 'The count of queries in ERROR state.',
            args: {
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, { prometheusURL }) => {
                try {
                    return await axios.get(`${prometheusURL}/api/v1/query?query=ksql_ksql_engine_query_stats_error_queries`)
                    .then(res => Number(res.data.data.result[0].value[1]))
                    .catch(error => {throw error});
                } catch (error) {
                    return error;
                }
            }
        },
        bytesConsumed: {
            type: GraphQLInt,
            description: 'The total number of bytes consumed across all queries.',
            args: {
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, { prometheusURL }) => {
                try {
                    return await axios.get(`${prometheusURL}/api/v1/query?query=ksql_ksql_engine_query_stats_bytes_consumed_total`)
                    .then(res => Number(res.data.data.result[0].value[1]))
                    .catch(error => {throw error});
                } catch (error) {
                    return error;
                }
            }
        },
        isValidPrometheusURL: {
            type: ValidationType,
            description: 'Object representing whether provided Prometheus URL points to valid Prometheus server and any errors',
            args: {
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, { prometheusURL }) => {
                if (prometheusURL[prometheusURL.length - 1] === '/') prometheusURL = prometheusURL.slice(0, prometheusURL.length - 1);

                return axios.get(`${prometheusURL}/api/v1/status/buildinfo`)
                .then(res => ({
                    isValid: true,
                    error: null
                }))
                .catch(error => ({
                    isValid: false,
                    error: error.message
                }));
            }
        },
        isValidKsqlDBURL: {
            type: ValidationType,
            description: 'Object representing whether provided ksqlDB URL points to valid Prometheus server and any errors',
            args: {
                ksqlDBURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, { ksqlDBURL }) => {
                if (ksqlDBURL[ksqlDBURL.length - 1] === '/') ksqlDBURL = ksqlDBURL.slice(0, ksqlDBURL.length - 1);

                return axios.get(`${ksqlDBURL}/clusterStatus`)
                .then(res => ({
                    isValid: true,
                    error: null
                }))
                .catch(error => ({
                    isValid: false,
                    error: error.message
                }));
            }
        },
        isValidDuration: {
            type: GraphQLBoolean,
            description: 'Boolean representing whether Prometheus server accepts user duration.',
            args: {
                metric: { type: GraphQLNonNull(GraphQLString)},
                start: { type: GraphQLNonNull(GraphQLInt)},
                end: { type: GraphQLNonNull(GraphQLInt)},
                resolution: { type: GraphQLNonNull(GraphQLInt)},
                prometheusURL: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, { start, end, resolution, metric, prometheusURL }) => {
                if (prometheusURL[prometheusURL.length - 1] === '/') prometheusURL = prometheusURL.slice(0, prometheusURL.length - 1);

                
                return axios.get(`${prometheusURL}/api/v1/query_range?step=${resolution}s&end=${end}&start=${start}&query=${queryTypes[metric]}`)
                .then(res => true)
                .catch(error => false);
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5001, () => console.log('Server Running...'));
