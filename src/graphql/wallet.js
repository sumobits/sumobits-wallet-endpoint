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
			lastOpen,
			keys,
			addresses,
		};

		return wallet;
	}

	getWallet = id => {
		// for now just return the static wallet
		return Wallet;
	};
}

export const typeDefs = `
    type Wallet {
		id: String!
		lastOpen: String
		transactions: [Transsaction]	
	}
`;

export const queries = `
	getWallet(id: String!): Wallet
`;

export const mutations = `
	createWallet(passcode: String!, ): User
`;

export const resolvers = {
	Query: {
		getUser: async (src, { id }, { dataSources }) => {
			return dataSources.userDataSource.getUser(id);
		},
	},
	Mutation: {
		createUser: async (src, { passcode }, { dataSources }) => {
			return dataSources.userDataSource.createUser(passcode);
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
