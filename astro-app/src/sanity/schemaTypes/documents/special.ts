import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'special',
  title: 'Special',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'limitedRichText',
      validation: (Rule) => Rule.required().min(1),
      description: 'Use paragraphs with optional bold or italic emphasis.',
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'string',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Enter only the YouTube video ID (e.g., dQw4w9WgXcQ).',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-zA-Z0-9_-]{11}$/u, {
            name: 'YouTube ID',
            invert: false,
          })
          .error('Please enter the 11-character YouTube video ID, not the full URL.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'details',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      }
    },
  },
})
