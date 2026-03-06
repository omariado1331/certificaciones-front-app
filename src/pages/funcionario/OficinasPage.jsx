import React from "react";
import '../../styles/funcionario/OficinasPage.css'

const OficinasPage = () => {
    return(
        <div className="content-section">
            <h2>Oficinas Sereci</h2>
            <div className="oficinas-grid">
               <div className="oficina-card">
                <h3>Oficina Central</h3>
                <p><strong>Dirección:</strong> Av. Principal #123</p>
                <p><strong>Teléfono:</strong> (591) 2-1234567</p>
                <p><strong>Horario:</strong> 8:00 AM - 4:00 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
              <div className="oficina-card">
                <h3>Oficina Norte</h3>
                <p><strong>Dirección:</strong> Calle Secundaria #456</p>
                <p><strong>Teléfono:</strong> (591) 2-7654321</p>
                <p><strong>Horario:</strong> 9:00 AM - 5:00 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
              <div className="oficina-card">
                <h3>Oficina Sur</h3>
                <p><strong>Dirección:</strong> Av. del Sur #789</p>
                <p><strong>Teléfono:</strong> (591) 2-9876543</p>
                <p><strong>Horario:</strong> 8:30 AM - 4:30 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
            </div>
        </div>
    );
};

export default OficinasPage;
