/** This file contains custom Node.js errors that extends the built-in Error class
 * REF: https://rclayton.silvrback.com/custom-errors-in-node-js
 * REF: https://futurestud.io/tutorials/node-js-create-your-custom-error
 */
// used to wrap error received from ksqlDB server
class ksqlDBError extends Error {
    constructor(error) {
        super(error.message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
        // you may also assign additional properties to your error
        //this.status = 404
        Object.keys(error).forEach((property) => {
            //@ts-ignore
            this[property] = error[property];
        });
    }
}
// for returning error related to use of queryBuilder class
class QueryBuilderError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class EmptyQueryError extends QueryBuilderError {
    constructor() {
        super("Query should not be empty, undefined, or null");
    }
}
class NumParamsError extends QueryBuilderError {
    constructor(message) {
        super(message);
    }
}
class InappropriateStringParamError extends QueryBuilderError {
    constructor(message) {
        super(message);
    }
}
class invalidArgumentTypes extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        // necessary?
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = {
    ksqlDBError,
    QueryBuilderError,
    EmptyQueryError,
    NumParamsError,
    InappropriateStringParamError,
    invalidArgumentTypes,
};
