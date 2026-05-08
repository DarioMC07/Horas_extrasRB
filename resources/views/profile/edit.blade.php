@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Mi Perfil</h1>
        <p class="page-subtitle">Actualiza tu información de cuenta</p>
    </div>
</div>

<div class="grid-cols-2">
    <div class="card">
        <div class="card-header">
            <span class="card-title">Información Personal</span>
        </div>
        <hr class="card-divider">

        <form method="post" action="{{ route('profile.update') }}">
            @csrf
            @method('patch')

            <div class="form-group">
                <label for="name">Nombre Completo</label>
                <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}" required autofocus autocomplete="name">
                @error('name')
                    <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}" required autocomplete="email">
                @error('email')
                    <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
                @enderror
            </div>

            @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                <div class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Tu correo electrónico no ha sido verificado.
                    <form method="post" action="{{ route('verification.send') }}" style="display: inline;">
                        @csrf
                        <button type="submit" style="background: none; border: none; color: inherit; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Reenviar verificación</button>
                    </form>
                </div>

                @if (session('status') === 'verification-link-sent')
                    <div class="alert alert-success" style="margin-top: 0.5rem;">
                        Se ha enviado un nuevo enlace de verificación a tu correo.
                    </div>
                @endif
            @endif

            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem;">
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>

                @if (session('status') === 'profile-updated')
                    <span style="font-size: 0.8rem; color: var(--color-positive); font-weight: 600;">
                        Guardado.
                    </span>
                @endif
            </div>
        </form>
    </div>

    <div class="card">
        <div class="card-header">
            <span class="card-title">Cambiar Contraseña</span>
        </div>
        <hr class="card-divider">

        <form method="post" action="{{ route('password.update') }}">
            @csrf
            @method('put')

            <div class="form-group">
                <label for="current_password">Contraseña Actual</label>
                <input type="password" id="current_password" name="current_password" autocomplete="current-password" placeholder="••••••••">
                @error('current_password', 'updatePassword')
                    <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label for="password">Nueva Contraseña</label>
                <input type="password" id="password" name="password" autocomplete="new-password" placeholder="••••••••">
                @error('password', 'updatePassword')
                    <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirmar Nueva Contraseña</label>
                <input type="password" id="password_confirmation" name="password_confirmation" autocomplete="new-password" placeholder="••••••••">
                @error('password_confirmation', 'updatePassword')
                    <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
                @enderror
            </div>

            <div style="margin-top: 1.5rem;">
                <button type="submit" class="btn btn-primary">Actualizar Contraseña</button>

                @if (session('status') === 'password-updated')
                    <span style="font-size: 0.8rem; color: var(--color-positive); font-weight: 600;">
                        Contraseña actualizada.
                    </span>
                @endif
            </div>
        </form>
    </div>
</div>

<div class="card" style="border-color: rgba(208, 50, 56, 0.25);">
    <div class="card-header">
        <span class="card-title">Eliminar Cuenta</span>
    </div>
    <hr class="card-divider">
    <p style="font-size: 0.875rem; color: var(--color-gray); margin-bottom: 1.25rem; font-weight: 500;">
        Una vez que elimines tu cuenta, todos los recursos y datos asociados serán eliminados permanentemente. Antes de eliminar, descarga cualquier dato o información que desees conservar.
    </p>

    <form method="post" action="{{ route('profile.destroy') }}"
          onsubmit="return confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');">
        @csrf
        @method('delete')

        <div class="form-group" style="max-width: 300px;">
            <label for="password_delete">Contraseña</label>
            <input type="password" id="password_delete" name="password" placeholder="••••••••" autocomplete="current-password">
            @error('password', 'userDeletion')
                <p style="color: var(--color-danger); font-size: 0.75rem; margin-top: 0.35rem; font-weight: 600;">{{ $message }}</p>
            @enderror
        </div>

        <button type="submit" class="btn btn-danger">Eliminar Mi Cuenta</button>
    </form>
</div>

@endsection
