import { useState, useEffect, FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import IngredientAutocomplete from '@/components/IngredientAutocomplete'

interface Ingredient {
  id: number
  name: string
  unit?: string
  category?: string
}

interface RecipeIngredient {
  id: number
  name: string
  quantity: number
  unit: string
}

interface Recipe {
  id: number
  name: string
  description?: string
  instructions: string
  prep_time?: number
  cook_time?: number
  servings: number
  difficulty: string
  ingredients: Array<{
    id: number
    name: string
    pivot: {
      quantity: number
      unit: string
    }
  }>
}

interface Props {
  recipe: Recipe
  ingredients: Ingredient[]
  auth: {
    user: any
  }
}

export default function RecipeEdit({ recipe, ingredients, auth }: Props) {
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    recipe.ingredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.pivot.quantity,
      unit: ingredient.pivot.unit
    }))
  )
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [ingredientQuantity, setIngredientQuantity] = useState(1)
  const [ingredientUnit, setIngredientUnit] = useState('')

  const { data, setData, put, processing, errors } = useForm({
    name: recipe.name,
    description: recipe.description || '',
    instructions: recipe.instructions,
    prep_time: recipe.prep_time || '',
    cook_time: recipe.cook_time || '',
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    ingredients: recipeIngredients.map(ingredient => ({
      id: ingredient.id,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    }))
  })

  useEffect(() => {
    setData('ingredients', recipeIngredients.map(ingredient => ({
      id: ingredient.id,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    })))
  }, [recipeIngredients])


  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    put(`/recipes/${recipe.id}`)
  }

  const handleIngredientSelect = (ingredient: Ingredient) => {
    // Check if ingredient is already in the recipe
    if (recipeIngredients.some(ri => ri.id === ingredient.id)) {
      return
    }
    setSelectedIngredient(ingredient)
    setIngredientUnit(ingredient.unit || '')
    setIsIngredientDialogOpen(true)
  }

  const confirmAddIngredient = () => {
    if (selectedIngredient) {
      const newIngredient: RecipeIngredient = {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: ingredientQuantity,
        unit: ingredientUnit
      }
      
      setRecipeIngredients(prev => [...prev, newIngredient])
      setIsIngredientDialogOpen(false)
      setSelectedIngredient(null)
      setIngredientQuantity(1)
      setIngredientUnit('')
    }
  }

  const removeIngredient = (ingredientId: number) => {
    setRecipeIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId))
  }

  const updateIngredientQuantity = (ingredientId: number, quantity: number) => {
    setRecipeIngredients(prev => prev.map(ingredient =>
      ingredient.id === ingredientId ? { ...ingredient, quantity } : ingredient
    ))
  }

  const updateIngredientUnit = (ingredientId: number, unit: string) => {
    setRecipeIngredients(prev => prev.map(ingredient =>
      ingredient.id === ingredientId ? { ...ingredient, unit } : ingredient
    ))
  }

  return (
    <AppLayout user={auth.user}>
      <Head title={`Modifier ${recipe.name}`} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/recipes/${recipe.id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la recette
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modifier la recette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la recette</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
              </div>

              <div>
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Décrivez votre recette..."
                />
                {errors.description && <div className="text-sm text-red-600 mt-1">{errors.description}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prep_time">Temps de préparation (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    min="0"
                    value={data.prep_time}
                    onChange={(e) => setData('prep_time', e.target.value)}
                  />
                  {errors.prep_time && <div className="text-sm text-red-600 mt-1">{errors.prep_time}</div>}
                </div>

                <div>
                  <Label htmlFor="cook_time">Temps de cuisson (min)</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    min="0"
                    value={data.cook_time}
                    onChange={(e) => setData('cook_time', e.target.value)}
                  />
                  {errors.cook_time && <div className="text-sm text-red-600 mt-1">{errors.cook_time}</div>}
                </div>

                <div>
                  <Label htmlFor="servings">Nombre de portions</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={data.servings}
                    onChange={(e) => setData('servings', parseInt(e.target.value) || 1)}
                    required
                  />
                  {errors.servings && <div className="text-sm text-red-600 mt-1">{errors.servings}</div>}
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulté</Label>
                <Select value={data.difficulty} onValueChange={(value) => setData('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Facile</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="hard">Difficile</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && <div className="text-sm text-red-600 mt-1">{errors.difficulty}</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ingrédients ({recipeIngredients.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rechercher un ingrédient</Label>
                <IngredientAutocomplete
                  onSelect={handleIngredientSelect}
                  placeholder="Tapez pour rechercher..."
                />
              </div>

              {recipeIngredients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucun ingrédient ajouté</p>
                  <p className="text-sm text-gray-400">Recherchez et ajoutez des ingrédients ci-dessus</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recipeIngredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{ingredient.name}</div>
                      </div>
                      
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredientQuantity(ingredient.id, parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      
                      <Input
                        value={ingredient.unit}
                        onChange={(e) => updateIngredientUnit(ingredient.id, e.target.value)}
                        placeholder="unité"
                        className="w-20"
                      />
                      
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {errors.ingredients && <div className="text-sm text-red-600">{errors.ingredients}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={data.instructions}
                onChange={(e) => setData('instructions', e.target.value)}
                placeholder="Décrivez les étapes de préparation..."
                rows={8}
                required
              />
              {errors.instructions && <div className="text-sm text-red-600 mt-1">{errors.instructions}</div>}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href={`/recipes/${recipe.id}`}>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter {selectedIngredient?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ingredient-quantity">Quantité</Label>
              <Input
                id="ingredient-quantity"
                type="number"
                min="0"
                step="0.1"
                value={ingredientQuantity}
                onChange={(e) => setIngredientQuantity(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="ingredient-unit">Unité</Label>
              <Input
                id="ingredient-unit"
                value={ingredientUnit}
                onChange={(e) => setIngredientUnit(e.target.value)}
                placeholder="kg, g, mL, pièce..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsIngredientDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="button" onClick={confirmAddIngredient}>
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}