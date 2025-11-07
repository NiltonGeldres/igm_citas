import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FloatingLabel} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";
import FacturacionList from "./FacturacionList";

const Facturacion = () => {
    
 return (
    <>
        <FacturacionList></FacturacionList>
    </>
 );
 }
export default Facturacion;


/*import React, { useState } from 'react';

const Facturacion = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Producto 1',
      price: 50.0,
      details: {
        brand: 'Marca 1',
        model: 'Modelo 1',
        serial: 'S123456',
        manufactureDate: '01/01/2022',
      },
    },
    {
      id: 2,
      name: 'Producto 2',
      price: 75.0,
      details: {
        brand: 'Marca 2',
        model: 'Modelo 2',
        serial: 'S789012',
        manufactureDate: '02/01/2022',
      },
    },
    // Agrega más productos según sea necesario
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowDetails = (productId) => {
    const selected = products.find((product) => product.id === productId);
    setSelectedProduct(selected);
  };

  const handleHideDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{`${product.name} - $${product.price}`}</span>
            <button onClick={() => handleShowDetails(product.id)}>Ver Más</button>
            {selectedProduct && selectedProduct.id === product.id && (
              <div>
                <p>Marca: {selectedProduct.details.brand}</p>
                <p>Modelo: {selectedProduct.details.model}</p>
                <p>Serie: {selectedProduct.details.serial}</p>
                <p>Fecha de Fabricación: {selectedProduct.details.manufactureDate}</p>
                <button onClick={handleHideDetails}>Ocultar Detalles</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facturacion;
*/
