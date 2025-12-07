import { CATEGORIES } from "../../utils/constants";

export function CategoryCard({ category = {}, currentCategory, setCategory }) {
  return (
    <div
      className={`new-game-box-categories-item ${category?.id === currentCategory?.id ? 'selected-category' : ''}`}
      onClick={() => setCategory(category)}
    >
      <span>{CATEGORIES[category.name]?.icon}</span>
      <span>{CATEGORIES[category.name]?.value}</span>
    </div>
  )
}