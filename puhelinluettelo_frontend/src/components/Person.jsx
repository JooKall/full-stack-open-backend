const Person = ({ person, removePerson }) => {

    return (
        <p>
            {person.name} {person.number}
            <button onClick={() => removePerson(person.id, person.name)}>remove</button>
        </p>
    )
}

export default Person