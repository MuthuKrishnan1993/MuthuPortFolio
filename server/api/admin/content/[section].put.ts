import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  const validToken = process.env.ADMIN_PASSWORD || 'admin123'
  if (token !== validToken) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const section = getRouterParam(event, 'section')
  const allowed = ['hero', 'navbar', 'about', 'projects', 'blog', 'footer']
  if (!allowed.includes(section!)) throw createError({ statusCode: 400, message: 'Invalid section' })

  const body = await readBody(event)
  const filePath = join(process.cwd(), 'content', 'settings', `${section}.json`)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(body, null, 2))
  return { success: true }
})
