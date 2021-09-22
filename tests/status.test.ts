import Hapi from '@hapi/hapi'
import { createServer } from '../src/server'

describe ('status plugin', ( ) => {
    let server: Hapi.Server

    beforeAll(async () => {
        server = await createServer()
    })

    afterAll(async () => {
        await server.stop()     
    })

    test('status endpoint', async() => {
        const response = await server.inject({
            url: '/',
            method: 'GET'
        })
        expect(response.payload).toBe("{\"up\":true}")
    })
})