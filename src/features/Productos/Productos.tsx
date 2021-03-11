import React, { useEffect, useState } from "react";
import Producto from "../../components/Producto";
import InputSelect from "../../components/select";
import Input from "../../components/input";
import {
  Alert,
  Button,
  Container,
  Form,
  Table,
  Card,
  Modal,
} from "react-bootstrap";
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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import InputMoney from "../../components/inputMoney";

interface FormData {
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}
const schema = yup.object().shape({
  nombre: yup.string().required("Nombre requerido."),
  tipo: yup.string().required("Categoría requerida."),
  precio: yup
    .number()
    .typeError("Precio inválido.")
    .required("Precio requerido.")
    .moreThan(0, "Precio inválido."),
  stock: yup
    .number()
    .typeError("Stock inválido.")
    .required("Stock requerido.")
    .moreThan(0, "Stock inválido."),
});

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

  const emptyProduct = {
    nombre: "",
    precio: 0,
    stock: 0,
    tipo: "",
  };

  const [modalState, setModalState] = useState(false);
  const [productToEdit, setProductToEdit] = useState<FormData>(emptyProduct);

  const {
    register,
    handleSubmit,
    errors,
    control,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(getCategorias({ token }));
    dispatch(getProducts({ nombre: "", tipo: "", token }));
    setPageNumber(1);
  }, [dispatch, token]);

  const filterProducts = () => {
    dispatch(getProducts({ nombre, tipo, token }));
    setPageNumber(1);
  };

  const handleModalClose = () => {
    setModalState(false);
    clearErrors();
    setProductToEdit(emptyProduct);
  };

  const handleEditProduct = (p: Product) => {
    const { nombre, categoria: tipo, precio, stock } = p;
    setProductToEdit({ nombre, tipo, precio, stock });
    setModalState(true);
  };

  const onSubmit = (data: FormData) => {
    clearErrors();
    console.log(data);
  };

  const productsPaginated = paginate(productos, pageNumber, pageSize);

  return (
    <Container className="py-5">
      <div className="d-flex row align-items-center justify-content-around mb-5">
        <div className="d-flex col-2"></div>
        <h2 className="d-flex col-8 justify-content-center align-items-center">
          Mis Productos
        </h2>
        <Button
          className="d-flex col-2 justify-content-center align-items-center"
          onClick={() => setModalState(true)}
        >
          <FontAwesomeIcon className="mr-2" icon="plus" /> Nuevo
        </Button>
      </div>
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
              onSubmit={() => filterProducts()}
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
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {productsPaginated.map((p: Product) => (
                  <Producto
                    onEdit={() => handleEditProduct(p)}
                    key={p.id_producto}
                    producto={p}
                  />
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
                <Button
                  className="mt-5"
                  variant="info"
                  onClick={() => setModalState(true)}
                >
                  <FontAwesomeIcon icon="plus" /> Agregar Producto
                </Button>
              </Link>
            </Card>
          </div>
        ))}
      <Modal centered show={modalState} onHide={() => handleModalClose()}>
        <Form
          className="justify-content-center mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {productToEdit.nombre !== ""
                ? "Editar Producto"
                : "Nuevo Producto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              containerStyle="align-items-center"
              name="nombre"
              label="Nombre"
              register={register}
              error={errors.nombre?.message || ""}
              value={productToEdit.nombre}
            />
            <Controller
              control={control}
              name="tipo"
              defaultValue={productToEdit.tipo}
              render={({ onChange, value, name, ref }) => (
                <InputSelect
                  containerStyle="align-items-center"
                  label="Categoría"
                  optionDefault="Elegir"
                  register={ref}
                  options={categories}
                  value_id={value}
                  name={name}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onChange(e.target.value)
                  }
                  error={errors.tipo?.message || ""}
                />
              )}
            />
            <Controller
              control={control}
              name="precio"
              defaultValue={productToEdit.precio}
              render={({ onChange, value, name, ref }) => (
                <InputMoney
                  containerStyle="align-items-center"
                  name={name}
                  label="Precio"
                  register={ref}
                  error={errors.precio?.message || ""}
                  value={value}
                  onChange={(value: number) => onChange(value)}
                />
              )}
            />
            <Input
              containerStyle="align-items-center"
              name="stock"
              label="Stock"
              type="text"
              register={register}
              error={errors.stock?.message || ""}
              value={productToEdit.stock}
            />
            <Modal.Footer className="justify-content-around">
              <Button
                type="button"
                variant="secondary"
                className="w-25"
                onClick={() => handleModalClose()}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="info" className="w-25">
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Form>
      </Modal>
    </Container>
  );
}
