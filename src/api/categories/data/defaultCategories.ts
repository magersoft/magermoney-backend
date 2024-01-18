import { CategoryEntity } from '@/api/categories/entities/category.entity';

import { $Enums } from '.prisma/client';

type DefaultCategoryType = Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt'>;

const INCOMES: DefaultCategoryType[] = [
  {
    name: 'Salary',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Investments',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Side Job',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Scholarship',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Gifts',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Rental Flat',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Rental Car',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Income from deposit',
    type: $Enums.CategoryType.INCOME,
  },
  {
    name: 'Pension',
    type: $Enums.CategoryType.INCOME,
  },
];

const EXPENSES: DefaultCategoryType[] = [
  {
    name: 'Rental Flat',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Rental Car',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Food',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Transportation',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Entertainment',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Clothing',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Health',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Education',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Gifts',
    type: $Enums.CategoryType.EXPENSE,
  },
  {
    name: 'Investments',
    type: $Enums.CategoryType.EXPENSE,
  },
];

const SAVED: DefaultCategoryType[] = [
  {
    name: 'Cash',
    type: $Enums.CategoryType.SAVED,
  },
  {
    name: 'Deposit',
    type: $Enums.CategoryType.SAVED,
  },
];

export const defaultCategories: DefaultCategoryType[] = [...INCOMES, ...EXPENSES, ...SAVED];
