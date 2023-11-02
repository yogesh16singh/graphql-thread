import express  from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
const app = express();
app.use(express.json())
const PORT=Number(process.env.PORT) || 8000;

const gqlServer = new ApolloServer({
    typeDefs:`
    type Query{
        hello: String
        say(name:String):String
    }
    `,
    resolvers:{
        Query:{
            hello:()=>`hey i am graphql server`,
            say:(_,{name}:{name:String})=>`helo ${name}`
        }
    },
  });

await gqlServer.start()
app.get("/",(req,res)=>{
    res.json({
        "msg":"server is up"
    })
})

app.use("/graphql",expressMiddleware(gqlServer))

app.listen(PORT,()=>{
console.log(`server is running at port : ${PORT}`)
}) 
}

init();