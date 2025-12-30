import { Button } from "../../ui/Button";

export function JoinRoomForm({ onChangeCode, onChangeName, setRoomError, navigateToRoom }) {
  return (
    <>
      <form className="join-room-form">
        <div className="form-container">
          <label htmlFor="">Código de sala</label>
          <input
            type="text"
            placeholder="Ingresa el código"
            onChange={({ target }) => onChangeCode(target.value)}
            onFocus={() => setRoomError('')}
          />
        </div>
        <div className="form-container">
          <label htmlFor="">Tu nombre</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            onChange={({ target }) => onChangeName(target.value)}
            onFocus={() => setRoomError('')}
          />
        </div>
      </form>
      <div className="join-room-cta">
        <Button
          text="Unirme ahora"
          onClick={navigateToRoom}
        />
      </div>
    </>
  )
}