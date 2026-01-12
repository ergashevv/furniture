'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CurrencyContextType {
  currencyRate: number
  convertToUZS: (usd: number) => number
  formatUZS: (usd: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_RATE = 13000

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyRate, setCurrencyRate] = useState<number>(DEFAULT_RATE)

  useEffect(() => {
    async function fetchCurrencyRate() {
      try {
        const response = await fetch('/api/settings?key=currencyRate')
        const data = await response.json()
        if (data.success && data.setting) {
          const rate = parseFloat(data.setting.value)
          if (!isNaN(rate) && rate > 0) {
            setCurrencyRate(rate)
          }
        }
      } catch (error) {
        console.error('Error fetching currency rate:', error)
        // Use default rate on error
        setCurrencyRate(DEFAULT_RATE)
      }
    }

    fetchCurrencyRate()
  }, [])

  const convertToUZS = (usd: number): number => {
    return usd * currencyRate
  }

  const formatUZS = (usd: number): string => {
    return convertToUZS(usd).toLocaleString()
  }

  return (
    <CurrencyContext.Provider value={{ currencyRate, convertToUZS, formatUZS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
