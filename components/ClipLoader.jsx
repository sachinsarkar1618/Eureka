import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const SpinnerComponent = ({ size = 28 }) => {
  return (
    <div className="spinner-container">
      <ClipLoader loading={true} size={size} color={'#ffffff'} speedMultiplier={0.4} />
    </div>
  );
};

export default SpinnerComponent;
