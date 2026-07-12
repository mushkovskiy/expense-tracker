import 'reflect-metadata';
import { DEFAULT_CURRENCY } from '@repo/config';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { CategoryModel } from '../models/category.model';
import { ExpenseModel } from '../models/expense.model';
import { UserModel } from '../models/user.model';
import { hashPassword } from '../utils/password';

const DEMO_USER = {
  email: 'demo@expensetracker.dev',
  password: 'Demo1234!',
  name: 'Demo User',
};

const DEMO_CATEGORIES = [
  { name: 'Groceries', color: '#3B9778', icon: '🛒' },
  { name: 'Dining Out', color: '#C2410C', icon: '🍽️' },
  { name: 'Transport', color: '#2563EB', icon: '🚗' },
  { name: 'Utilities', color: '#7C3AED', icon: '💡' },
  { name: 'Entertainment', color: '#DB2777', icon: '🎬' },
  { name: 'Health', color: '#0891B2', icon: '💊' },
];

const EXPENSE_COUNT = 50;
const MONTHS_BACK = 6;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAmount(): number {
  return Math.round((Math.random() * 190 + 5) * 100) / 100;
}

function randomDateWithinLastMonths(months: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const rangeMs = now.getTime() - start.getTime();
  return new Date(start.getTime() + Math.random() * rangeMs);
}

const DESCRIPTIONS = [
  'Weekly shop',
  'Coffee run',
  'Lunch with team',
  'Gas fill-up',
  'Electric bill',
  'Movie night',
  'Pharmacy',
  'Subway pass',
  'Takeout dinner',
  'Gym membership',
];

async function seed(): Promise<void> {
  await connectDatabase();

  let user = await UserModel.findOne({ email: DEMO_USER.email });
  if (!user) {
    const passwordHash = await hashPassword(DEMO_USER.password);
    user = await UserModel.create({
      email: DEMO_USER.email,
      passwordHash,
      name: DEMO_USER.name,
    });
    console.log(`Created demo user ${DEMO_USER.email}`);
  } else {
    console.log(`Demo user ${DEMO_USER.email} already exists`);
  }

  const userId = user._id;

  const categories = await Promise.all(
    DEMO_CATEGORIES.map((cat) =>
      CategoryModel.findOneAndUpdate(
        { user: userId, name: cat.name },
        { user: userId, name: cat.name, color: cat.color, icon: cat.icon },
        { upsert: true, new: true },
      ),
    ),
  );
  console.log(`Upserted ${categories.length} categories`);

  await ExpenseModel.deleteMany({ user: userId });

  const expenses = Array.from({ length: EXPENSE_COUNT }, () => {
    const category = categories[randomInt(0, categories.length - 1)];
    if (!category) {
      throw new Error('Category upsert failed unexpectedly');
    }
    return {
      user: userId,
      category: category._id,
      amount: randomAmount(),
      currency: DEFAULT_CURRENCY,
      description: DESCRIPTIONS[randomInt(0, DESCRIPTIONS.length - 1)],
      date: randomDateWithinLastMonths(MONTHS_BACK),
    };
  });

  await ExpenseModel.insertMany(expenses);
  console.log(`Inserted ${expenses.length} expenses for the last ${MONTHS_BACK} months`);

  await disconnectDatabase();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
