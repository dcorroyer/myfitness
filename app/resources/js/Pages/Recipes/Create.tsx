import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, X } from 'lucide-react'
import IngredientAutocomplete from '@/components/IngredientAutocomplete'

interface Ingredient {
  id: number
  name: string
  unit: string
  category?: string
}

interface RecipeIngredient {
  id: number
  name: string
  quantity: number
  unit: string
}

interface Props {
  ingredients: Ingredient[]
}

export default function RecipeCreate({ ingredients, auth }: Props & { auth: { user: any } }) {
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([])
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [ingredientQuantity, setIngredientQuantity] = useState(1)
  const [ingredientUnit, setIngredientUnit] = useState('')

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    instructions: '',
    prep_time: '',
    cook_time: '',
    servings: 1,
    difficulty: 'easy',
    ingredients: [] as { id: number; quantity: number; unit: string }[],
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      ...data,
      ingredients: recipeIngredients.map(ing => ({
        id: ing.id,
        quantity: ing.quantity,
        unit: ing.unit
      }))
    }
    post('/recipes', formData)
  }

  const addIngredient = () => {
    if (selectedIngredient) {
      const newIngredient: RecipeIngredient = {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: ingredientQuantity,
        unit: ingredientUnit || selectedIngredient.unit
      }
      
      setRecipeIngredients(prev => [...prev, newIngredient])
      setSelectedIngredient(null)
      setIngredientQuantity(1)
      setIngredientUnit('')
      setIsIngredientDialogOpen(false)
    }
  }

  const removeIngredient = (index: number) => {
    setRecipeIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setIngredientUnit(ingredient.unit)
  }

  return (
    <AppLayout user={auth.user}>
      <Head title="Nouvelle recette" />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Créer une nouvelle recette</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la recette *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Décrivez votre recette..."
                />
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
                </div>
                
                <div>
                  <Label htmlFor="servings">Nombre de portions *</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={data.servings}
                    onChange={(e) => setData('servings', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulté</Label>
                <Select value={data.difficulty} onValueChange={(value) => setData('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Facile</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="hard">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ingrédients</CardTitle>
                <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un ingrédient
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un ingrédient</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Rechercher un ingrédient</Label>
                        <IngredientAutocomplete
                          onSelect={handleIngredientSelect}
                          placeholder="Tapez le nom de l'ingrédient..."
                        />
                      </div>
                      
                      {selectedIngredient && (
                        <>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium">{selectedIngredient.name}</p>
                            <p className="text-sm text-gray-600">Unité par défaut: {selectedIngredient.unit}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="quantity">Quantité</Label>
                              <Input
                                id="quantity"
                                type="number"
                                min="0"
                                step="0.1"
                                value={ingredientQuantity}
                                onChange={(e) => setIngredientQuantity(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="unit">Unité</Label>
                              <Input
                                id="unit"
                                value={ingredientUnit}
                                onChange={(e) => setIngredientUnit(e.target.value)}
                                placeholder={selectedIngredient.unit}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSelectedIngredient(null)
                                setIngredientQuantity(1)
                                setIngredientUnit('')
                              }}
                            >
                              Annuler
                            </Button>
                            <Button type="button" onClick={addIngredient}>
                              Ajouter
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {recipeIngredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun ingrédient ajouté. Cliquez sur "Ajouter un ingrédient" pour commencer.
                </p>
              ) : (
                <div className="space-y-2">
                  {recipeIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-600 ml-2">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {errors.ingredients && <p className="text-red-500 text-sm mt-2">{errors.ingredients}</p>}
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
                className={errors.instructions ? 'border-red-500' : ''}
              />
              {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.get('/recipes')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Création...' : 'Créer la recette'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}