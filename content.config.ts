import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        news: defineCollection({
            type: 'page',
            source: 'news/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                description: z.string().optional().default(''),
                image: z.string().optional(),
                category: z.enum(['news', 'people', 'event', 'other']).optional(),
                source: z.string().optional(),
                tags: z.array(z.string()).optional(),
                link: z.string().optional(),
                body: z.record(z.any()).optional() // Ensure body is passed through schema
            })
        }),
        cars: defineCollection({
            type: 'page',
            source: 'cars/*.md',
            schema: z.object({
                title: z.string(),
                year: z.string(),
                model: z.string(),
                image: z.string().optional(),
                category: z.string().optional(),
                specs: z.record(z.any()).optional(),
                features: z.array(z.string()).optional(),
                description: z.string().optional()
            })
        }),
        events: defineCollection({
            type: 'page',
            source: 'events/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                location: z.string().optional(),
                description: z.string().optional(),
                image: z.string().optional(),
                category: z.string().optional(),
                tags: z.array(z.string()).optional(),
                body: z.record(z.any()).optional()
            })
        }),
        sponsors: defineCollection({
            type: 'page',
            source: 'sponsors/*.md',
            schema: z.object({
                title: z.string(),
                category: z.string().optional(),
                logo: z.string().optional(),
                website: z.string().optional(),
                description: z.string().optional()
            })
        })
    }
})
