const assert = require("chai").assert;
const {findDuplicateTransactions} = require('../src');
const mockTransactions = require('./data');

const oneMinuteInMilliseconds = 1000 * 60;

describe("findDuplicateTransactions()", function() {
  it("returns empty array if there are no transactions", function() {
    assert.deepEqual(findDuplicateTransactions([]), []);
  });
  
  it('verifies that given a list of transactions, result type will be an array', function () {
     assert.typeOf(findDuplicateTransactions(mockTransactions), 'array');
  });
  
  it('verifies result will consist of duplicate groups, which are similar and sorted in ascending order', function () {
    const fieldsToExamine = ['sourceAccount', 'targetAccount', 'category', 'amount']; 
    const result = findDuplicateTransactions(mockTransactions);
    for (const group of result) {
        assert.typeOf(group, 'array');
        group.reduce((prev, curr) => {
           if (curr) {
               fieldsToExamine.forEach((field) => assert.equal(prev[field], curr[field]));
               assert.isBelow(new Date(prev.time), new Date(curr.time));
               assert.isOk(new Date(curr.time).getTime() - new Date(prev.time).getTime() <= oneMinuteInMilliseconds);
           }
           return curr;
        });
     }
  });
  
  it('verifies that duplicated groups within a result will be also sorted in ascending order', function () {
    const result = findDuplicateTransactions(mockTransactions);
    result.reduce((prev, curr) => {
       if (curr) {
          assert.isBelow(
              new Date(prev[0].time),
              new Date(curr[0].time),
          );
       }
       return curr;
    });
  });
});
