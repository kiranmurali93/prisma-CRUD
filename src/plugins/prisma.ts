// plugin for prisma
import { PrismaClient } from '.prisma/client'
import Hapi from '@hapi/hapi'

// adding new application state
declare module '@hapi/hapi' {
    interface ServerApplicationState {
      prisma: PrismaClient
    }
  }

const prismaPlugin: Hapi.Plugin<undefined> = {
    name: 'prisma',
    register: async function (server: Hapi.Server) {
        const prisma = new PrismaClient
        server.app.prisma = prisma

        //To stop the db as soon as the server is stopen
        server.ext({
            type: 'onPostStop',
            method: async(server: Hapi.Server) => {
                server.app.prisma.disconnect()
            }
        })
    }
}

export default prismaPlugin