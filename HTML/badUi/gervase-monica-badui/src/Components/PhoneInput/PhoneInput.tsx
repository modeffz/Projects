import React from "react";
import Select from "react-select";
import { ButtonContainer } from "../Form/Form.css";
import {
  ColumnContainer,
  Container,
  Header,
  NumbersContainer,
  RowContainer,
} from "./PhoneInput.css";

// dropdowns for each number
export const PhoneInput = () => {
  const [value, setValue] = React.useState<number>(0);
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const handleClick = (input: number) => {
    setValue(value + Math.floor(Math.random() * 6) + 1);
    if (phoneNumber.length === 0) {
      setPhoneNumber(phoneNumber + "(" + input.toString());
    } else if (phoneNumber.length === 4) {
      setPhoneNumber(phoneNumber + ") " + input.toString());
    } else if (phoneNumber.length === 9) {
      setPhoneNumber(phoneNumber + "-" + input.toString());
    } else if (phoneNumber.length < 14) {
      setPhoneNumber(phoneNumber + input.toString());
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <label>Phone Number:</label>{" "}
          <input type="tel" value={phoneNumber} required />
        </div>
        <button type="button" onClick={() => setPhoneNumber("")}>
          Reset
        </button>
      </Header>
      <ColumnContainer>
        <RowContainer>
          <button type="button" onClick={() => handleClick((value + 1) % 10)}>
            {(value + 1) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 2) % 10)}>
            {(value + 2) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 3) % 10)}>
            {(value + 3) % 10}
          </button>
        </RowContainer>
        <RowContainer>
          <button type="button" onClick={() => handleClick((value + 4) % 10)}>
            {(value + 4) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 5) % 10)}>
            {(value + 5) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 6) % 10)}>
            {(value + 6) % 10}
          </button>
        </RowContainer>
        <RowContainer>
          <button type="button" onClick={() => handleClick((value + 7) % 10)}>
            {(value + 7) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 8) % 10)}>
            {(value + 8) % 10}
          </button>
          <button type="button" onClick={() => handleClick((value + 9) % 10)}>
            {(value + 9) % 10}
          </button>
        </RowContainer>
        <RowContainer>
          <button type="button" onClick={() => handleClick((value + 0) % 10)}>
            {(value + 0) % 10}
          </button>
        </RowContainer>
      </ColumnContainer>
    </Container>
  );
};
