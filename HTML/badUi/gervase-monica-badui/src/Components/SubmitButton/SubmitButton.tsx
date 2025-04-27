import React from "react";
import { SubmitButtonStyle } from "../Form/Form.css";

// hidden input (like password)
export const SubmitButton = () => {
  const [marginLeft, setmarginLeft] = React.useState<number>(0);
  const [marginTop, setmarginTop] = React.useState<number>(0);
  const [moveDown, setMoveDown] = React.useState<boolean>(true);
  const [moveLeft, setMoveLeft] = React.useState<boolean>(true);

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const changeMargin = () => {
    if (screenWidth >= marginLeft + 200 && moveLeft) {
      setmarginLeft(marginLeft + 150);
      if (screenWidth <= marginLeft + 300) {
        setMoveLeft(false);
      }
    } else if (screenHeight / 2 >= marginTop + 200 && moveDown) {
      setmarginTop(marginTop + 50);
      if (screenHeight / 2 <= marginTop + 300) {
        setMoveDown(false);
      }
    } else if (0 <= marginTop) setmarginTop(marginTop - 75);
    else if (75 <= marginLeft) setmarginLeft(marginLeft - 75);
  };

  return (
    <div>
      <SubmitButtonStyle
        marginLeft={marginLeft.toString()}
        marginTop={marginTop.toString()}
        id="submit"
        type="submit"
        value="Submit"
        onMouseEnter={changeMargin}
      />
    </div>
  );
};
