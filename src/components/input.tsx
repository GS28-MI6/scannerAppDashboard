import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

export interface InputProps {
  containerStyle?: string;
  label?: string;
  id?: string;
  name?: string;
  register?: any;
  value?: string;
  defaultValue?: any;
  placeholder?: string;
  type?: string;
  maxLenght?: number;
  minLenght?: number;
  isOk?: boolean;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <Form.Group className={props.containerStyle}>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <Form.Control
        id={props.id}
        data-testid={props.id}
        name={props.name}
        aria-label={props.name}
        ref={props.register}
        value={props.value}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        type={props.type || "text"}
        maxLength={props.maxLenght}
        minLength={props.minLenght}
        isValid={props.isOk && !props.error ? true : false}
        isInvalid={props.error ? true : false}
        onChange={props.onChange}
      ></Form.Control>
      {props.error && (
        <Form.Control.Feedback type="invalid">
          {props.error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
