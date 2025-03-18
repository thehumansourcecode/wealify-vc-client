export const validateEmail = (email: string): string | undefined => {
  // Rule 1: Check if email is empty or only whitespace
  if (!email || email.trim() === '') {
    return 'Email is mandatory. Please enter your email.'
  }

  // Rule 2: Check email format using a regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Email is invalid'
  }

  // If all checks pass, return null (no error)
  return
}

export const passwordRequirements = [
  { regex: /.{8,}/, text: 'Minimum of 8 characters' },
  { regex: /\d/, text: 'At least 1 number' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /^(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/, text: 'At least 1 special character' },
]

export const validatePassword = (password: string): string | undefined => {
  // Check if password is empty
  if (!password || password.trim() === '') {
    return 'Password is mandatory. Please enter your password'
  }

  // Check if password
  if (passwordRequirements.some(({ regex }) => !regex.test(password))) {
    return 'The password must be at least 8 - 16 characters, including uppercase, lowercase, numbers, special characters and not contain space'
  }

  // If all checks pass, return null or a success message
  return
}
