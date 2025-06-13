import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, ChefHat, Edit, Trash2 } from 'lucide-react'

interface Ingredient {
  id: number
  name: string
  pivot: {
    quantity: number
    unit: string
  }
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
  ingredients: Ingredient[]
}

interface Props {
  recipe: Recipe
  auth: {
    user: any
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'hard': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'Facile'
    case 'medium': return 'Moyen'
    case 'hard': return 'Difficile'
    default: return difficulty
  }
}

export default function RecipeShow({ recipe, auth }: Props) {
  const deleteRecipe = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      router.delete(`/recipes/${recipe.id}`)
    }
  }

  return (
    <AppLayout user={auth.user}>
      <Head title={recipe.name} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/recipes" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux recettes
          </Link>
        </div>

        <div className="space-y-6">
          {/* En-tête de la recette */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                  {recipe.description && (
                    <p className="text-gray-600 mt-2">{recipe.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/recipes/${recipe.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={deleteRecipe}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
                </div>
                {recipe.prep_time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Préparation: {recipe.prep_time} min
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ChefHat className="mr-2 h-4 w-4" />
                    Cuisson: {recipe.cook_time} min
                  </div>
                )}
                <Badge className={getDifficultyColor(recipe.difficulty)}>
                  {getDifficultyLabel(recipe.difficulty)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ingrédients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingrédients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-gray-600">
                      {ingredient.pivot.quantity} {ingredient.pivot.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {recipe.instructions.split('\n').map((step, index) => (
                  <p key={index} className="mb-3">
                    {step}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}