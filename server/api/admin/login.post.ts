export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'
  if (password !== validPassword) {
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }
  setCookie(event, 'admin_token', validPassword, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    path: '/',
  })
  return { success: true }
})
