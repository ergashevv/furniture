'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
      >
        Oldingi
      </button>
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-primary/20 text-primary hover:bg-primary/5'
              }`}
            >
              {page}
            </button>
          )
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return <span key={page} className="text-text-light">...</span>
        }
        return null
      })}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
      >
        Keyingi
      </button>
    </div>
  )
}
