import React from "react";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";
import { Container } from "./FirstNameInput.css";

// randomly generated name
export const FirstNameInput = () => {
  const [value, setValue] = React.useState<string>("");

  const config: Config = {
    dictionaries: [names],
  };

  const getNewName = () => {
    const characterName: string = uniqueNamesGenerator(config);
    setValue(characterName);
  };

  return (
    <Container>
      <div>
        <label>First Name:</label>
        <input value={value} required />
      </div>
      <button type="button" onClick={() => getNewName()}>
        Generate {value && `New`} Name
      </button>
    </Container>
  );
};
