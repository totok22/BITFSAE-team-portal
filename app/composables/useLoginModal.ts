export function useLoginModal() {
  const isLoginModalOpen = useState<boolean>('login-modal-open', () => false)

  const openLoginModal = () => {
    isLoginModalOpen.value = true
  }

  const closeLoginModal = () => {
    isLoginModalOpen.value = false
  }

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal
  }
}
