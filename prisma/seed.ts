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
      password: '$2b$10$zcQxglSy01EfbsMeUXI.VuEyRDMZIpJfWev88gi6ZlMnjo4pUssTi', //'agent008',
      role: 'admin',
    },
  })
  const user2 = await prisma.user.upsert({
    where: { login: 'Mike777' },
    update: {},
    create: {
      id: '6afebd76-48b8-4b70-bbe2-86724a772125',
      login: 'Mike777',
      name: 'Joe',
      age: 50,
      password: '$2b$10$Q9rYZUZKzzX8Khxhr2pXhuxBks4jbR3W0fVp760ian6WBKl/002fG', //'123qwe',
      role: 'guest',
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
