import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";

export interface InputProps {
  containerStyle?: string;
  inputStyle?: string;
  name?: string;
  label?: string;
  value?: string | number;
  register?: any;
  placeholder?: string;
  maxLenght?: number;
  minLenght?: number;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  showGreen?: boolean;
}

export default function InputMoney(props: InputProps) {
  return (
    <Form.Group className={props.containerStyle}>
      <Form.Label>{props.label}</Form.Label>
      <CurrencyInput
        className={`form-control ${
          props.showGreen &&
          (props.error === "" || props.error === undefined) &&
          props.value !== undefined &&
          props.value !== ""
            ? "is-valid"
            : props.error !== undefined && props.error !== ""
            ? "is-invalid"
            : ""
        } ${props.inputStyle}`}
        id={props.name}
        data-testid={props.name}
        name={props.name}
        aria-label={props.name}
        ref={props.register}
        defaultValue={props.value}
        placeholder={props.placeholder}
        maxLength={props.maxLenght || 50}
        minLength={props.minLenght}
        onChange={props.onChange}
        prefix="$"
        fixedDecimalLength={2}
        disableAbbreviations
        step={1}
        decimalSeparator=","
        groupSeparator="."
      />
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
