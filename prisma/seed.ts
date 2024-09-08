import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user1 = await prisma.user.upsert({
    where: { login: 'agent007' },
    update: {},
    create: {
      login: 'agent007',
      name: 'James',
      age: 40,
      password: 'agent008',
    },
  })
  const user2 = await prisma.user.upsert({
    where: { login: 'Mike777' },
    update: {},
    create: {
      login: 'Mike777',
      name: 'Joe',
      age: 50,
      password: '123qwe',
    },
  })
  console.log({ user1, user2 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
