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
                if (prometheusURL[prometheusURL.length] === '/') prometheusURL = prometheusURL.slice(0, prometheusURL.length);

                return axios.get(`${prometheusURL}/api/v1/query_range?step=${resolution}s&end=${end}&start=${start}&query=${queryTypes[metric]}`)
                .then(res => res.data.data.result[0].values)
                .catch(error => error);
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

app.listen(5000, () => console.log('Server Running...'));