// db/schema.ts
import { pgTable, serial, varchar, timestamp, integer, boolean, date, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dailyTests = pgTable('daily_tests', {
  id: serial('id').primaryKey(),
  testDate: date('test_date').notNull().unique(),
  words: text('words').notNull(), // JSON string of word objects
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userTestAttempts = pgTable('user_test_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  testId: integer('test_id').references(() => dailyTests.id).notNull(),
  score: integer('score').notNull(),
  answers: text('answers').notNull(), // JSON string of user answers
  completed: boolean('completed').default(false).notNull(),
  attemptedAt: timestamp('attempted_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DailyTest = typeof dailyTests.$inferSelect;
export type NewDailyTest = typeof dailyTests.$inferInsert;
export type UserTestAttempt = typeof userTestAttempts.$inferSelect;
export type NewUserTestAttempt = typeof userTestAttempts.$inferInsert;