const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe("total likes", () => {
  test("of empty ", () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test("when list has only one blog, equals the likes of that", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://urlblogex.com",
        likes: 5,
        __v: 0,
      },
    ]
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test("The list of blogs has these likes:", () => {
    const blogs = [
      {
        _id: "1",
        title: "xavi alonso",
        author: "Alonso bel",
        url: "https://urlblogex.com",
        likes: 3,
        __v: 0,
      },
      {
        _id: "2",
        title: "Franco mast",
        author: "https://urlblogex.com",
        url: "https://urlblogex.com",
        likes: 7,
        __v: 0,
      },
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result)
  })
})

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test("when list has only one blog, returns that blog", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://example.com",
        likes: 5,
        __v: 0,
      },
    ]
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    })
  })

  test("of a bigger list returns the one with most likes", () => {
    const blogs = [
      {
        _id: "1",
        title: "Firstblog",
        author: "blogerunique",
        url: "https://urlblogex.com",
        likes: 4,
        __v: 0,
      },
      {
        _id: "2",
        title: "infrarojo",
        author: "davitolox",
        url: "https://urlblogex.com",
        likes: 15,
        __v: 0,
      }
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: "infrarojo",
      author: "davitolox",
      likes: 15,
    })
  })
})

describe("most blogs", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test("when list has one blog, returns the author and count 1", () => {
    const blogs = [
      {
        _id: "1",
        title: "Andrew day",
        author: "Andrew ",
        url: "https://urlblogex.com",
        likes: 2,
        __v: 0,
      },
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Andrew X",
      blogs: 1,
    })
  })

  test("of a bigger list returns the author with most blogs", () => {
    const blogs = [
      { _id: "1", title: "Alice day", author: "Alice", url: "https://urlblogex.com", likes: 3 },
      { _id: "2", title: "aran-v", author: "Bob", url: "https://urlblogex.com", likes: 5 },
      { _id: "3", title: "slim sahdy", author: "Alice", url: "https://urlblogex.com", likes: 2 },
      { _id: "4", title: "Chombo", author: "Alice", url: "https://urlblogex.com", likes: 1 },
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Alice",
      blogs: 2,
    })
  })
})

describe("most likes", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test("when list has one blog, returns its author and likes", () => {
    const blogs = [
      {
        _id: "1",
        title: "Sots",
        author: "Sots finder",
        url: "https://urlblogex.com",
        likes: 10,
        __v: 0,
      },
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Sots finder",
      likes: 10,
    })
  })

  test("of a bigger list returns the author with most total likes", () => {
    const blogs = [
      { _id: "1", title: "Ana-lizando ", author: "Ana", url: "https://urlblogex.com", likes: 10 },
      { _id: "2", title: "error", author: "Ben", url: "https://urlblogex.com", likes: 5 },
      { _id: "3", title: "The bomb", author: "Ana", url: "https://urlblogex.com", likes: 7 },
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Ana",
      likes: 17,
    })
  })
})