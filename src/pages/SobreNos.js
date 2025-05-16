// src/pages/SobreNos.js
import React from "react";
import "../assets/styles/sobrenos.css";

const SobreNos = () => {
  return (
    <div className="sobrenos-container">
      <div className="sobrenos-content">
        <h1>Sobre o SkillUP</h1>
        <p>
          O <strong>SkillUP</strong> é uma plataforma online inovadora que liga alunos e instrutores com vontade de aprender e partilhar conhecimentos. Aqui, qualquer pessoa pode adquirir novas competências, impulsionar a sua carreira ou transformar a sua paixão numa fonte de rendimento.
        </p>
        <h2>Missão</h2>
        <p>
          Democratizar o acesso à educação de qualidade, oferecendo uma experiência de aprendizagem acessível, prática e moderna.
        </p>
        <h2>Visão</h2>
        <p>
          Ser uma referência no ensino online, capacitando pessoas a crescer através do conhecimento.
        </p>
        <h2>Como funciona?</h2>
        <ul>
          <li><strong>Alunos:</strong> exploram cursos, aprendem ao seu ritmo e desenvolvem novas competências.</li>
          <li><strong>Instrutores:</strong> criam conteúdos, partilham a sua experiência.</li>
        </ul>
        <h2>Junta-te a nós</h2>
        <p>
          Sejas aluno ou instrutor, o SkillUP é o espaço ideal para evoluíres, ensinares e te transformares. Começa hoje!
        </p>
      </div>
    </div>
  );
};

export default SobreNos;
