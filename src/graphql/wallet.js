/**
 * @format
 */
import { DataSource } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import Locker from '../util/locker';
import { Wallet } from '../data/sample';

class ApiDataSource extends RESTDataSource {
	constructor () {
		super();
		this.baseURL = process.env.HOST_ENDPOINT || 'http://localhost:8888/';
	}

	createWallet = (userId, passcode, keys) => {
		// TODO implement me
	}
}

class DevDataSource extends DataSource {
	createWallet = (userId, passcode) => {
		if (!userId || !passcode) {
			return;
		}

		const keys = Locker.generateKeypair(passcode);
		const addresses = [];

		for (let x = 0; x < 100; x++) {
			addresses.push(Logger.generateUniqueId(true));
		}

		const wallet = {
			id: Locker.generateUniqueId(),
			userId,
			passcode,
			lastOpen,
			keys,
			addresses,
		};

		return wallet;
	}

	getUserWallet = id => {
		return Wallet;
	};
}

export const typeDefs = `
    type Wallet {
		id: String!
		userId: String!
		passcode: String!
		lastOpen: String
		transactions: [Transaction]!
		addresses: [String!]!
	}
`;

export const queries = `
	getUserWallet(userId: String!): Wallet
`;

export const mutations = `
	createWallet(passcode: String! ): Wallet
`;

export const resolvers = {
	Query: {
		getUserWallet: async (src, { userId }, { dataSources }) => {
			return dataSources.walletDataSource.getUserWallet(userId);
		},
	},
	Mutation: {
		createWallet: async (src, { passcode }, { dataSources }) => {
			return dataSources.walletDataSource.creatWallet(passcode);
		}
	},
};

const getDataSource = () => {
	if (process.env.ENVIRONMENT === 'production') {
		return new ApiDataSource();
	}
	else {
		return new DevDataSource();
	}
};

export const dataSource = getDataSource();
