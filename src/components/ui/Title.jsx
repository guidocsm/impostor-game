import '../../css/components/ui/title.css'

export function Title({ text = '' }) {
  return (
    <h1 className="page-title">{text}</h1>
  )
}