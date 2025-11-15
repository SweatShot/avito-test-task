import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts"
import "./Pagination.css"

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  onPrev: () => void
  onNext: () => void
  setPage: (page: number) => void 
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  onPrev,
  onNext,
  setPage,
}: PaginationProps) {
  useKeyboardShortcuts({
    approve: () => {},
    reject: () => {},
    next: () => {
      if (page < totalPages) onNext()
    },
    prev: () => {
      if (page > 1) onPrev()
    },
    focusSearch: () => {
      const input = document.querySelector<HTMLInputElement>(
        'input[placeholder*="Поиск"]',
      )
      if (input) {
        input.focus()
        setPage(1) 
      }
    },
  })

  return (
    <div className="pagination-panel">
      <button className="nav-btn" disabled={page === 1} onClick={onPrev}>
        Назад
      </button>

      <span className="pagination-info">
        Страница {page} из {totalPages} (Всего: {totalItems})
      </span>

      <button
        className="nav-btn"
        disabled={page === totalPages}
        onClick={onNext}
      >
        Вперед
      </button>
    </div>
  )
}
