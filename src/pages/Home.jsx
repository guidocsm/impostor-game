import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import '../css/pages/home.css'
import { QuestionIcon, GroupIcon, GroupAddIcon } from "../../public/icons/Icons";
import Modal from "../components/ui/Modal";
import { useState } from "react";
import { Intructions } from "../components/game/Intructions";

export default function Home() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="home">
      <p className="home-description-game">El juego de deducción social donde alguien miente</p>
      <section className="home-btn">
        <Button
          text="Crear una sala"
          type="main"
          icon={<GroupIcon width={20} height={20} />}
          onClick={() => navigate('/crear-partida')}
        />
        <Button
          text="Unirse a una sala"
          type="main-hover"
          icon={<GroupAddIcon width={20} height={20} fill="#E61919" />}
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
    </div>
  )
}