import React from "react";
import { CommentBox, Container } from "./CommentInput.css";

// cipher text
export const CommentInput = () => {
  const [value, setValue] = React.useState<string>("");
  const handleChange = (event: any) => {
    const inputString: string = event.target.value;
    const code = inputString.charCodeAt(inputString.length - 1);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) // lower alpha (a-z)
    ) {
      setValue(inputString);
      return;
    }
    const inputChar = inputString.charAt(inputString.length - 1).toUpperCase();

    setValue(value + rot13(inputChar));
  };

  function rot13(correspondance: any) {
    const charCode = correspondance.charCodeAt();
    //A = 65, Z = 90
    return String.fromCharCode(
      charCode + 13 <= 90 ? charCode + 13 : ((charCode + 13) % 90) + 64
    );
  }

  return (
    <Container>
      <label>Why should we consider you for this position?</label>
      <br />
      <CommentBox
        value={value}
        onChange={handleChange}
        tabIndex={-1}
        required
      />
    </Container>
  );
};
