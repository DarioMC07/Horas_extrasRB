<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NaturalQueryService
{
    private string $baseUrl;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('NATURAL_QUERY_URL', 'http://localhost:4000'), '/');
        $this->timeout = 30;
    }

    public function createSession(): array
    {
        $dbDialect = env('DB_CONNECTION', 'mysql');
        $dialect = match ($dbDialect) {
            'sqlite' => 'sqlite',
            'pgsql' => 'postgresql',
            'mariadb' => 'mariadb',
            default => 'mysql',
        };

        $payload = [
            'db' => [
                'dialect' => $dialect,
                'host' => env('NATURAL_QUERY_DB_HOST', env('DB_HOST', '127.0.0.1')),
                'port' => (int) env('NATURAL_QUERY_DB_PORT', env('DB_PORT', 3306)),
                'user' => env('NATURAL_QUERY_DB_USER', env('DB_USERNAME', 'root')),
                'password' => env('NATURAL_QUERY_DB_PASSWORD', env('DB_PASSWORD', '')),
                'database' => env('NATURAL_QUERY_DB_NAME', env('DB_DATABASE', 'horas_extras')),
            ],
            'llm' => array_values(array_filter([
                env('NATURAL_QUERY_GROQ_KEY') ? ['provider' => 'groq', 'apiKey' => env('NATURAL_QUERY_GROQ_KEY')] : null,
                env('NATURAL_QUERY_GEMINI_KEY') ? ['provider' => 'gemini', 'apiKey' => env('NATURAL_QUERY_GEMINI_KEY')] : null,
            ])),
        ];

        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/sessions", $payload);
        } catch (ConnectionException $e) {
            Log::error('NaturalQuery connection refused', ['url' => $this->baseUrl]);
            throw new \RuntimeException('No se pudo conectar con el servicio de consultas. Verificá que NaturalQuery esté corriendo.');
        }

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('NaturalQuery createSession failed', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        throw new \RuntimeException(
            $response->json('error.message') ?? 'No se pudo crear la sesión de consulta.'
        );
    }

    public function query(string $sessionId, string $question, array $history = [], string $interpret = 'rich'): array
    {
        $payload = array_filter([
            'sessionId' => $sessionId,
            'question' => $question,
            'history' => $history,
            'interpret' => $interpret,
        ], fn ($v) => $v !== null);

        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/query", $payload);
        } catch (ConnectionException $e) {
            Log::error('NaturalQuery connection refused on query', ['url' => $this->baseUrl]);
            throw new \RuntimeException('No se pudo conectar con el servicio de consultas.', 503);
        }

        if ($response->successful()) {
            return $response->json();
        }

        $errorBody = $response->json();
        $errorCode = $errorBody['error']['code'] ?? 'UNKNOWN';
        $errorMessage = $errorBody['error']['message'] ?? 'Error desconocido en NaturalQuery';
        $retryAfter = $errorBody['error']['retryAfter'] ?? null;

        Log::error('NaturalQuery query failed', [
            'status' => $response->status(),
            'code' => $errorCode,
            'message' => $errorMessage,
        ]);

        throw new \RuntimeException($errorMessage, $response->status());
    }

    public function getSchema(string $sessionId): array
    {
        $response = Http::timeout($this->timeout)
            ->get("{$this->baseUrl}/sessions/{$sessionId}/schema");

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('NaturalQuery getSchema failed', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        throw new \RuntimeException(
            $response->json('error.message') ?? 'No se pudo obtener el esquema.'
        );
    }

    public function deleteSession(string $sessionId): void
    {
        $response = Http::timeout($this->timeout)
            ->delete("{$this->baseUrl}/sessions/{$sessionId}");

        if (!$response->successful()) {
            Log::warning('NaturalQuery deleteSession failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
    }
}
