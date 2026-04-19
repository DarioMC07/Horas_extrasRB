@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Bienvenido</h1>
</div>

<div class="alert alert-warning" style="background-color: var(--color-warning-bg); border: 1px solid rgba(245, 158, 11, 0.2); color: var(--color-text);">
    <h3 style="color: var(--color-warning); margin-bottom: 0.5rem;">⚠️ Perfil Incompleto</h3>
    <p>Tu cuenta de usuario no está asociada a ningún perfil de empleado en el sistema. Por favor, contacta a la gerencia o administración para que completen tu vinculación.</p>
</div>
@endsection
