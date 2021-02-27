import React, { useEffect, useState } from "react";
import Producto from "../../components/Producto";
import InputSelect from "../../components/select";
import Input from "../../components/input";
import { Alert, Button, Container, Form, Table, Card } from "react-bootstrap";
import { useReduxDispatch } from "../../app/store";
import {
  clearErrors,
  errorsSelector,
  getProducts,
  loadingSelector,
  productosAllSelector,
} from "./productosSlice";
import { getCategories, Product } from "../../actions/Productos";
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

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorsCategories, setErrorsCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const productos = useSelector(productosAllSelector);
  const loading = useSelector(loadingSelector);
  const errorsProducts: string[] = useSelector(errorsSelector);

  useEffect(() => {
    let unmounted = false;
    async function onMount() {
      try {
        if (!unmounted) {
          const categoriesResponse = await getCategories(token);
          if (categoriesResponse.Errors.length === 0) {
            const categorias: { _id: string; name: string }[] = [];
            categoriesResponse.Categorias.forEach((c) =>
              categorias.push({ _id: c.categoria, name: c.categoria })
            );
            setCategories(categorias);
          } else {
            setErrorsCategories(categoriesResponse.Errors);
          }
          setLoadingCategories(false);
        }
      } catch (ex) {
        if (!unmounted) {
          setErrorsCategories(["No se pudieron obtener las categorías."]);
          setLoadingCategories(false);
        }
      }
    }
    onMount();
    return () => {
      unmounted = true;
    };
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(getProducts({ nombre: "", tipo: "", token }));
    setPageNumber(1);
  }, [dispatch, token]);

  const handleSubmit = () => {
    dispatch(getProducts({ nombre, tipo, token }));
    setPageNumber(1);
  };

  const productsPaginated = paginate(productos, pageNumber, pageSize);

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center">Mis Productos</h2>
      <Loader loading={loading || loadingCategories} />
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrors())}
        dismissible
        show={errorsProducts.length > 0 && !loading}
      >
        {errorsProducts.join(". ")}
      </Alert>
      <Alert
        variant="danger"
        onClose={() => setErrorsCategories([])}
        dismissible
        show={errorsCategories.length > 0 && !loadingCategories}
      >
        {errorsCategories.join(". ")}
      </Alert>
      {!loading &&
        !loadingCategories &&
        errorsProducts.length === 0 &&
        errorsCategories.length === 0 &&
        (productos.length > 0 ? (
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
