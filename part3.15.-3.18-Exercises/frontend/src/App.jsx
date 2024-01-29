import { useState, useEffect } from "react";
import contactsService from "./services/contacts";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import Error from "./components/Error";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTel, setNewTel] = useState("");
  const [notification, setNotification] = useState();
  const [error, setError] = useState();

  // When Loads
  useEffect(() => {
    contactsService.getAll().then((contacts) => {
      setPersons(contacts);
    });
  }, []);
  
  // Check If a person exists and returns bool
  const checkIfPersonAlreadyExists = async (contact) => {
    try {
      const contacts = await contactsService.getAll();
      return contacts.some((p) => p.name === contact.name);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      // Handle the error as needed
      return false; // Assuming no match in case of an error
    }
  };

  //clear forms Data
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

    contactsService.getAll().then((persons) => {
      var allPersons = persons;

      if (str === "") {
        setPersons(allPersons);
        return;
      }

      const filteredPersons = allPersons.filter((p) => p.name.includes(str));
      setPersons(filteredPersons);
    });
  };

  const addNewContact = async (event) => {
    event.preventDefault();
    const newContact = { name: newName, number: newTel };
    if (await checkIfPersonAlreadyExists(newContact)) {
      if (window.confirm(`${newName} is already added to the phonebook. Do you want to change the phone number to new one?`)) {
        var updatedPerson = persons.filter((p) => p.name == newContact.name)[0];
        updatedPerson.number = newContact.number;
        contactsService
          .update(updatedPerson.id, updatedPerson)
          .then(() => {
            setNotification(`Updated ${updatedPerson.name}`);
            contactsService.getAll().then((contacts) => {
              setPersons(contacts);
              setTimeout(() => {
                setNotification(null);
              }, 5000);
            });
          })
          .catch(() => {
            setError(
              `Information of ${updatedPerson.name} has been removed from server`
            );
            setTimeout(() => {
              setError(null);
            }, 5000);
          });
      }
    } else {
      contactsService.create(newContact).then((anewContact) => {
        setNotification(`Added ${anewContact.name}`);
        setPersons((prevPersons) => [...prevPersons, anewContact]);
        setAllData((allData) => [...allData, anewContact]);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
    setNewName("");
    setNewTel("");
    clearFormData();
  };

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name} ?`)) {
      contactsService.deleteContact(person.id).then(() => {
        setNotification(`Deleted ${person.name}`);
        contactsService.getAll().then((contacts) => {
          setPersons(contacts);
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
    return;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification ? <Notification message={notification} /> : ""}
      {error ? <Error message={error} /> : ""}
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
