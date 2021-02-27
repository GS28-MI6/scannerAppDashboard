import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function NotFound() {
  const history = useHistory();
  return (
    <div className="text-center mt-5 pt-5">
      <h1>Página no encontrada</h1>
      <Button
        className="mt-5"
        size="lg"
        variant="info"
        onClick={() => history.goBack()}
      >
        <FontAwesomeIcon icon="undo" /> Volver
      </Button>
    </div>
  );
}
