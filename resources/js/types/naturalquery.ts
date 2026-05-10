export interface NaturalQueryMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface MetricRender {
    type: 'metric';
    value: number;
    label: string;
}

export interface ListItem {
    label: string;
    value: string | number;
}

export interface ListRender {
    type: 'list';
    items: ListItem[];
}

export interface TableRender {
    type: 'table';
    columns: string[];
    rows: Record<string, unknown>[];
}

export interface MessageRender {
    type: 'message';
    text: string;
}

export type NaturalQueryRender = MetricRender | ListRender | TableRender | MessageRender;

export interface Interpretation {
    format: 'markdown';
    content: string;
}

export interface NaturalQueryResponse {
    answer: string | null;
    interpretation: Interpretation | null;
    sql: string | null;
    data: Record<string, unknown>[];
    confidence: 'high' | 'medium' | 'low' | 'none';
    truncated: boolean;
    totalRows: number;
    intent: 'social' | 'meta' | 'data';
    render: NaturalQueryRender;
    warnings?: string[];
}
