import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Plus, X, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface RecipeDetail {
  recipe_id: number
  recipe_name: string
  day_of_week: string
  meal_type: string
  servings: number
  quantity: number
  original_quantity: number
}

interface ShoppingListItem {
  id: number
  name: string
  quantity: number
  unit: string
  is_checked: boolean
  is_manual: boolean
  recipe_details?: RecipeDetail[]
  ingredient?: {
    id: number
    name: string
  }
}

interface ShoppingList {
  id: number
  name: string
  is_completed: boolean
  items: ShoppingListItem[]
}

interface Props {
  shoppingList: ShoppingList
}

export default function ShoppingListShow({ shoppingList, auth }: Props & { auth: { user: any } }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemUnit, setNewItemUnit] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [localShoppingList, setLocalShoppingList] = useState(shoppingList)

  const { post, delete: destroy, patch, processing } = useForm()

  const checkedItems = localShoppingList.items.filter(item => item.is_checked).length
  const totalItems = localShoppingList.items.length
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0

  const toggleItem = async (itemId: number) => {
    // Optimistic update
    setLocalShoppingList(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
      )
    }))

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      
      const response = await fetch(`/shopping-lists/items/${itemId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setLocalShoppingList(prev => ({
          ...prev,
          items: prev.items.map(item => 
            item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
          )
        }))
        console.error('Failed to toggle item')
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalShoppingList(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
        )
      }))
      console.error('Error toggling item:', error)
    }
  }

  const removeItem = async (itemId: number) => {
    // Optimistic update
    setLocalShoppingList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      
      const response = await fetch(`/shopping-lists/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        // On error, reload the page to get fresh data
        window.location.reload()
      }
    } catch (error) {
      // On error, reload the page to get fresh data
      window.location.reload()
    }
  }

  const addItem = () => {
    if (newItemName.trim()) {
      post(`/shopping-lists/${shoppingList.id}/items`, {
        data: {
          name: newItemName.trim(),
          quantity: newItemQuantity,
          unit: newItemUnit || 'unité',
          is_manual: true,
        },
        onSuccess: () => {
          setNewItemName('')
          setNewItemQuantity(1)
          setNewItemUnit('')
          setIsAddDialogOpen(false)
        }
      })
    }
  }

  const completeList = () => {
    patch(`/shopping-lists/${shoppingList.id}/complete`)
  }

  const deleteList = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste de courses ?')) {
      destroy(`/shopping-lists/${shoppingList.id}`)
    }
  }

  const toggleItemExpansion = (itemId: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'dejeuner': return 'Déjeuner'
      case 'diner': return 'Dîner'
      default: return mealType
    }
  }

  const getDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <AppLayout user={auth.user}>
      <Head title={shoppingList.name} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.get('/shopping-lists')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{shoppingList.name}</h1>
            </div>
            
            {localShoppingList.is_completed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Terminée
              </Badge>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {checkedItems} sur {totalItems} articles cochés ({Math.round(progress)}%)
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles de la liste</CardTitle>
              
              <div className="flex gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un article</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="item-name">Nom de l'article</Label>
                        <Input
                          id="item-name"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Ex: Pain de mie, Lait..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="item-quantity">Quantité</Label>
                          <Input
                            id="item-quantity"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="item-unit">Unité</Label>
                          <Input
                            id="item-unit"
                            value={newItemUnit}
                            onChange={(e) => setNewItemUnit(e.target.value)}
                            placeholder="unité, kg, L..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button type="button" onClick={addItem} disabled={processing}>
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {!localShoppingList.is_completed && checkedItems === totalItems && totalItems > 0 && (
                  <Button onClick={completeList} disabled={processing}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Terminer les courses
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {localShoppingList.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Aucun article dans cette liste
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter le premier article
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {localShoppingList.items.map((item) => {
                  const isExpanded = expandedItems.has(item.id)
                  const hasRecipes = item.recipe_details && item.recipe_details.length > 0
                  
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg transition-all ${
                        item.is_checked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4 p-4">
                        <Checkbox
                          checked={item.is_checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          disabled={processing}
                        />
                        
                        <div className={`flex-1 ${item.is_checked ? 'line-through text-gray-500' : ''}`}>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </div>
                          {hasRecipes && (
                            <div className="text-xs text-blue-600 mt-1">
                              Utilisé dans {item.recipe_details.length} recette{item.recipe_details.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {hasRecipes && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleItemExpansion(item.id)}
                              className="text-blue-600"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          
                          {item.is_manual && (
                            <Badge variant="secondary" className="text-xs">
                              Manuel
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            disabled={processing}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {isExpanded && hasRecipes && (
                        <div className="border-t bg-gray-50 p-4">
                          <h4 className="font-medium text-sm mb-3">Détails par recette :</h4>
                          <div className="space-y-2">
                            {item.recipe_details.map((recipe, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                  <span className="font-medium">{recipe.recipe_name}</span>
                                  <span className="text-gray-500 ml-2">
                                    ({getDayLabel(recipe.day_of_week)} - {getMealTypeLabel(recipe.meal_type)})
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div>{recipe.quantity} {item.unit}</div>
                                  <div className="text-xs text-gray-500">
                                    {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            variant="destructive"
            onClick={deleteList}
            disabled={processing}
          >
            Supprimer la liste
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.get('/shopping-lists')}
          >
            Retour aux listes
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}