import React from "react";
import "./Card.css";

const Card = () => {
  return (
    <div className="card-container">
      <div className="card-image">
        <img src="URL_DA_IMAGEM" alt="Supercarro Elétrico" />
      </div>
      <div className="card-content">
        <h2 className="card-title">SUPERCARRO ELÉTRICO LUXO</h2>
        <p className="card-description">
          Desempenho inacreditável. Design futurista. Sua nova realidade.
        </p>
        <div className="card-price">
          <span>R$ 899.000</span>
          <span className="price-type">à vista</span>
        </div>
        <div className="card-actions">
          <button className="btn-add-to-cart">ADICIONAR AO CARRINHO</button>
          <div className="icons">
            <span className="icon">❤️</span>
            <span className="icon">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
