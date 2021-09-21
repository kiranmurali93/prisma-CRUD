// status plugin
import Hapi from '@hapi/hapi'

const plugin: Hapi.Plugin<undefined> = {
    name: 'app/status',
    register:  async function (server: Hapi.Server) {
        server.route({
            method: 'Get',
            path: '/',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return h.response({up: true}).code(200)
            }
        })
    }
}

export default plugin 