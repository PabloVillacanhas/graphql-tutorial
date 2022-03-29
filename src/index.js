import fs from 'fs';
import path from 'path';
import { ApolloServer, PubSub } from 'apollo-server';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import Subscription from './resolvers/Subscription.js';
import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import User from './resolvers/User.js';
import Link from './resolvers/Link.js';
import { getUserId } from './utils.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const pubsub = new PubSub()
const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

const resolvers = {
	Query,
	Mutation,
	Subscription,
	User,
	Link,
	Vote
};

const server = new ApolloServer({
	typeDefs: fs.readFileSync(
		path.join(__dirname, 'schema.graphql'),
		'utf8'
	),
	resolvers,
	context: ({ req }) => {
		return {
			...req,
			prisma,
			pubsub,
			userId:
				req && req.headers.authorization
					? getUserId(req)
					: null
		};
	}
});

server
	.listen()
	.then(({ url }) =>
		console.log(`Server is running on ${url}`)
	);