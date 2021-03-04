import React from "react";
import { Form } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";

export interface InputProps {
  containerStyle?: string;
  inputStyle?: string;
  name?: string;
  label?: string;
  value?: number;
  register?: any;
  placeholder?: string;
  maxLenght?: number;
  minLenght?: number;
  error?: string;
  onChange?: (value: number) => void;
  showGreen?: boolean;
}

export default function InputMoney(props: InputProps) {
  const onChange = (values: NumberFormatValues) => {
    props.onChange &&
      props.onChange(
        values.floatValue === undefined || values.floatValue === null
          ? 0
          : values.floatValue
      );
  };
  return (
    <Form.Group className={props.containerStyle}>
      <Form.Label>{props.label}</Form.Label>
      <NumberFormat
        className={`form-control ${
          props.showGreen && props.error && props.value
            ? "is-valid"
            : props.error
            ? "is-invalid"
            : ""
        } ${props.inputStyle}`}
        ref={props.register}
        aria-label={props.name}
        name={props.name}
        type="text"
        placeholder="$ 0,00"
        prefix="$ "
        decimalSeparator=","
        thousandSeparator="."
        allowedDecimalSeparators={[",", "."]}
        allowNegative={false}
        fixedDecimalScale
        decimalScale={2}
        value={props.value}
        onValueChange={onChange}
        onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.target.select()}
      />
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
