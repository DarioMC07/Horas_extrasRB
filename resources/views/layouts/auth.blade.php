<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso — Rosa Betania</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-card">

            <div class="auth-logo">
                <img src="{{ asset('images/logo_full.png') }}" alt="Rosa Betania Imprenta Consciente">
            </div>

            @yield('content')

        </div>
    </div>
</body>
</html>
