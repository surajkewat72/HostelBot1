const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const staffData = [
    { name: 'Rajesh Kumar', department: 'Maintenance' },
    { name: 'Priya Sharma', department: 'Electrical' },
    { name: 'Amit Patel', department: 'Plumbing' },
    { name: 'Sneha Reddy', department: 'IT' },
    { name: 'Vikram Singh', department: 'Mess' }
  ];

  for (const s of staffData) {
    const existingStaff = await prisma.staff.findFirst({ where: { name: s.name, department: s.department } });
    if (!existingStaff) {
      await prisma.staff.create({ data: s });
    }
  }

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
