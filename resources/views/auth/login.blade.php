@extends('layouts.auth')

@section('content')
<form method="POST" action="{{ route('login') }}">
    @csrf

    @if ($errors->any())
        <div class="alert alert-danger" style="font-size: 0.875rem;">
            Credenciales incorrectas.
        </div>
    @endif

    <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus placeholder="tucorreo@rosabetania.com">
    </div>

    <div class="form-group" style="margin-top: 1.5rem;">
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" required placeholder="••••••••">
    </div>

    <div class="form-group" style="display: flex; align-items: center; margin-top: 1rem; gap: 0.5rem;">
        <input type="checkbox" id="remember_me" name="remember" style="width: auto;">
        <label for="remember_me" style="margin: 0; font-weight: normal; color: var(--color-muted);">Recordarme</label>
    </div>

    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem; padding: 0.75rem;">
        Ingresar al Sistema
    </button>
</form>
@endsection
