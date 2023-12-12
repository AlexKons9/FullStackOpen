import { useState } from "react";

const Header = (props) => <h2>{props.text}</h2>;
const Button = (props) => (
  <button onClick={props.handleFunction}>{props.text}</button>
);
const StatisticsLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const calculateAverage = (good, neutral, bad) => {
    const all = good + neutral + bad;
    return all === 0 ? 0 : (good * 1 + bad * -1) / all;
  };

  const calculatePositivePercentage = (good, neutral, bad) => {
    const all = good + neutral + bad;
    return all === 0 ? 0 : (good * 100) / all;
  };

  const average = calculateAverage(good, neutral, bad);
  const positive = calculatePositivePercentage(good, neutral, bad);

  if (good + neutral + bad > 0) {
    return (
      <table>
        <tbody>
          <StatisticsLine
            text="good"
            value={good}
          />
          <StatisticsLine
            text="neutral"
            value={neutral}
          />
          <StatisticsLine
            text="bad"
            value={bad}
          />
          <StatisticsLine
            text="all"
            value={good + neutral + bad}
          />
          <StatisticsLine
            text="average"
            value={calculateAverage(good, neutral, bad)}
          />
          <StatisticsLine
            text="positive"
            value={`${calculatePositivePercentage(good, neutral, bad)} %`}
          />
        </tbody>
      </table>
    );
  } else {
    return <div>No feedback given</div>;
  }
};

const App = () => {
  // save clicks of each button to its own state
  const anecdotes = [
    {
      text: "If it hurts, do it more often.",
      votes: 0,
    },
    {
      text: "Adding manpower to a late software project makes it later!",
      votes: 0,
    },
    {
      text: "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      votes: 0,
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      votes: 0,
    },
    {
      text: "Premature optimization is the root of all evil.",
      votes: 0,
    },
    {
      text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      votes: 0,
    },
    {
      text: "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      votes: 0,
    },
    {
      text: "The only way to go fast, is to go well.",
      votes: 0,
    },
  ];

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [selected, setSelected] = useState(0);
  const [array, setArray] = useState(anecdotes);
  const [maxVoted, setMaxVoted] = useState("");

  const vote = (selected) => {
    const updatedArray = [...array];
    updatedArray[selected].votes += 1;
    setArray(updatedArray);
    const newMaxVoted = findMax();
    setMaxVoted(newMaxVoted);
  };

  const findMax = () => {
    var max = { text: '', votes: 0};
    array.forEach((element) => {
      if (element.votes > max.votes) {
        max = element;
      }
    });
    return max;
  };

  return (
    <div>
      <Header text="give feedback" />
      <br />
      <Button
        handleFunction={() => setGood(good + 1)}
        text="good"
      />
      <Button
        handleFunction={() => setNeutral(neutral + 1)}
        text="neutral"
      />
      <Button
        handleFunction={() => setBad(bad + 1)}
        text="bad"
      />
      <Header text="statistics" />
      <br />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
      <br />
      <Header text="anecdotes" />
      <br />
      <div>{array[selected].text}</div>
      <div>has {array[selected].votes} votes</div>
      <Button
        text="vote"
        handleFunction={() => vote(selected)}
      />
      <Button
        text="next anecdote"
        handleFunction={() =>
          setSelected(
            Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0
          )
        }
      />
      <br />
      <Header text="Anecdote with most votes" />
      <div>{maxVoted.text}</div>
    </div>
  );
};

export default App;
