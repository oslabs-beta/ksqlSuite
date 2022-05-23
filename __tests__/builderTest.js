const queryBuilder = require('../ksqljs/queryBuilder.js');

describe('Unit tests for query builder class', () => {
  let builder;
  let query;

  beforeAll((done) => {
    builder = new queryBuilder();
    query = 'SELECT * FROM table WHERE id = ? AND size = ?';
    done();
  });

  describe('Normal use case', () => {
    it('properly adds params into a sql query', () => {
      const finishedQuery = builder.build(query, 123, "middle");
      expect(finishedQuery).toEqual("SELECT * FROM table WHERE id = 123 AND size = 'middle'");
    });
  });

  describe('Error testing', () => {
    it('returns an error if number of params is different from number of question marks', () => {
      const finishedQuery = builder.build(query, 123, "middle", "extra");
      expect(finishedQuery).toBeInstanceOf(Error);
    });

    it('returns an error if the query is empty', () => {
      const query = '';
      const finishedQuery = builder.build(query, 123);
      expect(finishedQuery).toBeInstanceOf(Error);
    });

    it('returns an error if an object is passed in as a param', () => {
      const finishedQuery = builder.build(query, 123, { "middle": "size" });
      expect(finishedQuery).toBeInstanceOf(Error);
    });
  });

  describe('SQL injection', () => {
    it("prevents 'OR 1=1' SQL injection by escaping single quotations ", () => {
      // https://stackoverflow.com/questions/5139770/escape-character-in-sql-server
      const finishedQuery = builder.build(query, 123, "middle' OR 1=1",);
      expect(finishedQuery).toEqual("SELECT * FROM table WHERE id = 123 AND size = 'middle'' OR 1=1'");
    });

    it("prevents (middle' OR 'a'=a') SQL injection by escaping single quotations ", () => {
      const finishedQuery = builder.build(query, 123, "middle' OR 'a'='a",);
      expect(finishedQuery).toEqual("SELECT * FROM table WHERE id = 123 AND size = 'middle'' OR ''a''=''a'");
    });
  });
});
