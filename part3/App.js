import { useState, useEffect } from 'react'
import { findAllInRenderedTree } from 'react-dom/test-utils'
import noteService from './services/persons'
import './index.css'

const Names = ({person, removeContact}) => {


  return (
    <p>{person.name} {person.number} <button onClick={()=> removeContact(person.id)}>Delete</button></p>
  )

}

const Filter = ({type,value, onChange}) => {
  return(

    <div>
filter: <input type={type} value={value} onChange={onChange}/>
</div>
  )
}

const PersonForm = ({addNew, nameValue, numberValue,  type, setNewName, setNewNumber}) => {

  return (
  
  <form onSubmit={addNew}><div>
      
      name: <input value={nameValue} onChange={event => setNewName(event.target.value)}/>
      </div>
     
      <div>number: <input value={numberValue} onChange={event => setNewNumber (event.target.value)}/></div>
      <div>
    
      <button type={type}>add</button>
      </div>
    
  </form>
    )
}

const Persons = (props) => {

return(
  <div>
{props.results.map(person => <Names key={person.id} person={person} removeContact={props.removeContact} />
)}
</div>
)}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="note">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredValue, setFilteredValue] = useState('')
  const [filteredResults, setFilteredResults] = useState(persons)
  const [notification, setNotification] = useState(null)
  
  
  useEffect(() => {

    noteService
      .getAll()
        .then(initialPersons => {
          console.log(initialPersons)
        setPersons(initialPersons)
        setFilteredResults(initialPersons)
        
      }) 
  }, [])



const removeContact = (id) => {

  const index = persons.findIndex (x => x.id === id);

  if (window.confirm("Do you want to delete this contact?")) {
  noteService
        .removePerson(id)
        .then (removedPerson => {
          console.log("removed", removedPerson)
          const newPersons = persons.filter(person => person.id !== id)
          const newFiltered = filteredResults.filter(person => person.id !== id)
          console.log(newPersons)
          setPersons(newPersons)
          setFilteredResults(newFiltered)

          
          setNotification(
            `Deleted ${persons[index].name} `
          )
          setTimeout(() => {
            setNotification(null)
          }, 2000)
        
          
        })
      }
      else {
        console.log("nothing happened")
      }
          
  
}

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons[persons.length-1].id+1,
      
    }

    const index = persons.findIndex(x => x.name === newName);
    console.log(index, "index")
    console.log(persons.length, "length")
    console.log("new name is")
    console.log(nameObject)
   
    const filteredIndex = filteredResults.findIndex (x => x.name === newName);
if (newName.length <3) {
  setNotification(`Person validation failed: name: ${newName} is shorter than the minimum allowed length (3)`)
  setTimeout(() => {
    setNotification(null)
  }, 2000)  
}

    if(persons.some(person => person.name === newName)){

      if (window.confirm(`The name '${persons[index].name}' is already in the phone book. Do you want to change the number?`)) {
        
        const replacedObject = {
          name: persons[index].name,
          number: newNumber,
          id: persons[index].id,
        }
    
        noteService
      .update(persons[index].id, replacedObject)
      
      .then(updatedContact => {
        setPersons(persons.map(item => item.id === persons[index].id ? {...item, number: newNumber} : item))
        setFilteredResults(filteredResults.map (item => item.id === filteredResults[filteredIndex].id ? {...item, number:newNumber}: item))
        setNotification(
          `Updated the number of ${newName} `
        )
        setTimeout(() => {
          setNotification(null)
        }, 2000)
        console.log(updatedContact)
        console.log(persons)

      })
    } 

      console.log("nothing happened")
    
    } 

 else {
console.log("new name added")
      noteService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setFilteredResults(filteredResults.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification(
          `Added ${newName} `
        )
        setTimeout(() => {
          setNotification(null)
        }, 2000)
        console.log(persons)
      })
      .catch (error => {

        console.log (error.response.data)
      })
    } }




  const handleSearch = (event) => {
    console.log(event.target.value)
    setFilteredValue(event.target.value)

    const searchResults = persons.filter((item) => {
      return item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
    });
   
    setFilteredResults(searchResults);
    console.log(filteredResults, "Filtered results");
    console.log(persons, "persons");
  };
  

 

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

<form>

<div>

<Filter type="text" value={filteredValue} onChange={handleSearch}/>



</div>

</form>



      <h2>Add a new</h2>
     
     <PersonForm addNew={addName} nameValue={newName} numberValue={newNumber} type="submit" setNewName={setNewName} setNewNumber={setNewNumber}/>
     
      
      <h2>Numbers</h2>
      
{<Persons results={filteredResults} persons={persons} removeContact={removeContact}/>}
      
  </div>
  )

      }

     

export default App