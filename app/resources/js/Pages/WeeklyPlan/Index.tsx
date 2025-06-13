import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, ShoppingCart } from 'lucide-react'

interface Recipe {
  id: number
  name: string
  description?: string
  servings: number
}

interface WeeklyPlan {
  id: number
  day_of_week: string
  meal_type: string
  recipe: Recipe
  servings: number
}

interface Props {
  plans: WeeklyPlan[]
  recipes: Recipe[]
}

const MEAL_TYPES = [
  { value: 'dejeuner', label: 'Déjeuner' },
  { value: 'diner', label: 'Dîner' }
]

const DAYS_FR = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export default function WeeklyPlanIndex({ plans, recipes, auth }: Props & { auth: { user: any } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMealType, setSelectedMealType] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const { data, setData, post, processing } = useForm({
    day_of_week: '',
    meal_type: '',
    recipe_id: '',
    servings: 1,
  })

  const handleAddMeal = (dayOfWeek: string, mealType: string) => {
    setSelectedDay(dayOfWeek)
    setSelectedMealType(mealType)
    setData(prev => ({
      ...prev,
      day_of_week: dayOfWeek,
      meal_type: mealType,
    }))
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/planning', {
      onSuccess: () => {
        setIsDialogOpen(false)
        setData(prev => ({ ...prev, recipe_id: '', servings: 1 }))
      }
    })
  }

  const getPlanForDayAndMeal = (dayOfWeek: string, mealType: string) => {
    return plans.find(plan => plan.day_of_week === dayOfWeek && plan.meal_type === mealType)
  }

  const deletePlan = (planId: number) => {
    router.delete(`/planning/${planId}`)
  }

  const resetPlanning = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le planning ?')) {
      router.post('/planning/reset')
    }
  }

  const generateShoppingList = () => {
    if (plans.length === 0) {
      alert('Aucun repas planifié ! Ajoutez des recettes à votre planning avant de générer une liste de courses.')
      return
    }

    setIsGenerating(true)
    router.post('/planning/generate-shopping-list', {}, {
      onSuccess: (page) => {
        // Inertia retourne directement la page, pas besoin de redirection
        setIsGenerating(false)
      },
      onError: (errors) => {
        console.error('Erreur lors de la génération:', errors)
        setIsGenerating(false)
      },
      onFinish: () => setIsGenerating(false)
    })
  }

  return (
    <AppLayout user={auth.user}>
      <Head title="Mon planning" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mon planning</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetPlanning}>
              Réinitialiser
            </Button>
            <Button 
              onClick={generateShoppingList} 
              disabled={isGenerating}
              className="flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isGenerating ? 'Génération...' : 'Faire les courses'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {DAYS_FR.map((dayName, dayIndex) => (
            <Card key={dayName} className="min-h-96">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-sm">
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {MEAL_TYPES.map(mealType => {
                  const plan = getPlanForDayAndMeal(dayName, mealType.value)
                  
                  return (
                    <div key={mealType.value} className="p-2 border rounded-lg">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {mealType.label}
                      </div>
                      
                      {plan ? (
                        <div className="group relative">
                          <div className="text-sm font-medium">{plan.recipe.name}</div>
                          <div className="text-xs text-gray-500">
                            {plan.servings} portion{plan.servings > 1 ? 's' : ''}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-6 w-6 p-0"
                            onClick={() => deletePlan(plan.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full h-8 border-dashed border"
                          onClick={() => handleAddMeal(dayName, mealType.value)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un repas</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="recipe">Recette</Label>
              <Select value={data.recipe_id} onValueChange={(value) => setData('recipe_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une recette" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id.toString()}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="servings">Nombre de portions</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={data.servings}
                onChange={(e) => setData('servings', parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={processing || !data.recipe_id}>
                Ajouter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}