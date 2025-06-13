import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route('register'));
    };

    return (
        <>
            <Head title="S'inscrire" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <UtensilsCrossed className="h-8 w-8 text-orange-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">MyFood</h1>
                        </div>
                        <CardTitle>S'inscrire</CardTitle>
                        <p className="text-sm text-gray-600">
                            Créez votre compte pour organiser vos repas
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-sm text-red-600 mt-1">{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-sm text-red-600 mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-600 mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="text-sm text-red-600 mt-1">{errors.password_confirmation}</div>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-orange-600 hover:bg-orange-700"
                            >
                                {processing ? 'Inscription...' : "S'inscrire"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <Link href="/login" className="text-orange-600 hover:text-orange-500">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}