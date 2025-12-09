import { Button } from "../../ui/Button";

export function JoinRoomForm({ roomError, onChangeCode, onChangeName, setRoomError, navigateToRoom }) {
  return (
    <>
      <form className="join-room-form">
        <div className="form-container">
          <label htmlFor="">Código de sala</label>
          <input
            type="text"
            onChange={({ target }) => onChangeCode(target.value)}
            onFocus={() => setRoomError('')}
          />
        </div>
        <div className="form-container">
          <label htmlFor="">Tu nombre</label>
          <input
            type="text"
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
      <p className="room-error">{roomError}</p>
    </>
  )
}