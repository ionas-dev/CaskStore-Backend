const { createServer } = require('@graphql-yoga/node');
import "reflect-metadata";
import { schema as schema_ } from './api/schema';
import { createContext } from './api/context';
import { getCaskImageFromHomepage } from './external/extImage'
import { PrismaClient } from "@prisma/client";

async function main() {
    //const schema = await schema_();
    //const server = createServer({ schema, context: createContext });
    //await server.start();

    const prisma = new PrismaClient();
    var caskCounter = 1;
    const casks = await prisma.cask.findMany({
        select: {
            id: true,
            title: true,
            homepage: true
        },
        where: {
           id: 2257 
        }
    }).then(casks => {
        casks.forEach(cask => {
            if (cask.homepage != null) {
                getCaskImageFromHomepage(cask.homepage, cask.id).then(result => {
                    if (caskCounter % 200 == 0) console.log("Cask " + caskCounter + " of " + casks.length);
                    if (result.length > 0) {
                        result.forEach((imageUrl,index) => {
                            const result = prisma.caskImage.create({
                                data: {
                                    title: cask.title,
                                    type: 'icon',
                                    url: imageUrl,
                                    caskId: cask.id
                                }
                            }).then(res => {if (caskCounter % 200 == 0) console.log(res)});
                        });
                    }
                    caskCounter++;
                });
            }
        });
    });

}
main();