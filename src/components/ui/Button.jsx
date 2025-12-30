import '../../css/components/ui/button.css'

export function Button({
  text = '',
  type = 'main',
  disabled = false,
  maxWidth = 220,
  icon = null,
  onClick
}) {
  const btnClassByType = {
    'main': 'main-btn',
    'main-hover': 'main-hover-btn',
    'disabled-hover': 'disabled-hover-btn'
  }

  return (
    <button
      className={`btn ${btnClassByType[type] ?? ''} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
      style={{ maxWidth }}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {text}
    </button>
  )
}
