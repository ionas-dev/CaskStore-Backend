const { createServer } = require('@graphql-yoga/node');
import "reflect-metadata";
import schema from './api/schema';
import createContext from './api/context';

async function main() {
    const server = createServer({ context: createContext, schema: (await schema()) });
    server.start();
}
main();