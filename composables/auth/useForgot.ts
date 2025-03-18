export const useForgot = () => {
  const router = useRouter()
  const step = ref<1 | 2 | 3>(1)

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

  return { step, back, next }
}
