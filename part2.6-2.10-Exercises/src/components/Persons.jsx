const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((p, key) => (
        <div key={key}>
          {p.name} {p.number}
        </div>
      ))}
    </div>
  );
};

export default Persons;
