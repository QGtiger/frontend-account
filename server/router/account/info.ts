import type { ContextWithDb } from "@lightfish/server";
import { eq } from "drizzle-orm";

import { usersTable } from "../../schema";

export default async function infoAPI(c: ContextWithDb) {
  const db = c.get("db");

  if (!db) {
    throw new Error("Database not configured");
  }

  // 从请求头获取 X-User-Id
  const userIdHeader = c.req.header("X-User-Id");
  if (!userIdHeader) {
    throw new Error("缺少 X-User-Id 请求头");
  }

  const userId = Number.parseInt(userIdHeader, 10);
  if (Number.isNaN(userId)) {
    throw new Error("X-User-Id 必须为数字");
  }

  // 根据 id 查询用户
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  const user = users[0];
  if (!user) {
    throw new Error("用户不存在");
  }

  // 返回用户信息（不包含密码等敏感字段，可按需筛选）
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}