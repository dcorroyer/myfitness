import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, Users, ChefHat } from 'lucide-react'

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
  prep_time?: number
  cook_time?: number
  servings: number
  difficulty: string
  ingredients: Ingredient[]
}

interface Props {
  recipes: Recipe[]
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

export default function RecipesIndex({ recipes, auth }: Props & { auth: { user: any } }) {
  return (
    <AppLayout user={auth.user}>
      <Head title="Mes recettes" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mes recettes</h1>
          
          <Link href="/recipes/create">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle recette
            </Button>
          </Link>
        </div>

        {recipes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recette
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par créer votre première recette.
              </p>
              <Link href="/recipes/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une recette
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {getDifficultyLabel(recipe.difficulty)}
                    </Badge>
                  </div>
                  {recipe.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    {recipe.prep_time && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {recipe.prep_time}min
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {recipe.servings} pers.
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Ingrédients ({recipe.ingredients.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map(ingredient => (
                        <Badge key={ingredient.id} variant="secondary" className="text-xs">
                          {ingredient.name}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.ingredients.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/recipes/${recipe.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Voir
                      </Button>
                    </Link>
                    <Link href={`/recipes/${recipe.id}/edit`} className="flex-1">
                      <Button className="w-full">
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}