import React from "react";
import { CustomSlider, Container } from "./DobInput.css";

// slider selection
export const DobInput = () => {
  const JanFirst1900 = 44696;

  function getFormattedDate(date: Date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function valueLabelFormat(value: number) {
    var d = new Date();
    d.setDate(d.getDate() - JanFirst1900 + value);
    return `${getFormattedDate(d)}`;
  }

  const [value, setValue] = React.useState<number>(10);

  const handleChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  return (
    <Container>
      <label>Date of Birth:</label> {valueLabelFormat(value)}
      <CustomSlider
        value={value}
        min={0}
        max={JanFirst1900}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
    </Container>
  );
};
