import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import '../css/pages/home.css'
import { QuestionIcon } from "../../public/icons/Icons";
import Modal from "../components/ui/Modal";
import { useState } from "react";
import { Intructions } from "../components/game/Intructions";

export default function Home() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <section className="home-btn">
        <Button
          text="Crear una sala"
          type="main"
          onClick={() => navigate('/crear-partida')}
        />
        <Button
          text="Unirme a una sala"
          type="main-hover"
          onClick={() => navigate('/unirse')}
        />
      </section>
      <div onClick={() => setIsOpen(true)} className="instructions">
        <QuestionIcon />
        <span>Instrucciones</span>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Intructions setIsOpen={setIsOpen} />
      </Modal>
    </>
  )
}