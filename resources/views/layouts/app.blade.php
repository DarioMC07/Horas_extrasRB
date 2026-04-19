<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Horas Extras - Rosa Betania</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand" style="padding: 1.5rem 1rem; text-align: center;">
                <a href="{{ route('dashboard') }}" style="display: block; text-decoration: none;">
                    <img src="{{ asset('images/logo_full.png') }}" alt="Rosa Betania Imprenta Consciente" style="width: 100%; max-height: 70px; object-fit: contain; margin: 0 auto; display: block;">
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="{{ route('dashboard') }}" class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    📊 Dashboard
                </a>
                
                <a href="{{ route('horas-extras.index') }}" class="nav-link {{ request()->routeIs('horas-extras.*') ? 'active' : '' }}">
                    ⏱️ Horas Extras
                </a>

                @if(auth()->user()->isAdmin())
                    <a href="{{ route('empleados.index') }}" class="nav-link {{ request()->routeIs('empleados.*') ? 'active' : '' }}">
                        👥 Empleados
                    </a>
                    <a href="{{ route('turnos.index') }}" class="nav-link {{ request()->routeIs('turnos.*') ? 'active' : '' }}">
                        📅 Turnos
                    </a>
                    <a href="{{ route('reportes.index') }}" class="nav-link {{ request()->routeIs('reportes.*') ? 'active' : '' }}">
                        📈 Reportes
                    </a>
                    <a href="{{ route('usuarios.index') }}" class="nav-link {{ request()->routeIs('usuarios.*') ? 'active' : '' }}">
                        ⚙️ Usuarios
                    </a>
                @endif
            </nav>
            <div class="sidebar-footer">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="btn btn-secondary" style="width: 100%;">🚪 Cerrar Sesión</button>
                </form>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="topbar">
                <div class="user-info">
                    <span style="color: var(--color-muted); margin-right: 1rem;">
                        {{ auth()->user()->role === 'admin' ? 'Gerente' : 'Empleado' }}
                    </span>
                    <strong>{{ auth()->user()->name }}</strong>
                </div>
            </header>

            <div class="content-body">
                @if(session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif
                
                @if($errors->any())
                    <div class="alert alert-danger">
                        <ul style="margin-left: 1.5rem;">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @yield('content')
            </div>
        </main>
    </div>
</body>
</html>
