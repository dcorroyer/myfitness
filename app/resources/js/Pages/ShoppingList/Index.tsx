import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ShoppingCart, CheckCircle, Calendar, Trash2 } from 'lucide-react'

interface ShoppingListItem {
  id: number
  name: string
  quantity: number
  unit: string
  is_checked: boolean
  is_manual: boolean
}

interface ShoppingList {
  id: number
  name: string
  is_completed: boolean
  created_at: string
  items: ShoppingListItem[]
}

interface Props {
  shoppingLists: ShoppingList[]
}

export default function ShoppingListIndex({ shoppingLists, auth }: Props & { auth: { user: any } }) {
  const deleteList = (listId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste de courses ?')) {
      router.delete(`/shopping-lists/${listId}`)
    }
  }

  const getProgress = (list: ShoppingList) => {
    if (list.items.length === 0) return 0
    const checkedItems = list.items.filter(item => item.is_checked).length
    return Math.round((checkedItems / list.items.length) * 100)
  }

  return (
    <AppLayout user={auth.user}>
      <Head title="Mes listes de courses" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mes listes de courses</h1>
          
          <Link href="/shopping-lists/create">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle liste
            </Button>
          </Link>
        </div>

        {shoppingLists.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune liste de courses
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre première liste de courses ou générez-en une depuis votre planning.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/shopping-lists/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une liste
                  </Button>
                </Link>
                <Link href="/planning">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Voir le planning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shoppingLists.map(list => {
              const progress = getProgress(list)
              const totalItems = list.items.length
              const checkedItems = list.items.filter(item => item.is_checked).length
              
              return (
                <Card key={list.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      {list.is_completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Terminée
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Créée le {new Date(list.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{checkedItems}/{totalItems} articles</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              list.is_completed ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress}% terminé
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div>Total: {totalItems} article{totalItems > 1 ? 's' : ''}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/shopping-lists/${list.id}`} className="flex-1">
                          <Button className="w-full">
                            Voir la liste
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteList(list.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-blue-900">
                  Astuce: Génération automatique
                </h3>
                <p className="text-sm text-blue-700">
                  Vous pouvez générer automatiquement une liste de courses à partir de votre planning. 
                  Allez dans votre planning et cliquez sur "Faire les courses".
                </p>
              </div>
              <div className="ml-auto">
                <Link href="/planning">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Voir le planning
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}