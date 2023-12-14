import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const initialData = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ];

  const [allData, setAllData] = useState(initialData) 
  const [persons, setPersons] = useState(initialData);
  const [newName, setNewName] = useState('');
  const [newTel, setNewTel] = useState('');

  const checkIfPersonAlreadyExists = (contact) => {
    return persons.some((p) => p.name === contact.name);
  };

  const clearFormData = () => {
    document.getElementById('contactName').value = "";
    document.getElementById('contactTel').value = "";
  }

  const handleContactChange = (event) => {
    setNewName(event.target.value);
  };

  const handleTelContactChange = (event) => {
    setNewTel(event.target.value);
  };

  const handleFilterContacts = (event) => {
    var str = event.target.value;
    if (str === '') {
      setPersons(allData);
      return;
    }
    const filteredPersons = allData.filter((p) => p.name.includes(str));
    setPersons(filteredPersons);
  };

  const addNewContact = (event) => {
    event.preventDefault();
    const newContact = { name: newName, number: newTel };
    if (checkIfPersonAlreadyExists(newContact)) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }
    setPersons((prevPersons) => [...prevPersons, newContact]); // Update state correctly
    setAllData((allData) => [...allData, newContact]);
    setNewName('');
    setNewTel('');
    clearFormData();
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <br />
      <Filter text='filter shown with' filterHandler={handleFilterContacts} />
      <h2>Add a new</h2>
      <PersonForm contactHandler={handleContactChange} telHandler={handleTelContactChange} submitHandler={addNewContact}/>
      <h2>Numbers</h2>
      <Persons persons={persons}/>
    </div>
  );
};

export default App;
