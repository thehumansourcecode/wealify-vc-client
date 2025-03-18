interface ForgotFields {
  email: string
  otp: string
  password: string
  confirmPassword: string
}

interface ForgotErrors {
  email: string | undefined
  otp: string | undefined
  password: string | undefined
  confirmPassword: string | undefined
}

export const useForgot = () => {
  const router = useRouter()
  const step = ref<1 | 2 | 3>(1)

  const fields = ref<ForgotFields>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  })

  const errors = ref<ForgotErrors>({
    email: undefined,
    otp: undefined,
    password: undefined,
    confirmPassword: undefined,
  })

  const back = () => {
    switch (step.value) {
      case 1:
        router.push('/auth/sign-in')
        break
      case 2:
      case 3:
        step.value -= 1
        break
      default:
        break
    }
  }

  const next = () => {
    switch (step.value) {
      case 1:
      case 2:
        step.value += 1
        break
      case 3:
        router.push('/auth/sign-in')
        break
      default:
        break
    }
  }

  watch(
    () => fields.value.email,
    () => {
      errors.value.email = validateEmail(fields.value.email)
    },
  )

  watch(
    () => fields.value.password,
    () => {
      errors.value.password = validatePassword(fields.value.password) as string
    },
  )

  return { step, back, next, fields, errors }
}
