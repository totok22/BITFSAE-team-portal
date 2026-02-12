export function useMobileMenu() {
  const isMobileMenuOpen = useState<boolean>('mobile-menu-open', () => false)

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  return {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu
  }
}
