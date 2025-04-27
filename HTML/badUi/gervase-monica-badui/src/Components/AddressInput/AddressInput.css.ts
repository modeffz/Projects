import styled from "@emotion/styled";
interface Props {
  degrees: number;
}
export const AddressInputBox = styled.input<Props>`
  transform: rotate(${(props) => props.degrees}deg);
`;

export const Container = styled.div``;
