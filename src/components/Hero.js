import React from "react";
import "../assets/styles/cursos.css"; // Certifique-se de que o caminho está correto

import skillup from "../assets/img/skillup.png";

function Hero() {
    return (
        <div className="hero">
            <div className="hero-image">
            <img src={skillup}/>
                                    </div>
            <h1>Aprenda novas habilidades com SkillUP</h1>
            <div className="hero-buttons">
                <button className="btn btn-primary">Começar Agora</button>
                <button className="btn btn-outline">Saiba Mais</button>
            </div>
        </div>
    );
}

export default Hero;