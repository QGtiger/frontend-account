import { pgSchema, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

// 使用应用名称作为schema前缀
const appSchema = pgSchema('frontend-account');

/**
 * 用户表
 */
export const usersTable = appSchema.table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
