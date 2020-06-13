/**
 * @format
 */
import { stable } from 'core-js';
import { runtime } from 'regenerator-runtime/runtime';
import readline from 'readline';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import {
	dataSources,
	resolvers, 
	typeDefs 
} from './graphql';

dotenv.config();

const port = process.env.SERVER_PORT || 8888;
const server = new ApolloServer({
	dataSources: () => dataSources,
	resolvers,
	typeDefs, 
});

server.listen(port).then(endpoint => {
	console.info(`Sumobits Endpoint Listening @ ${endpoint.url}`);
});

if (process.platform === 'win32') {
	const reader = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	reader.on('SIGINT', () => {
		process.emit('SIGINT');
	});
}

process.on('SIGINT', () => {
	console.warn('Caught interrupt signal');
	server.close(() => {
		process.exit();
	});
});
