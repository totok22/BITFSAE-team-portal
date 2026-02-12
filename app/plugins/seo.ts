export default defineNuxtPlugin(() => {
  useSeoMeta({
    author: 'BITFSAE - 北京理工大学方程式赛车队',
    keywords: 'BITFSAE, 北京理工大学, 方程式赛车, 大学生方程式, 电动方程式, Formula SAE',
    ogType: 'website',
    ogSiteName: 'BITFSAE',
    twitterCard: 'summary_large_image'
  })

  useHead({
    titleTemplate: '%s | BITFSAE',
    script: [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BITFSAE',
          alternateName: '北京理工大学方程式赛车队',
          url: 'https://bitfsae.xin',
          logo: 'https://bitfsae.xin/assets/images/silver-shark.svg',
          description: '北京理工大学方程式赛车队(BITFSAE)致力于设计、制造高性能电动方程式赛车,参加中国大学生方程式汽车大赛。',
          sameAs: [
            'https://weibo.com/bitfsae',
            'https://space.bilibili.com/bitfsae'
          ],
          foundingDate: '2010',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '北京',
            addressCountry: 'CN'
          }
        })
      }
    ]
  })
})
