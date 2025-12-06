export function CategoryCard({ category = {}, currentCategory, setCategory }) {
  return (
    <div
      className={`new-game-box-categories-item ${category.id === currentCategory ? 'selected-category' : ''}`}
      onClick={() => setCategory(category.id)}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </div>
  )
}