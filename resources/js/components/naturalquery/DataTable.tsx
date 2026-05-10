interface DataTableProps {
    columns: string[];
    rows: Record<string, unknown>[];
}

export default function DataTable({ columns, rows }: DataTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-wise-light">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-wise-light bg-wise-mint">
                        {columns.map((col, i) => (
                            <th key={i} className="px-4 py-2 font-semibold text-wise-black whitespace-nowrap">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-wise-light last:border-0 hover:bg-wise-light/50">
                            {columns.map((col, ci) => {
                                const cell = row[col];
                                return (
                                    <td key={ci} className="px-4 py-2 text-wise-warm-dark whitespace-nowrap">
                                        {typeof cell === 'number' ? cell.toLocaleString('es-AR') : String(cell ?? '')}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
