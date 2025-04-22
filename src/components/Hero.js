import React from "react";
import "../assets/styles/cursos.css"; // Certifique-se de que o caminho está correto

import landingpagehero from "../assets/img/landingpagehero.png";

function Hero() {
    return (
        <div className="hero">
            <div className="hero-image">
            <img src={landingpagehero}/>
                                    </div>
            <h1>Aprenda novas habilidades com SkillUP</h1>
            <div className="hero-buttons">
                <button className="btnhero btn-primary">Começar Agora</button>
                <button className="btnhero btn-primary">Saiba Mais</button>
            </div>
        </div>
    );
}

export default Hero;