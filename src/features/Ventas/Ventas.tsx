import React, { useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CartItem from "../../components/CartItem"
import { cartSelector, getProduct, totalSelector, errorsSelector } from "./ventasSlice";
import Input from "../../components/input";

library.add(fas, fab);

export default function Ventas() {
    const dispatch = useDispatch();
    const history = useHistory();
    const stateCart = useSelector(cartSelector);
    const stateTotal = useSelector(totalSelector);
    const stateErrors = useSelector(errorsSelector)

    const handleSubmit = async (formData: FormData) => {
        console.log(formData)
        // dispatch(getProduct(data));
        // if(stateErrors.length === 0){
        //   history.replace({pathname: "/login"});
        // }
      };

    return (
        <Container className="d-flex justify-content-center pt-5">
            <Form onSubmit={handleSubmit} className="w-100">
                <Input
                    label="Barcode"
                    name="barcode"
                    containerStyle="mb-4"
                    type="text"
                />
                <div className="text-center mb-4">
                    <Button
                    type="submit"
                    value="iniciar sesión"
                    variant="outline-primary"
                    className="w-50"
                    >
                    Registrarse
                    </Button>
                </div>
            </Form>
        </Container>
    );
}