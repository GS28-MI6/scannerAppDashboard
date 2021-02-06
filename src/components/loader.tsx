import React from "react";
import { Spinner } from "react-bootstrap";

export interface LoaderProps {
  loading: boolean;
  containerStyle?: string;
  loaderStyle?: string;
  animation?: "border" | "grow";
  variant?:
    | "info"
    | "light"
    | "dark"
    | "warning"
    | "danger"
    | "success"
    | "secondary"
    | "primary";
}

export default function Loader({
  loading,
  containerStyle,
  loaderStyle,
  animation,
  variant,
}: LoaderProps) {
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${containerStyle}`}
    >
      {loading ? (
        <Spinner
          role="status"
          className={loaderStyle}
          animation={animation || "border"}
          variant={variant || "info"}
        />
      ) : null}
    </div>
  );
}
