import React from "react";
import { ListGroup } from "react-bootstrap";

const Lista = ({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect,
}) => {
  return (
    <ListGroup>
      {items.map((item) => (
        <ListGroup.Item
          className="clickeable"
          key={item[valueProperty]}
          onClick={() => {
            onItemSelect(item);
          }}
          active={item === selectedItem}
        >
          {item[textProperty]}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

Lista.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default Lista;
