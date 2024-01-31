import { useState, useEffect } from "react";
import contactsService from "./services/contacts";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import Error from "./components/Error";
import "./App.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTel, setNewTel] = useState("");
  const [notification, setNotification] = useState();
  const [error, setError] = useState();

  // When Loads
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      var contacts = await contactsService.getAll();
      setPersons(contacts);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Check If a person exists and returns bool
  const checkIfPersonAlreadyExists = async (contact) => {
    try {
      const contacts = await contactsService.getAll();
      return contacts.some((p) => p.name === contact.name);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError(null);
      }, 5000);
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
      // Update existing contact if it exists
      var updatedPerson = persons.find((p) => p.name === newContact.name);
      const updatedPersonCopy = { ...updatedPerson, number: newContact.number }; // Create a copy with the updated data
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Do you want to change the phone number to new one?`
        )
      ) {
        try {
          const updatedContact = await contactsService.update(
            updatedPerson.id,
            updatedPersonCopy
          );
          setNotification(`Updated ${updatedPerson.name}`);
          // Update the contact in the state with the response from the server
          setPersons(
            persons.map((person) =>
              person.id === updatedContact.id ? updatedContact : person
            )
          );
        } catch (error) {
          setError(error.response.data.error);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      }
    } else {
      // Create new contact if it doesn't exist
      try {
        await contactsService.create(newContact);
        setNotification(`Added ${newContact.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        fetchContacts(); // Fetch all contacts again after successful create
      } catch (error) {
        setError(error.response.data.error);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
    setNewName("");
    setNewTel("");
    clearFormData();
  };

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name} ?`)) {
      contactsService.deleteContact(person.id).then(() => {
        setNotification(`Deleted ${person.name}`);
        contactsService
          .getAll()
          .then((contacts) => {
            setPersons(contacts);
          })
          .catch((error) => {
            setError(error.response.data.error);
            setTimeout(() => {
              setError(null);
            }, 5000);
          });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
    return;
  };

  return (
    <div className="container">
      <h2 className="title">Phonebook</h2>
      {notification ? <Notification message={notification} /> : ""}
      {error ? <Error message={error} /> : ""}
      <br />
      <Filter
        text="Search"
        filterHandler={handleFilterContacts}
      />
      <div className="add-section">
      <h2>Add a new</h2>
      <PersonForm
        contactHandler={handleContactChange}
        telHandler={handleTelContactChange}
        submitHandler={addNewContact}
      />
      </div>
      <div className="add-section">
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        deleteFunction={deletePerson}
      />
      </div>
    </div>
  );
};

export default App;
