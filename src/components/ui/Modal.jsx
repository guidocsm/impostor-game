import React, { useEffect } from "react";

/**
 * Modal Component (sin librerías externas)
 * Props:
 * - isOpen (boolean): controla la visibilidad
 * - onClose (function): función para cerrar
 * - children (ReactNode): contenido interno
 * - closeOnOverlayClick (boolean): si true (por defecto) permite cerrar al clicar fuera
 */
export default function Modal({ isOpen, onClose, children, closeOnOverlayClick = true }) {
  // Bloquear scroll del body cuando la modal está abierta
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Solo cerrar si el clic fue directamente en el overlay (no en el contenido)
    if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/** ESTILOS INLINE PARA EVITAR DEPENDENCIAS (puedes moverlos a un CSS) */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  animation: "fadeIn .18s ease-out",
  padding: 30,
};

const contentStyle = {
  backgroundColor: '#1A1A1A',
  borderRadius: "16px",
  padding: "24px",
  maxWidth: "600px",
  width: "90%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  animation: "scaleIn .18s ease-out",
  maxHeight: 500,
  overflow: 'auto'
};
