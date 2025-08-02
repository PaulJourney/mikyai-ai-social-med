import { PrismaClient } from '@prisma/client';
import { hashPassword, generateReferralCode } from './utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test admin user
  const adminPasswordHash = await hashPassword('1234');
  const adminReferralCode = generateReferralCode();

  const adminUser = await prisma.user.upsert({
    where: { email: 'support@miky.ai' },
    update: {},
    create: {
      email: 'support@miky.ai',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      credits: 10000,
      plan: 'BUSINESS',
      referralCode: adminReferralCode,
      referralsCount: 20,
      cashEarned: 40.00,
      emailVerified: true,
      language: 'en'
    }
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create some test users with referrals
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const userPasswordHash = await hashPassword('password123');
    const userReferralCode = generateReferralCode();
    
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        passwordHash: userPasswordHash,
        firstName: `User`,
        lastName: `${i}`,
        credits: i === 1 ? 1000 : 300, // First user has Plus plan
        plan: i === 1 ? 'PLUS' : 'FREE',
        referralCode: userReferralCode,
        referredBy: i > 1 ? adminUser.id : undefined,
        emailVerified: true,
        language: 'en'
      }
    });
    
    users.push(user);
    console.log(`✅ Created test user: ${user.email}`);
  }

  // Process referrals for test users
  for (const user of users.slice(1)) { // Skip first user
    await prisma.referral.create({
      data: {
        referrerId: adminUser.id,
        referredId: user.id,
        creditsAwarded: 300,
        cashAwarded: 2.00,
        processed: true
      }
    });
  }

  // Create sample conversations
  const personas = ['ACADEMIC', 'MARKETER', 'ENGINEER', 'COACH', 'SENSEI', 'LAWYER', 'MEDICAL', 'GOD_MODE', 'RICHMAN', 'GENERAL'];
  
  for (let i = 0; i < 10; i++) {
    const conversation = await prisma.conversation.create({
      data: {
        userId: users[i % users.length].id,
        title: `Sample conversation ${i + 1}`,
        persona: personas[i % personas.length] as any
      }
    });

    // Add some messages to the conversation
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          userId: users[i % users.length].id,
          content: `This is a sample user message ${i + 1}`,
          sender: 'USER',
          persona: conversation.persona,
          creditsConsumed: 0
        },
        {
          conversationId: conversation.id,
          userId: users[i % users.length].id,
          content: `This is a sample AI response ${i + 1}`,
          sender: 'ASSISTANT',
          persona: conversation.persona,
          creditsConsumed: 2
        }
      ]
    });
  }

  console.log('✅ Created sample conversations and messages');

  // Create sample transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: users[0].id,
        type: 'SUBSCRIPTION',
        amount: 19.00,
        credits: 1000,
        status: 'COMPLETED'
      },
      {
        userId: users[1].id,
        type: 'CREDITS',
        amount: 10.00,
        credits: 500,
        status: 'COMPLETED'
      },
      {
        userId: adminUser.id,
        type: 'REFERRAL',
        amount: 2.00,
        credits: 0,
        status: 'COMPLETED'
      }
    ]
  });

  console.log('✅ Created sample transactions');

  // Create admin settings
  const defaultSettings = [
    {
      key: 'persona_costs',
      value: {
        general: 1,
        academic: 2,
        marketer: 2,
        engineer: 2,
        coach: 2,
        sensei: 2,
        richman: 2,
        lawyer: 3,
        medical: 3,
        'god-mode': 5
      }
    },
    {
      key: 'plan_credits',
      value: {
        free: 100,
        plus: 1000,
        business: 5000
      }
    },
    {
      key: 'referral_settings',
      value: {
        credits_bonus: 300,
        cash_reward: 2.00,
        min_cashout: 10.00
      }
    },
    {
      key: 'feature_flags',
      value: {
        voice_input: true,
        file_uploads: true,
        god_mode_enabled: true,
        referral_system: true,
        premium_personas: true
      }
    }
  ];

  for (const setting of defaultSettings) {
    await prisma.adminSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  console.log('✅ Created admin settings');
  console.log('🎉 Database seeding completed!');
  
  console.log('\n📊 Summary:');
  console.log(`- Admin user: support@miky.ai (password: 1234)`);
  console.log(`- Test users: user1@example.com - user5@example.com (password: password123)`);
  console.log(`- Sample conversations: 10`);
  console.log(`- Sample transactions: 3`);
  console.log(`- Admin settings: ${defaultSettings.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });