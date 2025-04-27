import { Slider } from "@material-ui/core";
import React, { useState } from "react";
import { LastNameSelectors } from "./LastNameSelectors";

// select each letter via slot machine mechanic
// slider to set length

export const LastNameInput = () => {
  const [characters, setCharacters] = useState(0);
  const [charactersArray, setCharactersArray] = useState<number[]>([]);
  const [lastName, setLastName] = useState("");
  const handleChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setCharacters(newValue);
      let newArray = new Array(newValue).fill(0);
      setCharactersArray(newArray);
      let newName: string = lastName;
      for (let i = lastName.length; i < characters; i++) {
        newName += " ";
      }
      setLastName(newName);
    }
  };

  const updateLastName = (index: number, character: string) => {
    console.log(index, character);
    if (index > lastName.length - 1) return;
    setLastName(
      lastName.substring(0, index) + character + lastName.substring(index + 1)
    );
  };

  return (
    <div>
      <label>Last Name:</label>
      <input value={lastName} required minLength={characters} />

      <Slider value={characters} min={0} max={15} onChange={handleChange} />
      <LastNameSelectors
        selectorArray={charactersArray}
        updateLastName={updateLastName}
      />
    </div>
  );
};
