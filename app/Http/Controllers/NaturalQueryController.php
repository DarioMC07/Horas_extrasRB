<?php

namespace App\Http\Controllers;

use App\Services\NaturalQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NaturalQueryController extends Controller
{
    private NaturalQueryService $naturalQuery;

    public function __construct(NaturalQueryService $naturalQuery)
    {
        $this->naturalQuery = $naturalQuery;
    }

    public function createSession(Request $request)
    {
        try {
            $response = $this->naturalQuery->createSession();

            if (!isset($response['id'])) {
                Log::error('NaturalQuery missing id in response', ['response' => $response]);
                return response()->json([
                    'error' => 'El servicio de consultas no está disponible en este momento. Intentalo más tarde.',
                ], 503);
            }

            $request->session()->put('naturalquery_session_id', $response['id']);

            return response()->json([
                'sessionId' => $response['id'],
                'db' => $response['db'] ?? null,
                'providers' => $response['providers'] ?? [],
            ]);
        } catch (\Throwable $e) {
            Log::error('NaturalQuery session creation error', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'El servicio de consultas no está disponible en este momento. Intentalo más tarde.',
            ], 503);
        }
    }

    public function query(Request $request)
    {
        $request->validate([
            'question' => ['required', 'string', 'min:1'],
            'sessionId' => ['nullable', 'string'],
            'history' => ['nullable', 'array'],
            'history.*.question' => ['required', 'string'],
            'history.*.answer' => ['required', 'string'],
            'interpret' => ['nullable', 'string', 'in:none,short,rich'],
        ]);

        $sessionId = $request->input('sessionId') ?: $request->session()->get('naturalquery_session_id');

        if (!$sessionId) {
            return response()->json([
                'error' => 'No hay una sesión activa. Abrí y cerrá el chat para reiniciar.',
            ], 400);
        }

        try {
            $result = $this->naturalQuery->query(
                $sessionId,
                $request->input('question'),
                $request->input('history', []),
                $request->input('interpret', 'rich')
            );

            return response()->json($result);
        } catch (\Throwable $e) {
            $statusCode = $e->getCode() ?: 500;

            if ($statusCode === 404) {
                $request->session()->forget('naturalquery_session_id');
                return response()->json([
                    'error' => 'Sesión expirada. Cerrá y volvé a abrir el chat.',
                    'code' => 'INVALID_SESSION',
                ], 401);
            }

            if ($statusCode === 429) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'code' => 'RATE_LIMIT_EXCEEDED',
                ], 429);
            }

            if ($statusCode === 422) {
                return response()->json([
                    'error' => 'No pude generar una consulta válida para esa pregunta. Intentá reformularla con más detalle.',
                    'code' => 'INVALID_SQL',
                ], 422);
            }

            return response()->json([
                'error' => $e->getMessage(),
                'code' => 'QUERY_ERROR',
            ], 500);
        }
    }
}
