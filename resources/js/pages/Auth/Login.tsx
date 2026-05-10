import { useForm } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Eye,
    EyeOff,
    Loader2,
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

interface LoginProps {
    canResetPassword?: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("login"));
    }

    return (
        <div className="flex min-h-screen">
            {/* ====== Left Panel: Branding ====== */}
            <div className="hidden lg:relative lg:flex lg:w-5/12 xl:w-1/2 bg-wise-dark-green overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(159,232,112,0.13),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(159,232,112,0.06),transparent_50%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wise-green/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-wise-green/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

                <div className="absolute top-24 left-16 w-2 h-2 rounded-full bg-wise-green/20" />
                <div className="absolute top-44 right-28 w-3 h-3 rounded-full bg-wise-green/12" />
                <div className="absolute bottom-48 left-20 w-1.5 h-1.5 rounded-full bg-wise-green/25" />
                <div className="absolute top-1/2 right-16 w-2.5 h-2.5 rounded-full bg-wise-green/10" />

                <div className="relative flex flex-col justify-center px-14 xl:px-20 w-full max-w-xl mx-auto">
                    <div className="mb-10">
                        <img
                            src="/images/logo_full.png"
                            alt="Logo"
                            className="h-11 w-auto brightness-0 invert opacity-90"
                        />
                    </div>
                    <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
                        Bienvenido a<br />
                        Horas Extras
                    </h1>
                    <p className="mt-4 text-base xl:text-lg text-wise-green/60 leading-relaxed max-w-sm">
                        Sistema de gestión y control de horas extras. Accede
                        para gestionar tus registros.
                    </p>

                    <div className="mt-14 space-y-5">
                        {[
                            "Registro simplificado de horas extras",
                            "Reportes detallados y estadísticas",
                            "Acceso seguro y controlado",
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-wise-green/10 flex items-center justify-center">
                                    <svg
                                        className="w-3.5 h-3.5 text-wise-green/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm text-white/50">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ====== Right Panel: Form ====== */}
            <div className="flex flex-1 flex-col items-center justify-center bg-wise-bg px-6 py-12 sm:px-8 lg:px-14">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-10">
                        <img
                            src="/images/logo_full.png"
                            alt="Logo"
                            className="h-10 w-auto"
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-wise-black tracking-tight">
                            Iniciar sesi&oacute;n
                        </h2>
                        <p className="mt-1.5 text-sm text-wise-gray">
                            Ingrese sus credenciales para continuar
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-wise-mint/80 px-4 py-3 text-sm font-medium text-wise-positive border border-wise-green/20">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            {status}
                        </div>
                    )}

                    {errors.email && (
                        <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-wise-danger/10 px-4 py-3 text-sm font-medium text-wise-danger border border-wise-danger/20">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            Credenciales incorrectas. Intente nuevamente.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-wise-warm-dark"
                            >
                                Correo electr&oacute;nico
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                    <Mail className="w-4 h-4 text-wise-gray/60" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoFocus
                                    placeholder="correo@rosabetania.com"
                                    className={cn(
                                        "pl-10 h-11 transition-all duration-200",
                                        focused === "email" &&
                                            "border-wise-green/50 ring-2 ring-wise-green/20",
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-wise-danger mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-wise-warm-dark"
                            >
                                Contrase&ntilde;a
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                    <Lock className="w-4 h-4 text-wise-gray/60" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                    className={cn(
                                        "pl-10 pr-10 h-11 transition-all duration-200",
                                        focused === "password" &&
                                            "border-wise-green/50 ring-2 ring-wise-green/20",
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-wise-gray/50 hover:text-wise-gray transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-wise-danger mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="remember"
                                className="flex items-center gap-2.5 cursor-pointer select-none"
                            >
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="sr-only peer"
                                />
                                <span className="w-4 h-4 rounded border border-wise-light bg-white peer-checked:bg-wise-green peer-checked:border-wise-green transition-all duration-150 flex items-center justify-center">
                                    <svg
                                        className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </span>
                                <span className="text-sm text-wise-gray">
                                    Recordar sesi&oacute;n
                                </span>
                            </label>

                            {canResetPassword && (
                                <a
                                    href={route("password.request")}
                                    className="text-sm text-wise-green hover:text-wise-green/80 transition-colors"
                                >
                                    &iquest;Olvidaste tu contrase&ntilde;a?
                                </a>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-wise-green text-wise-black hover:bg-wise-green/90 active:scale-[0.98] transition-all duration-150"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                "Ingresar al Sistema"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
