import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ChefHat, ShoppingCart, UtensilsCrossed, LogOut } from "lucide-react";

interface Props {
    auth: {
        user: any;
    };
}

export default function Home({ auth }: Props) {
    return (
        <>
            <Head title="MyFood - Planificateur de repas" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <UtensilsCrossed className="h-8 w-8 text-orange-600 mr-3" />
                                <h1 className="text-2xl font-bold text-gray-900">MyFood</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <span className="text-sm text-gray-700">
                                            Bonjour, {auth.user.name}
                                        </span>
                                        <Link href="/planning">
                                            <Button>Mon planning</Button>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => router.post('/logout')}
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="outline">Se connecter</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>S'inscrire</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                                {auth.user ? (
                                    <>
                                        Bon retour,{" "}
                                        <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                                            {auth.user.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Planifiez vos repas,{" "}
                                        <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                                            simplifiez vos courses
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                {auth.user ? (
                                    "Prêt à organiser vos repas ? Accédez à votre planning ou découvrez de nouvelles recettes."
                                ) : (
                                    "Organisez votre planning de repas hebdomadaire, gérez vos recettes et générez automatiquement vos listes de courses."
                                )}
                            </p>
                            <div className="flex justify-center gap-4">
                                {auth.user ? (
                                    <>
                                        <Link href="/planning">
                                            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                                                <CalendarDays className="mr-2 h-5 w-5" />
                                                Accéder au planning
                                            </Button>
                                        </Link>
                                        <Link href="/recipes">
                                            <Button size="lg" variant="outline">
                                                <ChefHat className="mr-2 h-5 w-5" />
                                                Voir les recettes
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                                                <CalendarDays className="mr-2 h-5 w-5" />
                                                Commencer maintenant
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="lg" variant="outline">
                                                S'inscrire gratuitement
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Fonctionnalités principales
                            </h2>
                            <p className="text-lg text-gray-600">
                                Tout ce dont vous avez besoin pour organiser vos repas
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CalendarDays className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Planning hebdomadaire
                                    </h3>
                                    <p className="text-gray-600">
                                        Organisez vos repas pour toute la semaine avec une vue claire
                                        et intuitive par jour et par type de repas.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ChefHat className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Gestion des recettes
                                    </h3>
                                    <p className="text-gray-600">
                                        Créez et gérez vos recettes avec des ingrédients précis,
                                        temps de préparation et instructions détaillées.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Liste de courses automatique
                                    </h3>
                                    <p className="text-gray-600">
                                        Générez automatiquement votre liste de courses à partir
                                        de votre planning avec possibilité d'ajouts manuels.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Comment ça marche
                            </h2>
                            <p className="text-lg text-gray-600">
                                En quelques étapes simples
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Créez vos recettes</h3>
                                <p className="text-gray-600">
                                    Ajoutez vos recettes préférées avec tous les ingrédients nécessaires
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Planifiez votre semaine</h3>
                                <p className="text-gray-600">
                                    Assignez vos recettes aux différents repas de la semaine
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Générez votre liste</h3>
                                <p className="text-gray-600">
                                    Obtenez automatiquement votre liste de courses optimisée
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <UtensilsCrossed className="h-8 w-8 text-orange-500 mr-2" />
                                <h3 className="text-2xl font-bold">MyFood</h3>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Simplifiez votre organisation culinaire au quotidien
                            </p>
                            <div className="text-sm text-gray-500">
                                © 2025 MyFood. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
