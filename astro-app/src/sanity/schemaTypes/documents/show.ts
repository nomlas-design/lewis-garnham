import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'MM/DD',
      },
      validation: (Rule) => Rule.required(),
      description: 'Enter the performance date using month/day.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold Out',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'location',
      subtitle: 'date',
      soldOut: 'soldOut',
    },
    prepare({title, subtitle, soldOut}) {
      return {
        title: soldOut ? `${title} (Sold Out)` : title,
        subtitle,
      }
    },
  },
})
