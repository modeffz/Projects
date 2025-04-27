import { useState } from "react";
import { CharacterSlot } from "./CharacterSlot";
import { SlotMachineContainer } from "./LastNameInput.css";

interface Props {
  updateLastName: (index: number, character: string) => void;
  index: number;
}

export const CharacterSlotMachine = ({ updateLastName, index }: Props) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };
  return (
    <SlotMachineContainer>
      <CharacterSlot
        selected={selected}
        updateLastName={updateLastName}
        index={index}
      />
      <button type="button" onClick={handleClick}>
        {selected ? "Reselect" : "Confirm"}
      </button>
    </SlotMachineContainer>
  );
};
