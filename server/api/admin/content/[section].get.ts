export default defineEventHandler(async (event) => {
  const section = getRouterParam(event, 'section')
  const allowed = ['hero', 'navbar', 'about', 'projects', 'blog', 'footer']
  if (!allowed.includes(section!)) throw createError({ statusCode: 400 })

  const storage = useStorage('assets:settings')
  const data = await storage.getItem(`${section}.json`)
  if (!data) throw createError({ statusCode: 404 })

  return data
})
