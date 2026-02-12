import { ref, onMounted, onUnmounted } from 'vue'

export function useCarousel(slides: any[], interval = 5000) {
    const currentIndex = ref<number>(0)
    let timer: NodeJS.Timeout | null = null

    const nextSlide = (): void => {
        if (!slides || slides.length === 0) return
        currentIndex.value = (currentIndex.value + 1) % slides.length
    }

    const prevSlide = (): void => {
        if (!slides || slides.length === 0) return
        currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
    }

    const goToSlide = (index: number): void => {
        currentIndex.value = index
    }

    const startAutoPlay = (): void => {
        if (timer) clearInterval(timer)
        timer = setInterval(nextSlide, interval)
    }

    const stopAutoPlay = (): void => {
        if (timer) clearInterval(timer)
    }

    onMounted(() => {
        startAutoPlay()
    })

    onUnmounted(() => {
        stopAutoPlay()
    })

    return {
        currentIndex,
        nextSlide,
        prevSlide,
        goToSlide,
        startAutoPlay,
        stopAutoPlay
    }
}
