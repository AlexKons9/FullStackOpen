import { useState, useEffect } from "react";
import contactsService from "./services/contacts";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTel, setNewTel] = useState("");

  useEffect(() => {
    contactsService.getAll().then((contacts) => {
      setPersons(contacts);
    });
  }, []);

  const checkIfPersonAlreadyExists = (contact) => {
    return persons.some((p) => p.name === contact.name);
  };

  const clearFormData = () => {
    document.getElementById("contactName").value = "";
    document.getElementById("contactTel").value = "";
  };

  const handleContactChange = (event) => {
    setNewName(event.target.value);
  };

  const handleTelContactChange = (event) => {
    setNewTel(event.target.value);
  };

  const handleFilterContacts = (event) => {
    var str = event.target.value;
    if (str === "") {
      contactsService.getAll().then((contacts) => {
        setPersons(contacts);
      });
      return;
    }
    const filteredPersons = persons.filter((p) => p.name.includes(str));
    setPersons(filteredPersons);
  };

  const addNewContact = (event) => {
    event.preventDefault();
    const newContact = { name: newName, number: newTel };
    if (checkIfPersonAlreadyExists(newContact)) {
      if(window.confirm(`${newName} is already added to the phonebook. Do you want to change the phone number to new one?`))
      {
        var updatedPerson = persons.filter((p) => p.name == newContact.name)[0];
        updatedPerson.number = newContact.number;
        contactsService
          .update(updatedPerson.id, updatedPerson)
          .then(() => {
            contactsService.getAll().then((contacts) => {
              setPersons(contacts);
            });
          })
      }
    }
    else {
      contactsService.create(newContact).then((anewContact) => {
        setPersons((prevPersons) => [...prevPersons, anewContact]); // Update state correctly
        setAllData((allData) => [...allData, anewContact]);
      });
    }
    setNewName("");
    setNewTel("");
    clearFormData();
  };

  const deletePerson = (person) => {
    if(window.confirm(`Are you sure you want to delete ${person.name} ?`)){
      contactsService.deleteContact(person.id).then(() => {
        contactsService.getAll().then((contacts) => {
          setPersons(contacts);
        });
      });
    }
    return;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <br />
      <Filter
        text="filter shown with"
        filterHandler={handleFilterContacts}
      />
      <h2>Add a new</h2>
      <PersonForm
        contactHandler={handleContactChange}
        telHandler={handleTelContactChange}
        submitHandler={addNewContact}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        deleteFunction={deletePerson}
      />
    </div>
  );
};

export default App;
