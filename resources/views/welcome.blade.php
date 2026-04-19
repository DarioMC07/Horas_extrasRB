<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Rosa Betania - Gestión de Horas Extras</title>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
        <!-- Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif
        <style>
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
                animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .glassmorphism {
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.5);
            }
        </style>
    </head>
    <body class="antialiased font-sans bg-slate-50 text-slate-800">
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
            <!-- Decorative background elements -->
            <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[30rem] h-[30rem] rounded-full bg-green-300 opacity-30 blur-[80px]"></div>
            <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[24rem] h-[24rem] rounded-full bg-emerald-400 opacity-20 blur-[60px]"></div>

            <div class="z-10 w-full max-w-md px-8 py-10 glassmorphism shadow-2xl sm:rounded-2xl animate-fade-in-down">
                
                <div class="flex justify-center mb-8">
                    <img src="{{ asset('images/logo_full.png') }}" alt="Rosa Betania Imprenta Consciente" class="h-32 w-auto drop-shadow-sm hover:scale-105 transition-transform duration-500 hover:-translate-y-1" />
                </div>

                <div class="text-center mb-10">
                    <h1 class="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Portal de Empleados</h1>
                    <p class="text-slate-500 font-medium text-sm">Sistema de control, validación y liquidación de horas extras.</p>
                </div>

                @if (Route::has('login'))
                    <div class="flex flex-col space-y-4">
                        @auth
                            <a href="{{ url('/dashboard') }}" class="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 border border-transparent rounded-xl font-bold text-white tracking-wide hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl transition-all duration-200">
                                Ir al Dashboard
                            </a>
                        @else
                            <a href="{{ route('login') }}" class="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 border border-transparent rounded-xl font-bold text-white tracking-wide hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl transition-all duration-200">
                                Iniciar Sesión
                            </a>

                            @if (Route::has('register'))
                                <a href="{{ route('register') }}" class="w-full inline-flex justify-center items-center px-4 py-3 bg-white border-2 border-emerald-600 rounded-xl font-bold text-emerald-700 tracking-wide hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm">
                                    Registrarse
                                </a>
                            @endif
                        @endauth
                    </div>
                @endif
            </div>

            <div class="mt-12 text-center text-sm font-medium text-slate-500 z-10 w-full">
                &copy; {{ date('Y') }} Rosa Betania. Todos los derechos reservados.
            </div>
        </div>
    </body>
</html>
