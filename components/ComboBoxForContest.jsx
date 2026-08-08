'use client'
import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectComponent = ({ fetchColourOptions, onOptionSelect }) => {
  const [colourOptions, setColourOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchColourOptions.length > 0) {
      setColourOptions(fetchColourOptions);
      setLoading(false);
    }
  }, [fetchColourOptions]);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    onOptionSelect(selected); 
  };

  if (loading) {
    return (
      <div>
        <input
          type="text"
          className="w-full p-[6.5px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          placeholder="Loading..."
        />
      </div>
    );
  }
  
  return (
    <>
      <Select
        className="basic-single font-medium"
        classNamePrefix="select"
        placeholder={
          `Eg - ${colourOptions[0].label}`
        }
        value={selectedOption}
        onChange={handleSelectChange} 
        isClearable={true}
        isSearchable={true}
        isDisabled={!colourOptions.length}
        name="contest"
        options={colourOptions}
        required
      />
    </>
  );
};

export default SelectComponent;
