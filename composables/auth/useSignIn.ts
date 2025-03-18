import { CommonLogger } from '~/common/logger'
import { useHandleRequest } from '../common/useHandleRequest'

interface SignInFields {
  email: string
  password: string
}

interface SignInFieldErrors {
  email: string | undefined
  password: string | undefined
}

export const useSignIn = () => {
  const { signIn } = useAuthStore()
  const { fetchProfile } = useProfileStore();
  const router = useRouter();

  const fields = ref<SignInFields>({
    email: '',
    password: '',
  })

  const errors = ref<SignInFieldErrors>({
    email: undefined,
    password: undefined,
  })

  const { isLoading, handleRequest } = useHandleRequest(async () => {
    try {
      await signIn(fields.value)
      await fetchProfile();
      router.push('/');
    } catch (error) {
      CommonLogger.instance.error('useSignIn + error', error)
      errors.value.password = 'Email or password is incorrect'
    }
  })

  const isValidate = computed(
    () =>
      !isLoading.value &&
      fields.value.email &&
      fields.value.password &&
      !errors.value.email &&
      !errors.value.password,
  )

  watch(
    () => fields.value.email,
    () => {
      errors.value.email = validateEmail(fields.value.email)
    },
  )

  watch(
    () => fields.value.password,
    () => {
      errors.value.password = validatePassword(fields.value.password)
    },
  )

  return { fields, errors, isLoading, isValidate, signIn: handleRequest }
}
