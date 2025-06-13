import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route('login'));
    };

    return (
        <>
            <Head title="Se connecter" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <UtensilsCrossed className="h-8 w-8 text-orange-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">MyFood</h1>
                        </div>
                        <CardTitle>Se connecter</CardTitle>
                        <p className="text-sm text-gray-600">
                            Accédez à votre planning de repas
                        </p>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
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
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-600 mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <Label htmlFor="remember" className="text-sm">
                                    Se souvenir de moi
                                </Label>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-orange-600 hover:bg-orange-700"
                            >
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Pas encore de compte ?{' '}
                                <Link href="/register" className="text-orange-600 hover:text-orange-500">
                                    S'inscrire
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">Compte de démonstration</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Email: demo@myfood.com<br />
                                Mot de passe: password
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}