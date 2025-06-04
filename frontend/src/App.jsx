import { useState, useEffect } from 'react'
import blogServices from './services/blogs'
import axios from 'axios'

const Footer = () => {
  const footerStyle = {
    color: "blue",
    fontStyle: 'italic',
    fontSize: 20
  }
  return (
    <div style={footerStyle}>
      <br />
      <p>Note app, Department of Computer Science, University of Helsinki 2024</p>
    </div>
  )
}


const Notification = ({ message, succesMessage }) => {
  if (message === null && succesMessage === null) return null

  return (
    <div>
      {succesMessage ? <div className="message">{succesMessage}</div> : null}
      {message ? <div className="error">{message}</div> : null}
    </div>
  )
}

const Filter = ({ filterText, filterBlog }) => (
  <form>
    <div>
      Filter Blog by title: <input value={filterText} onChange={filterBlog} />
    </div>
  </form>
)

const BlogForm = ({ newTitle, newAuthor, newLink, handleauthorChange, handleTitleChange, handleLinkChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      Author: <input value={newAuthor} onChange={handleauthorChange} />
    </div>
    <div>
      Title: <input value={newTitle} onChange={handleTitleChange} />
    </div>
    <div>
      Link: <input value={newLink} onChange={handleLinkChange} />
    </div>
    <div>
      <button type="submit">Add Blog</button>
    </div>
  </form>
)

const Blogs = ({ blogs, onDelete }) => (
  <ul>
    {blogs.map(blog =>
      <li key={blog.id}>
        <strong>{blog.title}</strong> by {blog.author}<br />
        <a href={blog.link} target="_blank" rel="noreferrer">{blog.link}</a><br />
        Upvotes: {blog.upVote}
        <button onClick={() => onDelete(blog.id)}>Delete</button>
        <hr />
      </li>
    )}
  </ul>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newAuthor, setnewAuthor] = useState('')
  const [newTitle, setnewTitle] = useState('')
  const [newLink, setnewlink] = useState('')
  const [newUpVote, setNewUpVote] = useState('')
  const [filterText, setFilter] = useState('')
  const [succesMessage, setSuccesMessage] = useState('Do you want to add a blog?')
  const [errorMessage, setErrorMessage] = useState('This view show you the error...')
  const [countries, setCountries] = useState([])
  const [searchItem, setSearchItem] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    blogServices.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  const handleauthorChange = (event) => setNewAuthor(event.target.value)
  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleLinkChange = (event) => setNewLink(event.target.value)
  const filterBlog = (event) => setFilterText(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()

    const existing = blogs.find(b => b.title === newTitle)
    if (existing) {
      const confirmUpdate = window.confirm(`${newTitle} already exists. Update the blog?`)
      if (confirmUpdate) {
        const updatedBlog = { ...existing, author: newAuthor, link: newLink }
        blogServices.update(existing.id, updatedBlog)
          .then(returnedBlog => {
            setBlogs(blogs.map(b => b.id !== existing.id ? b : returnedBlog))
            setSuccesMessage(`Updated "${returnedBlog.title}"`)
            setTimeout(() => setSuccesMessage(null), 5000)
          })
          .catch(error => {
            setErrorMessage(`Failed to update "${existing.title}"`)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
      return
    }

    const blogObject = {
      author: newAuthor,
      title: newTitle,
      link: newLink,
      upVote: newUpVote
    }

    blogServices.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewAuthor('')
        setNewTitle('')
        setNewLink('')
        setNewUpVote(0)
        setSuccesMessage(`Added "${returnedBlog.title}"`)
        setTimeout(() => setSuccesMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to add blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    const confirmDelete = window.confirm(`Delete "${blog.title}"?`)

    if (confirmDelete) {
      blogServices.remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setSuccesMessage(`Deleted "${blog.title}"`)
          setTimeout(() => setSuccesMessage(null), 5000)
        })
        .catch(() => {
          setErrorMessage(`Failed to delete "${blog.title}"`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const blogsToShow = filterText
    ? blogs.filter(b => b.title.toLowerCase().includes(filterText.toLowerCase()))
    : blogs

  return (
    <div>
      <h1>Blog Saver</h1>

      <Notification message={errorMessage} succesMessage={succesMessage} />

      <Filter filterText={filterText} filterBlog={filterBlog} />

      <h2>Add a new blog</h2>
      <BlogForm
        newAuthor={newAuthor}
        newTitle={newTitle}
        newLink={newLink}
        handleauthorChange={handleauthorChange}
        handleTitleChange={handleTitleChange}
        handleLinkChange={handleLinkChange}
        handleSubmit={addBlog}
      />


      <h2>Saved Blogs</h2>
      <Blogs blogs={blogsToShow} onDelete={deleteBlog} />



      <h1>Find country system</h1>
      <p>
        find countries:
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder='Enter the country to search'
        />
      </p>

      {countries.length > 10 && <p>You entered too many matches, Please be more specific.</p>}

      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matching countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common}>
                {country.name.common}{' '}
                <button onClick={() => countryButton(country)}>Show Data</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h3>{selectedCountry.name.common}</h3>
          <p>Capital: {selectedCountry.capital && selectedCountry.capital[0]}</p>
          <p>Area: {selectedCountry.area}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Language: {selectedCountry.languages && findLenguage(selectedCountry.languages)}</p>
          <img src={selectedCountry.flags.svg} alt={`Flag of ${selectedCountry.name.common}`} width="300" />
        </div>
      )}

      {weather && selectedCountry && (
        <div>
          <h3>Weather in {selectedCountry.capital && selectedCountry.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} km/h</p>
          {weather.weather[0]?.icon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
          )}
        </div>
      )}

      {apiError && <p>{apiError}</p>}

      <Footer />
    </div>
  )
}

export default App
