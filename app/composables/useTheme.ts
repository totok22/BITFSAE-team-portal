import { ref } from 'vue'

export function useTheme() {
    const currentTheme = ref<'light' | 'dark'>('dark')

    const setTheme = (theme: 'light' | 'dark'): void => {
        currentTheme.value = theme
        if (import.meta.client) {
            document.documentElement.setAttribute('data-theme', theme)
            document.documentElement.classList.toggle('dark', theme === 'dark')
            localStorage.setItem('theme', theme)
        }
    }

    const toggleTheme = (): void => {
        const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    const initTheme = (): void => {
        if (import.meta.client) {
            const stored = localStorage.getItem('theme')
            const normalizedTheme: 'light' | 'dark' = stored === 'light' ? 'light' : 'dark'
            setTheme(normalizedTheme)
        } else {
            setTheme('dark')
        }
    }

    return {
        currentTheme,
        setTheme,
        toggleTheme,
        initTheme
    }
}
