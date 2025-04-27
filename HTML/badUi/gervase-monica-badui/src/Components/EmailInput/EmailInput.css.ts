import styled from "@emotion/styled";

export const EmailInputContainer = styled.div`
  transform: scaleY(-1);
  display: flex;
  flex-direction: column;
  width: 50%;
`;
export const EmailLabel = styled.label`
  transform: scaleX(0.5);
`;

export const EmailInputBox = styled.input`
  border: none;
  z-index: 99;
  background: transparent;
  margin-left: 30%;
  width: 50%;
  :focus {
    border: none;
    decoration: none;
    outline: none;
  }
`;

export const EmailFakeInput = styled.div`
  border: 1px solid black;
  height: 10px;
  width: 65%;
  /* position: absolute;
  left: 10; */
  z-index: 0;
`;
