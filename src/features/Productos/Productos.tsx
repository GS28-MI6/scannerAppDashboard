import React, { useEffect, useState } from "react";
import Producto from "../../components/Producto";
import InputSelect from "../../components/select";
import Input from "../../components/input";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
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

export default function Productos() {
  const dispatch = useReduxDispatch();

  const token = useSelector(tokenSelector);

  const pageSize = 10;

  const [pageNumber, setPageNumber] = useState(1);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(false);
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
          setLoadingCategories(true);
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
  };

  const productsPaginated = paginate(productos, pageNumber, pageSize);

  return (
    <Container className="py-5">
      <h2 className="mb-3">Filtrado de Productos</h2>
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
        errorsCategories.length === 0 && (
          <>
            <Form
              className="d-flex row justify-content-center"
              onSubmit={() => handleSubmit()}
            >
              <Input
                containerStyle="d-flex col justify-content-center align-items-center"
                name="nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombre(e.target.value)
                }
              />
              <InputSelect
                containerStyle="d-flex col justify-content-center align-items-center"
                name="tipo"
                options={categories}
                optionDefault="Todas"
                optionDefaultIsNotDisabled
                value_id={tipo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTipo(e.target.value)
                }
              />
              <div className="d-flex col justify-content-center align-items-center form-group">
                <Button type="submit" variant="info" className="w-100">
                  Filtrar
                </Button>
              </div>
            </Form>

            <Table striped bordered hover>
              <thead>
                <tr className="table-row initial">
                  <th className="N">Barcode</th>
                  <th className="XG">Nombre</th>
                  <th className="S">Precio</th>
                  <th className="S">Stock</th>
                  <th className="N">Categoria</th>
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
        )}
    </Container>
  );
}
