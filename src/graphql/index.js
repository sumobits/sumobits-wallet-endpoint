/**
 * @format
 */
import { gql } from 'apollo-server';
import merge from 'lodash/merge';

import {
	dataSource as userDataSource,
	mutations as userMutations,
	queries as userQueries,
	resolvers as userResolvers,
	typeDefs as userType,
} from './user';


import {
	dataSource as transactionDataSource,
	mutations as transactionMutations,
	queries as transactionQueries,
	resolvers as transactionResolvers,
	typeDefs as transactionType,
} from './transaction';

export const dataSources = {
	userDataSource,
	transactionDataSource,
};

export const resolvers = merge(userResolvers, transactionResolvers);

export const typeDefs = gql`
	${userType}
	${transactionType}

	type Query {
		${userQueries}
		${transactionQueries}
	}

	type Mutation {
		${userMutations}
		${transactionMutations}
	}
`;
