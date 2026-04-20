@extends('layouts.auth')

@section('content')

<h1 class="auth-heading">Bienvenido</h1>
<p class="auth-subheading">Ingrese sus credenciales para continuar</p>

<form method="POST" action="{{ route('login') }}">
    @csrf

    @if ($errors->any())
        <div class="alert alert-danger" style="margin-bottom: 1.25rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                 style="flex-shrink:0; margin-top:1px;">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Credenciales incorrectas. Intente nuevamente.
        </div>
    @endif

    <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email"
               value="{{ old('email') }}"
               required autofocus
               placeholder="correo@rosabetania.com">
    </div>

    <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password"
               required placeholder="••••••••">
    </div>

    <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
        <input type="checkbox" id="remember_me" name="remember">
        <label for="remember_me" style="margin: 0; font-weight: 400; color: var(--color-muted); cursor: pointer;">
            Recordar sesión
        </label>
    </div>

    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 0.7rem;">
        Ingresar al Sistema
    </button>
</form>

@endsection
