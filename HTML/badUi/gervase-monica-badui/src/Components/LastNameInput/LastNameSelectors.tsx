import React from "react";
import { CharacterSlotMachine } from "./CharacterSlotMachine";
import { SelectorsContainer } from "./LastNameInput.css";
interface Props {
  selectorArray: number[];
  updateLastName: (index: number, character: string) => void;
}
export const LastNameSelectors = ({ selectorArray, updateLastName }: Props) => {
  return (
    <SelectorsContainer>
      {selectorArray.map((key, index) => {
        return (
          <CharacterSlotMachine
            key={key}
            updateLastName={updateLastName}
            index={index}
          />
        );
      })}
    </SelectorsContainer>
  );
};
