const { createServer } = require('@graphql-yoga/node');
import "reflect-metadata";
import { schema as schema_ } from './api/schema';
import { createContext } from './api/context';

async function main() {
    const schema = await schema_();
    const server = createServer({ schema, context: createContext });
    await server.start();
}
main();