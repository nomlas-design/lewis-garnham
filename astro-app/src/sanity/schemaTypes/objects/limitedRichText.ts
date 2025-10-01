import {defineArrayMember, defineType} from 'sanity'

const inlineMarks = [
  {title: 'Strong', value: 'strong'},
  {title: 'Emphasis', value: 'em'},
]

export default defineType({
  name: 'limitedRichText',
  title: 'Rich Text (Limited)',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: inlineMarks,
        annotations: [],
      },
    }),
  ],
})
