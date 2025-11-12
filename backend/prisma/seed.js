const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // create example staff
  const staffData = [
    { name: 'John Maintenance', department: 'Maintenance' },
    { name: 'Sarah Electrician', department: 'Electrical' },
    { name: 'Mike Plumber', department: 'Plumbing' },
    { name: 'Lisa IT Support', department: 'IT' },
    { name: 'David Mess Manager', department: 'Mess' }
  ];

  for (const s of staffData) {
    // staff.name is not unique in schema, so use findFirst then create if missing
    const existingStaff = await prisma.staff.findFirst({ where: { name: s.name, department: s.department } });
    if (!existingStaff) {
      await prisma.staff.create({ data: s });
    }
  }

  // create admin user
  const adminEmail = 'admin@college.edu';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({ data: { name: 'Admin User', email: adminEmail, password: hash, userType: 'admin' } });
    console.log('Created admin user ->', adminEmail, 'password: admin123');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
