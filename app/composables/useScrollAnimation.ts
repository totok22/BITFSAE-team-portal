import { onMounted } from 'vue'

/**
 * Composable for managing scroll animations
 * Observes elements with .animate-on-scroll and .car-card classes
 * and adds 'visible' class when they enter the viewport
 */
export function useScrollAnimation() {
  const initScrollAnimations = (): void => {
    if (!import.meta.client) return

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    const carCards = document.querySelectorAll('.car-card')
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px -50px 0px'
    })

    // Observe all animated elements
    animatedElements.forEach(el => {
      observer.observe(el)
      
      // Check if element is already in viewport
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible')
        observer.unobserve(el)
      }
    })

    // Car cards animation with staggered effect
    carCards.forEach((card, index) => {
      const carObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.classList.add('visible')
            }, index * 200)
            carObserver.unobserve(card)
          }
        })
      }, {
        threshold: 0.1
      })
      
      carObserver.observe(card)
    })
  }

  onMounted(() => {
    // Defer initialization to avoid race conditions
    setTimeout(() => {
      initScrollAnimations()
    }, 100)
  })

  return {
    initScrollAnimations
  }
}
