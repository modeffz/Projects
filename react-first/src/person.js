import React from 'react';

let person = {
    name: 'modeffz',
    age: 16,
    city: 'unknown',
}

function Person() {
    return (
        <div>
            <h1>Name: {person.name}</h1>
            <h2>Age: {person.age}</h2>
            <h2>City: {person.city}</h2>
        </div>
    )
}

export default Person;