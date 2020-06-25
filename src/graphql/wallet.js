/**
 * @format
 */
import { DataSource } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import moment from 'moment';
import Locker from '../util/locker';
import { 
	Keys, 
	Wallet 
} from '../data/sample';

class ApiDataSource extends RESTDataSource {
	constructor () {
		super();
		this.baseURL = process.env.HOST_ENDPOINT || 'http://localhost:8888/';
	}

	createWallet = async (userId, passcode, keys) => {
		// TODO implement me
	}

	getUserWallet = async userId => {
		// TODO implement me
	}
}

class DevDataSource extends DataSource {
	createWallet = async (userId, passcode) => {
		if (!userId || !passcode) {
			return;
		}

		const keys = Locker.generateKeypair(passcode);
		const addresses = [];

		for (let x = 0; x < 100; x++) {
			addresses.push(Locker.generateUniqueId(true));
		}

		const wallet = {
			id: Locker.generateUniqueId(),
			userId,
			passcode,
			keys: {
				private: keys.privateKey,
				public: keys.publicKey,
			},
			addresses,
			created: moment().format(),
			lastOpen: undefined,
		};

		return wallet;
	}

	getUserWallet = async userId => {
		return Wallet;
	};
}

export const typeDefs = `
	type Keys {
		private: String!
		public: String!
	}

    type Wallet {
		id: String!
		userId: String!
		passcode: String!
		created: String!
		lastOpen: String
		addresses: [String!]!
		keys: Keys!
		transactions: [Transaction!]
	}
`;

export const queries = `
	getUserWallet(userId: String!): Wallet
`;

export const mutations = `
	createWallet(passcode: String!, userId: String! ): Wallet
`;

export const resolvers = {
	Query: {
		getUserWallet: async (src, { userId }, { dataSources }) => {
			return await dataSources.walletDataSource.getUserWallet(userId) || {};
		},
	},
	Mutation: {
		createWallet: async (src, { 
			passcode, 
			userId
		}, { dataSources }) => {
			return await dataSources.walletDataSource.createWallet(userId, passcode) || {};
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
