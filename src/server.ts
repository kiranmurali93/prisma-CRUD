import Hapi  from '@hapi/hapi'

//plugins
import statusPlugin from './plugins/status'
import prismaPlugin from './plugins/prisma'
import userPlugin from './plugins/users'

// hapi server config
const server: Hapi.Server = Hapi.server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000
}) 

//function to create server
export async function createServer(): Promise<Hapi.Server> {
    await server.register([statusPlugin, prismaPlugin, userPlugin])
    await server.initialize()
    return server
}

// funtion to start

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
    // await server.register([statusPlugin, prismaPlugin, userPlugin])
    await server.start()
    console.log(`server is up and running on port: ${server.info.uri}`);
    return server 

}

process.on(`unhandeledRejections`, (err) => {
    console.log(err)
    process.exit(1)
})
