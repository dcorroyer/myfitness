import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Minus, Save, X } from 'lucide-react'

interface ShoppingItem {
  ingredient_id?: number
  name: string
  quantity: number
  unit: string
  is_manual: boolean
}

interface Props {
  initialIngredients?: ShoppingItem[]
}

export default function ShoppingListCreate({ initialIngredients = [], auth }: Props & { auth: { user: any } }) {
  const [items, setItems] = useState<ShoppingItem[]>(initialIngredients)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemUnit, setNewItemUnit] = useState('')

  const { data, setData, post, processing } = useForm({
    name: '',
    items: items,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/shopping-lists', {
      data: { ...data, items },
      onSuccess: () => router.get('/shopping-lists')
    })
  }

  const addManualItem = () => {
    if (newItemName.trim()) {
      const newItem: ShoppingItem = {
        name: newItemName.trim(),
        quantity: newItemQuantity,
        unit: newItemUnit || 'unité',
        is_manual: true,
      }
      
      setItems(prev => [...prev, newItem])
      setNewItemName('')
      setNewItemQuantity(1)
      setNewItemUnit('')
      setIsAddDialogOpen(false)
    }
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(0, quantity) } : item
    ))
  }

  const updateItemUnit = (index: number, unit: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, unit } : item
    ))
  }

  const totalItems = items.length

  return (
    <AppLayout user={auth.user}>
      <Head title="Créer une liste de courses" />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Créer une liste de courses</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la liste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la liste (optionnel)</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Liste de courses"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Articles ({totalItems})</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un article
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
                        <Button type="button" onClick={addManualItem}>
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Aucun article dans la liste
                  </p>
                  <Button
                    type="button"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter le premier article
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.is_manual && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Ajouté manuellement
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity - 0.5)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity + 0.5)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItemUnit(index, e.target.value)}
                        className="w-20"
                        placeholder="unité"
                      />
                      
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.get('/shopping-lists')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={processing || items.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Sauvegarde...' : 'Sauvegarder la liste'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}