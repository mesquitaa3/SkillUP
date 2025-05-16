import React from "react";

function CursosLanding() {
    const cursoslanding = [
        { id: 1, title: "Curso de React", description: "Aprenda a construir aplicações com React.", image: "curso-react.jpg" },
        { id: 2, title: "Curso de JavaScript", description: "Domine o JavaScript.", image: "curso-js.jpg" },
        { id: 3, title: "Curso de CSS", description: "Crie layouts incríveis com CSS.", image: "curso-css.jpg" },
    ];

    return (
        <div className="landing-cursos-section">
            <h2 className="landing-cursos-title">Cursos Populares</h2>
            <div className="landing-cursos-container">
                {cursoslanding.map((curso) => (
                    <div key={curso.id} className="landing-curso-card">
                        <img src={curso.image} alt={curso.title} className="landing-curso-image" />
                        <h3 className="landing-curso-title">{curso.title}</h3>
                        <p className="landing-curso-description">{curso.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CursosLanding;
