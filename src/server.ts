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

// funtion to start

export async function start(): Promise<Hapi.Server> {
    await server.register([statusPlugin, prismaPlugin, userPlugin])
    await server.start()
    console.log(`server is up and running on port: ${server.info.uri}`);
    return server 

}

process.on(`unhandeledRejections`, (err) => {
    console.log(err)
    process.exit(1)
})

start()
    .catch((err) => {
        console.log(err)
    })