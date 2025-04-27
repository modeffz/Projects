import styled from "@emotion/styled";
import Slider from "@material-ui/core/Slider";

export const CustomSlider = styled(Slider)`
  width: 100%;

  // Value label
  .MuiSlider-valueLabel {
    background-color: transparent;
    cursor: default;

    // Wrapper
    & > * {
      transform: translate(8px, 60px);
      background-color: transparent;
    }

    // Text
    & > * > * {
      color: black;
      transform: rotate(0deg);
      margin-right: 7px;
    }
  }

  // Tick mark
  .MuiSlider-mark {
    display: none;
  }
`;

export const Container = styled.div`
  height: 70px;
  padding: 10px 0;
`;
