import React from 'react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

const ClimbingBoxLoaderComponent = () => {

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <ClimbingBoxLoader color="#ffffff" loading={true} size={20} />
    </div>
  );
};

export default ClimbingBoxLoaderComponent;
