'use client'

import { useAuth } from '../_components/auth-provider'

export default function LoginPage() {
  const auth = useAuth()

  return (
    <form>
      <label htmlFor="email">Username:</label>
      <input id="username" name="username" type="username" required />
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={(formData) => { auth.signIn(formData) }}>Log in</button>
      <button formAction={(formData) => { auth.signUp(formData) }}>Sign up</button>
    </form>
  )
}