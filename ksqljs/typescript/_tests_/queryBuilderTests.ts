const queryBuilder = require("../ksqldb/queryBuilder");
const {
  QueryBuilderError,
  EmptyQueryError,
  NumParamsError,
  InappropriateStringParamError,
} = require("../ksqldb/customErrors");

import { IqueryBuilder } from "../types";

describe("Unit tests for query builder class", () => {
  let builder: IqueryBuilder;
  let query: string;

  beforeAll((done) => {
    builder = new queryBuilder();
    query = "SELECT * FROM table WHERE id = ? AND size = ?";
    done();
  });

  describe("Normal use case", () => {
    it("properly adds params into a sql query", () => {
      const finishedQuery = builder.build(query, 123, "middle");
      expect(finishedQuery).toEqual(
        "SELECT * FROM table WHERE id = 123 AND size = 'middle'"
      );
    });
  });

  describe("Error testing", () => {
    it("throws an error if number of params is different from number of question marks", () => {
      expect(() => {
        builder.build(query, 123, "middle", "extra");
      }).toThrow(NumParamsError);
    });

    it("throws an error if the query is empty", () => {
      const query = "";
      expect(() => {
        builder.build(query, 123);
      }).toThrow(EmptyQueryError);
    });

    it("throws an error if an object is passed in as a param", () => {
      expect(() => {
        //@ts-ignore
        builder.build(query, 123, { middle: "size" });
      }).toThrow(QueryBuilderError);
    });
  });

  describe("SQL injection", () => {
    it("prevents 'OR 1=1' SQL injection by escaping single quotations ", () => {
      // https://stackoverflow.com/questions/5139770/escape-character-in-sql-server
      const finishedQuery = builder.build(query, 123, "middle' OR 1=1");
      expect(finishedQuery).toEqual(
        "SELECT * FROM table WHERE id = 123 AND size = 'middle'' OR 1=1'"
      );
    });

    it("prevents (middle' OR 'a'=a') SQL injection by escaping single quotations ", () => {
      const finishedQuery = builder.build(query, 123, "middle' OR 'a'='a");
      expect(finishedQuery).toEqual(
        "SELECT * FROM table WHERE id = 123 AND size = 'middle'' OR ''a''=''a'"
      );
    });

    it("throws an error if user tries to add a semicolon into a string param not wrapped in quotes", () => {
      expect(() => {
        builder.build(query, ["123; DROP tables WHERE size = "], "middle");
      }).toThrow(InappropriateStringParamError);
    });
  });
});
