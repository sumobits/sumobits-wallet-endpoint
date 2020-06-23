/**
 * @format
 */
import { gql } from 'apollo-server';
import merge from 'lodash/merge';

import {
	dataSource as transactionDataSource,
	mutations as transactionMutations,
	queries as transactionQueries,
	resolvers as transactionResolvers,
	typeDefs as transactionTypeDefs,
} from './transaction';

import {
	dataSource as walletDataSource,
	mutations as walletMuations,
	queries as walletQueries,
	resolvers as walletResolvers,
	typeDefs as walletTypeDefs
} from './wallet';

export const dataSources = {
	walletDataSource,
	transactionDataSource,
};

export const resolvers = merge(transactionResolvers, walletResolvers);

export const typeDefs = gql`
	${walletTypeDefs}
	${transactionTypeDefs}

	type Query {
		${walletQueries}
		${transactionQueries}
	}

	type Mutation {
		${walletMuations}
		${transactionMutations}
	}
`;
