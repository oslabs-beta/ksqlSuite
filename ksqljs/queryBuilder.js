class queryBuilder {
  constructor() {
  }

  build = (query, ...params) => {
    // consider building custom errors
    if (this._checkEmptyQuery(query)) return new Error('query is empty');
    let output = this._bind(query, ...params);
    return output;
  }
  _bind = (query, ...params) => {
    const numParams = params.length;
    // count num of ? in query
    const numMark = query.split("?").length - 1;
    if (numParams > numMark) { return new Error('more params than wildcards in query') };
    if (numParams < numMark) { return new Error('less params than wildcards in query') };
    for (let i = 0; i < numParams; i++) {
      const newParam = this._replaceWith(params[i]);
      if (newParam instanceof Error) return newParam;
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
          //check if spaces
          if (param[0].includes(" ")) {
            return new Error("string params should not include spaces");
          }
          else if (param[0].includes(";")) {
            return new Error("string params should not include semi-colons");
          }
          return `${param[0].replaceAll("'", "''")}`
        }
        return new Error("object passed in as query argument");
      case "function":
        return new Error("function passed in as query argument");
      case "string":
        // https://stackoverflow.com/questions/5139770/escape-character-in-sql-server
        // example of injection in Go: https://go.dev/play/p/4KoWROjK903
        return `'${param.replaceAll("'", "''")}'`;
      default:
      // code block
    }
  };
  _checkEmptyQuery = (query) => {
    if (query === "") {
      return true;
    }
    return false;
  }
}
module.exports = queryBuilder;
