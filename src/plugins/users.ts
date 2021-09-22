import Hapi from '@hapi/hapi'
import Joi from '@hapi/joi'
import { PrismaClient } from '.prisma/client'


const userPlugin: Hapi.Plugin<undefined> = {
    name: 'app/user',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
        {
            method: 'POST',
            path: '/users', 
            handler: createUserHandeler,
            options: {
                validate: {
                    payload: userInputValidator,
                    failAction: (request, h, err) => {
                        throw err
                      },
                }
            }
        },
        {
            method: 'GET',
            path: '/users/{userId}',
            handler: getUserHandler,
            options: {
              validate: {
                params: Joi.object({
                  userId: Joi.string().pattern(/^[0-9]+$/),
                }),
                failAction: (request, h, err) => {
                  throw err
                },
              },
            },
          },
          {
            method: 'DELETE',
            path: '/users/{userId}',
            handler: deleteHandler,
            options: {
              validate: {
                params: Joi.object({
                  userId: Joi.string().pattern(/^[0-9]+$/),
                }),
                failAction: (request, h, err) => {
                  throw err
                },
              },
            },
          },
          {
              method: 'PUT',
              path: '/users/{userId}',
              handler: updateUser,
              options: {
                  validate: {
                    params: Joi.object({
                        userId: Joi.string().pattern(/^[0-9]+$/),
                      }),
                      failAction: (request, h, err) => {
                        throw err
                      },
                  }
              }
          },
        ])
    }
}

export default userPlugin

interface UserInput {
    firstName:  string,
    lastName: string,
    email: string,
    social: {
        facebook?: string
        twitter?: string
        github?: string
        website?: string
}}

// user input validation
const userInputValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    social: Joi.object({
      facebook: Joi.string().optional(),
      twitter: Joi.string().optional(),
      github: Joi.string().optional(),
      website: Joi.string().optional(),
    }).optional(),
  })
  
// add new user
async function createUserHandeler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit) {
     //cont prisma = new PrismaClient -- not working 
     // experimental line
     const { prisma } = request.server.app
     const payload = request.payload as UserInput
    //console.log(payload.email);
     
    try {
        const createdUser = await prisma.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName:payload.lastName,
                social:payload.social 
            },
            select: {
                id: true,
              },
        })
        return h.response({ id: createdUser.id}).code( 201 )
    } catch (error) {
        console.log(error);
        return h.response('error').code(500)
    }
}

// view new user
async function getUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const userId = request.params.userId as string
    try {
      const user = await prisma.user.findOne({
        where: {
          id: parseInt(userId, 10),
        },
      })
        if (!user) {
            return h.response().code(404)
        } else {
            return h.response(user).code(200)
        }
        } catch (err) {
          console.log(err)
          return h.response().code(500)
        }
}

// delete user
async function deleteHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app
    const userId = request.params.userId 
  try {
    await prisma.user.delete({
      where: {
        id: parseInt(userId, 10),
      },
    })
    return h.response().code(204)
  } catch (err) {
    console.log(err)
    return h.response().code(500)
  }
}

// update option

async function updateUser(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const userId = request.params.userId as string
    const payload = request.payload as UserInput
    try {
        await prisma.user.update({
            where: {
                id: parseInt(userId, 10),
            },
            data: payload,
        })
        return h.response().code(204)
    } catch (err){
        console.log(err)
        return h.response().code(500)
    }
}