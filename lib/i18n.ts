/**
 * Utility function to get language from request
 * Defaults to 'uz' if not provided
 */
export function getLanguageFromRequest(request: Request): 'uz' | 'ru' {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || searchParams.get('language')
  
  if (lang === 'ru') {
    return 'ru'
  }
  
  return 'uz' // Default to uz
}

/**
 * Helper to map database fields based on language
 */
export function getFieldByLanguage<T extends Record<string, any>>(
  obj: T,
  fieldName: string,
  language: 'uz' | 'ru'
): string {
  const field = `${fieldName}${language === 'uz' ? 'Uz' : 'Ru'}` as keyof T
  return (obj[field] as string) || (obj[`${fieldName}Uz` as keyof T] as string) || ''
}
