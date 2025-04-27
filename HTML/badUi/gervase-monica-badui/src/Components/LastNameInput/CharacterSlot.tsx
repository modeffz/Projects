import React, { useEffect, useState } from "react";
import { CharacterContainer } from "./LastNameInput.css";
import { alphabetArray } from "./utils";
interface Props {
  selected: boolean;
  updateLastName: (index: number, character: string) => void;
  index: number;
}

export const CharacterSlot = ({ selected, updateLastName, index }: Props) => {
  const [character, setCharacter] = useState(alphabetArray[0]);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      if (!selected) {
        setCounter(counter + 1);
        setCharacter(alphabetArray[counter % alphabetArray.length]);
      }
      if (selected) {
        updateLastName(index, character);
      }
    }, 100);
  }, [counter, selected]);
  // Do we hoist this to create an actual name or leave as is?
  return (
    <CharacterContainer>
      <div>{character}</div>
    </CharacterContainer>
  );
};
