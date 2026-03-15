import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const section = getRouterParam(event, 'section')
  const allowed = ['hero', 'navbar', 'about', 'projects', 'blog', 'footer']
  if (!allowed.includes(section!)) throw createError({ statusCode: 400 })

  const filePath = join(process.cwd(), 'content', 'settings', `${section}.json`)
  if (!existsSync(filePath)) throw createError({ statusCode: 404 })

  return JSON.parse(readFileSync(filePath, 'utf-8'))
})
