import React from "react";
import "../assets/styles/cursos.css";
import { Link } from "react-router-dom";

import landingpagehero from "../assets/img/landingpagehero.png";

function Hero() {
    return (
        <div className="hero">
            <div className="hero-image">
            <img src={landingpagehero}/>
                                    </div>
            <h1>Aprenda novas habilidades com SkillUP</h1>
            <div className="hero-buttons">
                <Link to="/CriarConta" className="btnhero btn-primary">Começar Agora</Link> 
                <button className="btnhero btn-primary">Saiba Mais</button>
            </div>
        </div>
    );
}

export default Hero;