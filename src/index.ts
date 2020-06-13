import {objectToHash, isWithinTimeRange} from './util';
import {
	Transaction,
	TransactionFootprint,
	TimeComparisonCallback,
} from './interface';

const oneMinuteInMilliseconds = 1000 * 60;

function getTimeDuplicatedTransactions(sortedTransactions: Transaction[], timeComparisonCallback: TimeComparisonCallback) {
    const filtered: Transaction[] = [];
    let isDuplicate, prev;
    for (let i = 0, j = 1; i < sortedTransactions.length; i = j, j++) {
        if (sortedTransactions[j]) {
            isDuplicate = timeComparisonCallback(sortedTransactions[i].time, sortedTransactions[j].time);
        }
        if (isDuplicate || prev) {
            filtered.push(sortedTransactions[i]);
        }
        prev = isDuplicate;
    }
    return filtered;
}

export function findDuplicateTransactions(transactions: Transaction[]) {
    const strictFieldsToCompare = ['sourceAccount', 'targetAccount', 'category', 'amount'];
    
    const transactionHashMap = transactions.reduce((acc: {[key: string]: TransactionFootprint[]}, transaction: Transaction) => {
        const transactionHash = objectToHash(transaction, strictFieldsToCompare);
        const {id, time} = transaction;
        if (!acc[transactionHash]) {
            acc[transactionHash] = [{id, time}];
        } else {
            acc[transactionHash].push({id, time});
        }
        return acc;
    }, {});

	let groups: Transaction[][] = [];

    groups = Object.entries(transactionHashMap)
        .filter(([, items]: [string, TransactionFootprint[]]) => items.length > 1)
        .reduce((acc: Transaction[][], [hash, items]: [string, TransactionFootprint[]]) => {
            const sorted = items.sort((a, b) => new Date(a.time) - new Date(b.time));
            const filtered = getTimeDuplicatedTransactions(sorted, isWithinTimeRange(oneMinuteInMilliseconds));
            if (!filtered.length) {
                return acc;
            }
            const finalDuplicates = filtered.map((item) => ({...JSON.parse(hash), ...item}) as Transaction);
            return acc.push([...finalDuplicates]) && acc;
    }, groups); 

    return groups.sort((group1, group2) => new Date(group1[0].time) - new Date(group2[0].time));
}
