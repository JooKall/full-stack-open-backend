import { useState, useEffect } from 'react'
import personService from './services/persons'
import PersonForm from './components/Personform'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isError: false
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))

            setNotificationMessage({
              message: `The number for ${existingPerson.name} has been updated`,
              isError: false
            })
          })
          .catch(error => {
            // check if validation error
            if (error.response.data.name === 'ValidationError') {
              setNotificationMessage({
                message: `Validation failed: ${error.response.data.message}`,
                isError: true
              })
            } else {
              setNotificationMessage({
                message: `Information of ${existingPerson.name} has already been removed from the server`,
                isError: true
              })
              setPersons(persons.filter(person => person.id !== existingPerson.id))
            }
          })
          .finally(() => {
            setTimeout(() => {
              setNotificationMessage({ message: null, isError: false })
            }, 3000)
          })
      }
    } else {
      const person = {
        name: newName,
        number: newNumber
      }
      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))

          setNotificationMessage({
            message: `Added ${newName}`,
            isError: false
          })
        })
        .catch(error => {
          setNotificationMessage({
            message: `Could not add ${newName}. Error: ${error.response.data.message}`,
            isError: true
          })
        })
        .finally(() => {
          setTimeout(() => {
            setNotificationMessage({ message: null, isError: false })
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotificationMessage({
            message: `${name} deleted`,
            isError: false
          })
        })
        .catch(error => {
          console.log(error)
          setNotificationMessage({
            message: `Failed to remove '${name}'. The server might be down or the person has already been removed.`,
            isError: true
          })
        }).finally(() => {
          setTimeout(() => {
            setNotificationMessage({ message: null, isError: false })
          }, 3000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage.message}
        isError={notificationMessage.isError}
      />
      <Filter filter={filter} handleFilter={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )

}

export default App