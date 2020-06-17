import {assert} from 'chai';
import {findDuplicateTransactions} from '../src';
import {mockTransactions} from './data';
import {Transaction} from '../src/interface';

const oneMinuteInMilliseconds = 1000 * 60;

describe('findDuplicateTransactions()', () => {
  it('returns empty array if there are no transactions', () => {
    assert.deepEqual(findDuplicateTransactions([]), []);
  });
  
  it('verifies that given a list of transactions, result type will be an array', () => {
     assert.typeOf(findDuplicateTransactions(mockTransactions), 'array');
  });
  
  it('verifies result will consist of duplicate groups, which are similar and sorted in ascending order', function () {
    const fieldsToExamine = ['sourceAccount', 'targetAccount', 'category', 'amount']; 
    const result = findDuplicateTransactions(mockTransactions);
    for (const group of result) {
        assert.typeOf(group, 'array');
        group.reduce((prev: Transaction, curr: Transaction) => {
           if (curr) {
               fieldsToExamine.forEach((field: string) => assert.equal(prev[field], curr[field]));
               assert.isBelow(new Date(prev.time), new Date(curr.time));
               assert.isOk(new Date(curr.time).getTime() - new Date(prev.time).getTime() <= oneMinuteInMilliseconds);
           }
           return curr;
        });
     }
  });
  
  it('verifies that duplicated groups within a result will be also sorted in ascending order', () => {
    const result = findDuplicateTransactions(mockTransactions);
    result.reduce((prev: Transaction, curr: Transaction) => {
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
