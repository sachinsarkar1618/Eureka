import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const ComboBoxForQuestion = ({ questions, onOptionSelect }) => {
  const [colourOptions, setColourOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setColourOptions(questions);
      setLoading(false);
    }
  }, [questions]);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    onOptionSelect(selected);
  };

  // Custom styles for react-select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.color, // Use the color from the option
      backgroundColor: state.isSelected ? '#B0E0E6' : state.isFocused ? '#F0F8FF' : null, // Optional: Change background on focus/selection
    }),
    singleValue: (provided) => ({
      ...provided,
      color: selectedOption ? selectedOption.color : 'black', // Color of the selected option
    }),
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
    <Select
      className="basic-single font-medium"
      classNamePrefix="select"
      placeholder={`Eg - ${colourOptions[0].label}`}
      value={selectedOption} // No default value, placeholder will show
      onChange={handleSelectChange} // Call handler on change
      isClearable={true}
      isSearchable={true}
      isDisabled={!colourOptions.length}
      name="question"
      options={colourOptions}
      styles={customStyles} // Apply custom styles
      required
    />
  );
};

export default ComboBoxForQuestion;
