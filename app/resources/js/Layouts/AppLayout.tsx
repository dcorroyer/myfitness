import { Link, router } from '@inertiajs/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, ChefHat, ShoppingCart, UtensilsCrossed, LogOut, User } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
  }
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 flex items-center">
                <UtensilsCrossed className="mr-2 h-6 w-6" />
                MyFood
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/planning">
                <Button variant="ghost" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Planning
                </Button>
              </Link>
              
              <Link href="/recipes">
                <Button variant="ghost" className="flex items-center">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Recettes
                </Button>
              </Link>
              
              <Link href="/shopping-lists">
                <Button variant="ghost" className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Liste de courses
                </Button>
              </Link>

              {user && (
                <div className="flex items-center space-x-2 ml-4 border-l pl-4">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.post('/logout')}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}