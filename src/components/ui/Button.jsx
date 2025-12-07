import '../../css/components/ui/button.css'

export function Button({
  text = '',
  type = 'main',
  disabled = false,
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
    >
      {text}
    </button>
  )
}