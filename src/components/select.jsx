import React from "react";
import { Form } from "react-bootstrap";

const InputSelect = ({ name, label, options, error, value, ...rest }) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...rest}
        id={name}
        name={name}
        value={value}
        as="select"
        isValid={!error && value}
        isInvalid={error}
      >
        <option value="" />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputSelect;
