const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.upvote, 0)
}

module.exports = {
  dummy,
  totalLikes
}