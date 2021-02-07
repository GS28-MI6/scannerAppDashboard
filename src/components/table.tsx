import React from "react";
import { Table } from "react-bootstrap";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Tabla = ({ columns, sortColumn, onSort, data }) => {
  return (
    <Table striped bordered hover className="text-center">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} />
    </Table>
  );
};

export default Tabla;
