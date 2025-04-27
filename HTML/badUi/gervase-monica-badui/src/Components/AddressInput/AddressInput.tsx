import React, { useState } from "react";
import { AddressInputBox, Container } from "./AddressInput.css";

export const AddressInput = () => {
  const [degrees, setDegrees] = useState(20);
  const handleChange = () => {
    setDegrees((degrees + 20) % 360);
  };
  return (
    <Container>
      {" "}
      <label>Address:</label>
      <AddressInputBox
        degrees={degrees}
        type="text"
        id="address"
        name="address"
        tabIndex={-1}
        onChange={handleChange}
        required
      />
    </Container>
  );
};
