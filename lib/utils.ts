// Utility functions for SQLite compatibility (JSON string conversion)

export function parseJsonArray<T>(value: string | T[]): T[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return []
    }
  }
  return []
}

export function stringifyJsonArray(value: any[] | string): string {
  if (typeof value === 'string') return value
  return JSON.stringify(value || [])
}
