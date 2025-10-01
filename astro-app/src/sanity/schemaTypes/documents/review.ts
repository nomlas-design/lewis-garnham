import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'limitedRichText',
      validation: (Rule) => Rule.required().min(1),
      description: 'Use paragraphs with optional bold or italic emphasis.',
    }),
    defineField({
      name: 'starRating',
      title: 'Star Rating',
      type: 'number',
      validation: (Rule) => Rule.integer().min(1).max(5),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      starRating: 'starRating',
    },
    prepare({title, starRating}) {
      return {
        title,
        subtitle: starRating ? `${starRating} ★` : undefined,
      }
    },
  },
})
