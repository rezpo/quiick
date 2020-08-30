import React from 'react'

export default function Input(props) {

  const inputType = isType => {
    switch (isType) {
      case 'text':
        return 'text'
      case 'email':
        return 'email'
      case 'password':
        return 'password'
      case 'number':
        return 'number'
      case 'checkbox':
        return 'checkbox'
      default:
        return 'text'
    }
  }

  const makeType = inputType(props.input_type)

  return (
    <div className="input__wrapper">
      <label>{props.label_name}</label>
      <input
        type={makeType}
        placeholder={props.placeholder_content}
        value={props.value_state}
        onChange={(e) => {
          props.input_error(undefined)
          props.input_setState(e.target.value)
        }} />
    </div>
  )
}
