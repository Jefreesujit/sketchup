import React from 'react';
import Loader from 'react-spinners/ClipLoader';

const Spinner = ((props) => {
  if (!props.loading) {
    return <div />;
  }

  return (
    <div className="spinner-overlay">
      <div className="spinner-body">
        <Loader color="#26a69a" />
      </div>
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;