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

  const credentials = ref<SignInFields>({
    email: '',
    password: '',
  })

  const errors = ref<SignInFieldErrors>({
    email: undefined,
    password: undefined,
  })

  const { isLoading, handleRequest } = useHandleRequest(async () => {
    try {
      await signIn(credentials.value)
      await fetchProfile();
      router.push('/');
    } catch (error) {
      CommonLogger.instance.error('useSignIn + error', error)
      errors.value.password = ''
    }
  })

  const isValidate = computed(
    () =>
      !isLoading.value &&
      credentials.value.email &&
      credentials.value.password &&
      !errors.value.email &&
      !errors.value.password,
  )

  watch(
    () => credentials.value.email,
    () => {
      errors.value.email = validateEmail(credentials.value.email)
    },
  )

  watch(
    () => credentials.value.password,
    () => {
      errors.value.password = validatePassword(credentials.value.password) as string
    },
  )

  return { credentials, errors, isLoading, isValidate, signIn: handleRequest }
}
