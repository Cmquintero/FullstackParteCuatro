const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        upvote: 5,
        __v: 0
      }
    ]

    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f34',
        title: 'tomoloca',
        author: 'Diazlok',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        upvote: 3,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234dds7f34',
        title: 'onepice',
        author: 'Martines',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        upvote: 7,
        __v: 0
      },
      {
        _id: '32422aa71b54a676234dds7f34',
        title: 'blackling',
        author: 'choros',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        upvote: 10,
        __v: 0
      }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 20)
  })
})
