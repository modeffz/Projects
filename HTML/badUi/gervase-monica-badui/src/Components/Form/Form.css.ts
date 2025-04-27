import styled from "@emotion/styled";

interface ButtonProps {
  marginLeft: string;
  marginTop: string;
}

export const SubmitButtonStyle = styled.input<ButtonProps>`
  margin-left: ${(props) => props.marginLeft}px;
  margin-top: ${(props) => props.marginTop}px;
`;

export const ButtonContainer = styled.div`
  padding: 20px;
`;

export const FormContainer = styled.div`
  padding: 40px;
  max-width: 900px;
  margin: 20px auto;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 16px rgba(28, 50, 55, 0.1);
`;

export const Divider = styled.div`
  width: 100%;
  margin: 15px auto;
  height: 1px;
  border-radius: 3px;
  background-color: #dde2f2;
`;
