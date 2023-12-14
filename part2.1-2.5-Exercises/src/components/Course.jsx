import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <b>
        total of{" "}
        {
          course.parts.reduce((a, part) => ({
            exercises: a.exercises + part.exercises,
          })).exercises
        }
        &nbsp;exercises
      </b>
    </>
  );
};
export default Course;
