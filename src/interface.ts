const Categories = {
	other: 'other',
	eating_out: 'eating_out',
	groceries: 'groceries',
	salary: 'salary',
    pension_benefits: 'pension_benefits',
} as const;

export interface Transaction {
	id: number;
	sourceAccount: string;
	targetAccount: string;
	amount: number;
	category: typeof Categories;
	time: string;
}

export type TransactionFootprint = Pick<Transaction, 'id' | 'time'>;

export type TimeComparisonCallback = (time1: string, time2: string) => boolean;
