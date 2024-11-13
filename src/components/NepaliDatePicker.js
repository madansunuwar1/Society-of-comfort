import React from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const NepaliDateInput = ({ value, onChange, ...props }) => {
  // Function to convert Nepali digits to English digits
  const convertToEnglishDigits = (nepaliDate) => {
    return nepaliDate.replace(/[०-९]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 2400)
    );
  };

  // If no value is provided, leave it undefined so the input is empty
  const dateToDisplay = value ? convertToEnglishDigits(value) : null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <NepaliDatePicker
        value={dateToDisplay}
        onChange={onChange}
        options={{ calenderLocale: "en", valueLocale: "en" }}
        className="custom-date-picker"
        placeholder="Select Date"
        {...props}
      />
    </div>
  );
};

export default NepaliDateInput;
