require('events').EventEmitter.prototype._maxListeners = 100;

import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import 'dotenv/config'

console.log(process.env);
import { prismaClient } from "./lib/db";
import bodyParser from "body-parser"
async function init() {
    const app = express();
    app.use(bodyParser.json());

    const PORT = Number(process.env.PORT) || 8000;

    const gqlServer = new ApolloServer({
        typeDefs: `
    type Query{
        hello: String
        say(name:String):String
    }
    type Mutation{
        createUser(firstname: String!,lastname: String!,email: String!,password: String!):Boolean
    }
    `,
        resolvers: {
            Query: {
                hello: () => `hey i am graphql server`,
                say: (_, { name }: { name: String }) => `helo ${name}`
            },
            Mutation: {
                createUser: async (_,
                    { firstname, lastname, email, password }:
                        { firstname: string, lastname: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            email,
                            firstname,
                            lastname,
                            password,
                            salt: "random",
                        }
                    })
                    return true;
                }
            }
        },
    });

    await gqlServer.start()
    app.get("/", (req, res) => {
        res.json({
            "msg": "server is up"
        })
    })

    app.use("/graphql", expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`server is running at port : ${PORT}`)
    })
}

init();