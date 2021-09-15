import { PrismaClient } from '@prisma/client'
import { add } from 'date-fns'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  await prisma.user.deleteMany({}) //deleting all elements

  const user = await prisma.user.create({
    data:{
      email:'test@test.com',
      firstName: 'test',
      lastName: 'tester',
      social: {
        facebook : 'testFacebook',
        twitter : 'testtwitter'
      }
    }
  })
  console.log(user);
  
  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeekFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 28 })

  const course = await prisma.course.create({
    data: {
      name: 'test course',
      courseDetails: 'course for testing prisma',
      tests: {
        create: [
          {
            date: weekFromNow,
            name: 'First test',
          },
          {
            date: twoWeekFromNow,
            name: 'Second test',
          },
          {
            date: monthFromNow,
            name: 'Final exam',
          },
        ],
      }
    }
  })
  console.log(course);
  
}

main()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.disconnect()
  })
