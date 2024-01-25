const Persons = ({ persons, deleteFunction }) => {
  return (
    <div>
      {persons.map((p, key) => (
        <div key={key}>
          {p.name} {p.number}
          <button onClick={() => deleteFunction(p)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
