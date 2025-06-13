import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Plus, Loader2 } from 'lucide-react'

interface Ingredient {
  id: number
  name: string
  unit: string
  category?: string
}

interface IngredientAutocompleteProps {
  onSelect: (ingredient: Ingredient) => void
  placeholder?: string
  className?: string
}

export default function IngredientAutocomplete({ 
  onSelect, 
  placeholder = "Rechercher un ingrédient...",
  className = ""
}: IngredientAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchIngredients = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)
    setShowDropdown(true)
    
    try {
      const response = await fetch(`/ingredients/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error searching ingredients:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.length >= 1) {
      // Debounce search by 300ms
      timeoutRef.current = setTimeout(() => {
        searchIngredients(query)
      }, 300)
    } else {
      setResults([])
      setShowDropdown(false)
      setIsLoading(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, searchIngredients])

  const handleSelectIngredient = (ingredient: Ingredient) => {
    onSelect(ingredient)
    setQuery('')
    setResults([])
    setShowDropdown(false)
  }

  const handleCreateNewIngredient = async () => {
    if (!query.trim() || isCreating) return

    setIsCreating(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      
      const response = await fetch('/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: query.trim(),
          unit: 'g',
          category: null
        })
      })

      if (response.ok) {
        const newIngredient = await response.json()
        handleSelectIngredient(newIngredient)
      } else {
        console.error('Failed to create ingredient:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Error creating ingredient:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length >= 1) {
              setShowDropdown(true)
            }
          }}
          onFocus={() => {
            if (query.length >= 1) {
              setShowDropdown(true)
            }
          }}
          className="pl-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>
      
      {showDropdown && query.length >= 1 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-gray-500">Recherche...</span>
            </div>
          ) : (
            <>
              {results.length > 0 && results.map(ingredient => (
                <button
                  key={ingredient.id}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center justify-between border-b"
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  <span className="font-medium">{ingredient.name}</span>
                  <Badge variant="secondary">{ingredient.unit}</Badge>
                </button>
              ))}
              
              {query.length >= 1 && !results.some(ingredient => 
                ingredient.name.toLowerCase() === query.toLowerCase()
              ) && (
                <div className="px-4 py-3 border-t">
                  {results.length > 0 && (
                    <p className="text-gray-500 text-xs mb-2">Ou créer un nouvel ingrédient :</p>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={handleCreateNewIngredient}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    <span>Créer "{query}"</span>
                    <Badge variant="secondary" className="ml-2">nouveau</Badge>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}