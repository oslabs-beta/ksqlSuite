const { QueryBuilderError, EmptyQueryError, NumParamsError, InappropriateStringParamError } = require('./customErrors.js');

class queryBuilder {
  constructor() {
  }

  build = (query, ...params) => {
    // consider building custom errors
    if (this._checkEmptyQuery(query)) throw new EmptyQueryError();
    let output = this._bind(query, ...params);
    return output;
  }
  _bind = (query, ...params) => {
    const numParams = params.length;
    // count num of ? in query
    const numMark = query.split("?").length - 1;
    if (numParams > numMark) { throw new NumParamsError('more params than wildcards in query') };
    if (numParams < numMark) { throw new NumParamsError('less params than wildcards in query') };
    for (let i = 0; i < numParams; i++) {
      const newParam = this._replaceWith(params[i]);
      // if (newParam instanceof Error) return newParam;
      query = query.replace(/\?/, newParam);
    };
    return query;
  }
  _replaceWith = (param) => {
    switch (typeof param) {
      case "number":
        return param;
      case "bigint":
        return param;
      case "boolean":
        return param;
      case "object":
        if (Array.isArray(param)) {
          if (param[0].includes(";")) {
            throw new InappropriateStringParamError("string params not wrapped in quotes should not include semi-colons");
          }
          return `${param[0].replaceAll("'", "''")}`
        }
        throw new QueryBuilderError("object should not be passed in as query argument");
      case "function":
        throw new QueryBuilderError("function should not be passed in as query argument");
      case "string":
        // https://stackoverflow.com/questions/5139770/escape-character-in-sql-server
        // example of injection in Go: https://go.dev/play/p/4KoWROjK903
        return `'${param.replaceAll("'", "''")}'`;
      default:
      // code block
    }
  };
  _checkEmptyQuery = (query) => {
    if (query === "" || query === undefined || query === null) {
      return true;
    }
    return false;
  }
}
module.exports = queryBuilder;
