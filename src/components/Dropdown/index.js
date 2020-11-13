import React from 'react';
import Select from 'react-select';

const Dropdown = (props) => {

  return (
    <div className={props.className}>
      <p className='label'>{props.label}</p>
      <Select
        defaultValue={props.selected}
        options={props.options}
        isDisabled={props.disabled}
        onChange={props.onChange}
      />
    </div>
  )
}

export default Dropdown
