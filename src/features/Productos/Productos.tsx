import React, { useEffect, useState } from "react";
import Producto from "../../components/Producto";
import InputSelect from "../../components/select";
import Input from "../../components/input";
import { Alert, Button, Container, Form, Table, Card } from "react-bootstrap";
import { useReduxDispatch } from "../../app/store";
import {
  clearErrorsProductos,
  errorsProductosSelector,
  getProducts,
  loadingProductosSelector,
  productosAllSelector,
  getCategorias,
  categoriasSelector,
  errorsCategoriasSelector,
  loadingCategoriasSelector,
  clearErrorsCategorias,
} from "./productosSlice";
import { Product } from "../../actions/Productos";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import { tokenSelector } from "../Login/userSlice";
import { paginate } from "./../../utils";
import Paginacion from "./../../components/Paginacion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Productos() {
  const dispatch = useReduxDispatch();

  const token = useSelector(tokenSelector);

  const pageSize = 15;

  const [pageNumber, setPageNumber] = useState(1);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");

  const categories = useSelector(categoriasSelector);
  const loadingCategories = useSelector(loadingCategoriasSelector);
  const errorsCategories = useSelector(errorsCategoriasSelector);

  const productos = useSelector(productosAllSelector);
  const loadingProductos = useSelector(loadingProductosSelector);
  const errorsProducts: string[] = useSelector(errorsProductosSelector);

  useEffect(() => {
    if (categories.length === 0) dispatch(getCategorias({ token }));
  }, [dispatch, token, categories]);

  useEffect(() => {
    if (productos.length === 0) {
      dispatch(getProducts({ nombre: "", tipo: "", token }));
      setPageNumber(1);
    }
  }, [dispatch, token, productos]);

  const handleSubmit = () => {
    dispatch(getProducts({ nombre, tipo, token }));
    setPageNumber(1);
  };

  const productsPaginated = paginate(productos, pageNumber, pageSize);

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center">Mis Productos</h2>
      <Loader loading={loadingProductos || loadingCategories} />
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrorsProductos())}
        dismissible
        show={errorsProducts.length > 0 && !loadingProductos}
      >
        {errorsProducts.join(". ")}
      </Alert>
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrorsCategorias())}
        dismissible
        show={errorsCategories.length > 0 && !loadingCategories}
      >
        {errorsCategories.join(". ")}
      </Alert>
      {!loadingProductos &&
        !loadingCategories &&
        errorsProducts.length === 0 &&
        errorsCategories.length === 0 &&
        (productos.length > 0 && categories.length > 0 ? (
          <>
            <Form
              className="d-flex row justify-content-center mb-4"
              onSubmit={() => handleSubmit()}
            >
              <Input
                containerStyle="d-flex col-5 justify-content-center align-items-center"
                name="nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombre(e.target.value)
                }
              />
              <InputSelect
                containerStyle="d-flex col-5 justify-content-center align-items-center"
                name="tipo"
                options={categories}
                optionDefault="Todas"
                optionDefaultIsNotDisabled
                value_id={tipo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTipo(e.target.value)
                }
              />
              <div className="d-flex col-1 justify-content-center align-items-center form-group">
                <Button type="submit" variant="info" className="w-100">
                  <FontAwesomeIcon icon="search" />
                </Button>
              </div>
            </Form>

            <Table responsive striped bordered hover variant="info">
              <thead className="thead-dark">
                <tr className="table-row text-center">
                  <th>Barcode</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {productsPaginated.map((p: Product) => (
                  <Producto key={p.id_producto} producto={p} />
                ))}
              </tbody>
            </Table>
            <Paginacion
              containerStyle="justify-content-center"
              currentPage={pageNumber}
              itemsCount={productos.length}
              pageSize={pageSize}
              onPageChange={(page: number) => setPageNumber(page)}
            />
          </>
        ) : (
          <div className="d-flex justify-content-center">
            <Card className="text-center py-5 mt-5 w-50">
              <h4>No tenés productos registrados</h4>
              <Link to="/producto">
                <Button className="mt-5" variant="info">
                  <FontAwesomeIcon icon="plus" /> Agregar Producto
                </Button>
              </Link>
            </Card>
          </div>
        ))}
    </Container>
  );
}
