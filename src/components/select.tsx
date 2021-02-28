import React from "react";
import { Form } from "react-bootstrap";

interface InputSelectProps {
  options: { _id: string | number; name: string | number }[];
  optionDefault: string;
  optionDefaultIsNotDisabled?: boolean;
  containerStyle?: string;
  inputStyle?: string;
  name?: string;
  label?: string;
  error?: string;
  value_id?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  register?: any;
}

const InputSelect = (props: InputSelectProps) => {
  return (
    <Form.Group className={props.containerStyle}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        className={props.inputStyle}
        id={props.name}
        data-testid={props.name}
        name={props.name}
        aria-label={props.name}
        ref={props.register}
        value={props.value_id || ""}
        as="select"
        isValid={
          (props.error === "" || props.error === undefined) &&
          props.value_id !== undefined &&
          props.value_id !== ""
        }
        isInvalid={props.error !== undefined && props.error !== ""}
        onChange={props.onChange}
        custom
      >
        <option key="" value="" disabled={!props.optionDefaultIsNotDisabled}>
          {props.optionDefault}
        </option>
        {props.options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputSelect;
