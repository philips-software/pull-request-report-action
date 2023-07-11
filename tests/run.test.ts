import { SanitizeMarkdownComment } from '../src/run'

describe('SanitizeMarkdownComment', () => {
  it('should replace opening HTML comment tags with HTML entities', () => {
    const input = '<!-- This is a comment'
    const expectedOutput = '&lt;!-- This is a comment'
    const output = SanitizeMarkdownComment(input)
    expect(output).toEqual(expectedOutput)
  })

  it('should replace closing HTML comment tags with HTML entities', () => {
    const input = 'This is a comment -->'
    const expectedOutput = 'This is a comment --&gt;'
    const output = SanitizeMarkdownComment(input)
    expect(output).toEqual(expectedOutput)
  })

  it('should replace both opening and closing HTML comment tags with HTML entities', () => {
    const input = '<!-- This is a comment -->'
    const expectedOutput = '&lt;!-- This is a comment --&gt;'
    const output = SanitizeMarkdownComment(input)
    expect(output).toEqual(expectedOutput)
  })

  it('should not modify input that does not contain HTML comment tags', () => {
    const input = 'This is not a comment'
    const expectedOutput = 'This is not a comment'
    const output = SanitizeMarkdownComment(input)
    expect(output).toEqual(expectedOutput)
  })
})
