const Persons = ({ persons, deleteFunction }) => {
  return (
    <div className="numbers-list">
      {persons.map((p, key) => (
        <div className="person-item" key={key}>
          <span className="name">{p.name}</span>
          <span className="number">{p.number}</span>
          <button className="delete-btn" onClick={() => deleteFunction(p)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;