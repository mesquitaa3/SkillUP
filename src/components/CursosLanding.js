import React from "react";

function CursosLanding() {
    const cursoslanding = [
        { id: 1, title: "Curso de React", description: "Aprenda a construir aplicações com React.", image: "curso-react.jpg" },
        { id: 2, title: "Curso de JavaScript", description: "Domine o JavaScript moderno.", image: "curso-js.jpg" },
        { id: 3, title: "Curso de CSS", description: "Crie layouts incríveis com CSS.", image: "curso-css.jpg" },
    ];

    return (
        <div className="cursos-section-landing">
            <h2 className="cursos-title-landing">Cursos</h2>
            <div className="cursos-container-landing">
                {cursoslanding.map((curso) => (
                    <div key={curso.id} className="curso-card">
                        <img src={curso.image} alt={curso.title} />
                        <h3>{curso.title}</h3>
                        <p>{curso.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CursosLanding;
