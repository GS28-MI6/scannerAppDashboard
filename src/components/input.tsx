import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

export interface InputProps {
  containerStyle?: string;
  inputStyle?: string;
  name?: string;
  label?: string;
  value?: string | number;
  register?: any;
  placeholder?: string;
  type?: string;
  maxLenght?: number;
  minLenght?: number;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  showGreen?: boolean;
}

export default function Input(props: InputProps) {
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
        defaultValue={props.value}
        placeholder={props.placeholder}
        type={props.type}
        maxLength={props.maxLenght || 50}
        minLength={props.minLenght}
        isValid={
          props.showGreen &&
          (props.error === "" || props.error === undefined) &&
          props.value !== undefined &&
          props.value !== ""
        }
        isInvalid={props.error !== undefined && props.error !== ""}
        onChange={props.onChange}
      ></Form.Control>
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
