import type { ContextWithDb } from '@lightfish/server'
import { eq } from 'drizzle-orm'

import { usersTable } from '../../schema'

export default async function loginAPI(c: ContextWithDb) {
  const db = c.get('db')

  if (!db) {
    throw new Error('Database not configured')
  }

  const payload = await c.req.json<{
    username?: string
    password?: string
  }>()

  const username = payload.username?.trim()
  const password = payload.password?.trim()

  if (!username || !password) {
    throw new Error('用户名和密码不能为空')
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1)

  const user = users[0]

  if (!user) {
    const insertedUsers = await db
      .insert(usersTable)
      .values({
        username,
        password,
      })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        createdAt: usersTable.createdAt,
      })

    return insertedUsers[0]
  }

  if (user.password !== password) {
    throw new Error('密码错误')
  }

  return user
}
