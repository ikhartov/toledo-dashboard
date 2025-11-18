export function useCurrentUser() {
  const { user, clear } = useUserSession()
  const localePath = useLocalePath()

  async function logout() {
    await clear()
    navigateTo(localePath('/login'))
  }

  return { user, logout }
}
