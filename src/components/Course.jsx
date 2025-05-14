const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Footer = (props) => <h3>{props.message}</h3>

const Total = (props) => <h3>Number of exercises {props.total}</h3>
const Midel = (props) =><h3>{props.midel}</h3>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}


const Course = ({ course,midel }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Midel midel={midel}/>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
      <Footer message={course.text} />
    </div>
  )
}

export default Course