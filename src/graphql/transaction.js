/**
 * @format
 */
import { DataSource } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import find from 'lodash/find';
import Locker from '../util/locker';

import { Transactions } from '../data/sample';


class ApiDataSource extends RESTDataSource {
	constructor () {
		super();
		this.baseURL = process.env.HOST_ENDPOINT || 'http://localhost:8888/transaction';
	}

	getTransactions = () => {
		// TODO Implement Me
	}

	getTransactionById = id => {
		// TODO Implement Me
	}

	createTransaction = opts => {
		// TODO Implement Me
	}
}

class DevDataSource extends DataSource {
	getTransactions = () => {
		return Transactions;
	}

	getTransactionById = id => {
		return find(Transactions, transaction => {
			return transaction.id === id;
		});
	}

	createTransaction = opts => {
		const {
			amount,
			recipent,
			sender,
			timestamp,
		} = opts;

		const transaction = {
			id: Locker.generateUniqueId(),
			amount,
			sender,
			recipent,
			timestamp,
		};

		return transaction;
	}
};

export const resolvers = {
	Query: {
		getTransactions: async (src, args, { dataSources }) => {
			return dataSources.transactionDataSource.getTransactions();
		},
		getTransactionById: async (src, { id }, { dataSources }) => {
			return dataSources.transactionDataSource.getTransactionById(id);
		},
	},
	Mutation: {
		createTransaction: async (src, args, { dataSources }) => {
			return dataSources.transactionDataSource.createTransaction(args);
		},
	},
};

export const typeDefs = `
	type Transaction {
		id: String!
		amount: Int!
		confirmations: Int
		recipient: String!
		sender: String!
		timestamp: String!
	}
`;

export const queries = `
	getTransactionById(id: String!): Transaction
	getTransactions: [Transaction]
`;

export const mutations = `
	createTransaction(amount: Int!, recipient: String!, sender: String!): Transaction!
`;

const getDataSource = () => {
	if (process.env.ENVIRONMENT === 'production') {
		return new ApiDataSource();
	}
	else {
		return new DevDataSource();
	}
};

export const dataSource = getDataSource();
