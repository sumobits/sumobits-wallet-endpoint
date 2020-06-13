/**
 * @format
 */
import { DataSource } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import dotenv from 'dotenv';
import Locker from '../util/locker';
import { User } from '../data/sample';

dotenv.config();

class ApiDataSource extends RESTDataSource {
	constructor () {
		super();
		this.baseURL = process.env.HOST_ENDPOINT || 'http://localhost:8888/';
	}

	getUser = passcode => {
		// TODO implement me
	}

	createUser = passcode => {
		// TODO implement me
	}
}

class DevDataSource extends DataSource {	
	getUser = (passcode) => {
		if (!passcode) {
			return;
		}

		return User; // for now just return the currently stored User
	}

	createUser = (passcode) => {
		if (!passcode) {
			return;
		}

		const { 
			publicKey, 
			privateKey 
		} = Locker.generateKeypair(passcode);

		const newUser = {
			id: Locker.generateUniqueId(false),
			keys: {
				public: publicKey,
				private: privateKey,
			}
		};

		return newUser;
	};
}

export const typeDefs = `
	scalar UserKey

    type User {
		id: String!
		lastUsage: String
		keys: [UserKey]	
	}
`;

export const queries = `
	getUser(passcode: String!): User
`;

export const mutations =`
	createUser(passcode: String!): User
`;

export const resolvers = {
	Query: {
		getUser: async (src, { passcode }, { dataSources }) => {
			return dataSources.userDataSource.getUser(passcode);
		},
	},
	Mutation: {
		createUser: async (src, { passcode }, { dataSources }) => {
			return dataSources.userDataSource.createUser(passcode);
		}
	},
};

const getDataSource = () => {
	if (process.env.ENVIRONMENT === 'development') {
		return new DevDataSource();
	}
	else {
		return new ApiDataSource();
	}
};

export const dataSource = getDataSource();
