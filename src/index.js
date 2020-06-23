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

const server = new ApolloServer({
	dataSources: () => dataSources,
	debug: true,
	introspection: true,
	playground: true,
	resolvers,
	typeDefs,
});

const port = process.env.SERVER_PORT || 8080;

server.listen(port).then( result => {
	console.info(`Sumobits Endpoint Listening @ ${result.url}`);

	process.on('SIGINT', () => {
		console.warn('Caught interrupt signal');
		result.server.close(() => {
			process.exit();
		});
	});

	result.server.on('close', () => {
		process.exit(0);
	});
}).catch(err => {
	console.error(`Failed to initialize Apollo sever: ${err.message}`);
	process.exit(-1);
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
