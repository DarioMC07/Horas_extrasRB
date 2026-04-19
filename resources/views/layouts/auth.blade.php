<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Rosa Betania</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <style>
        .auth-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--color-bg);
            padding: 1rem;
        }
        .auth-card {
            background-color: var(--color-surface);
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--color-border);
        }
        .auth-logo {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
            color: var(--color-primary);
        }
    </style>
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <div class="auth-logo">
                <img src="{{ asset('images/logo_full.png') }}" alt="Rosa Betania Imprenta Consciente" style="height: 90px; width: auto; margin: 0 auto; display: block;">
            </div>
            @yield('content')
        </div>
    </div>
</body>
</html>
