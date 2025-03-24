import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { FixedSizeList } from "react-window";
import "./react-table-virtualization-dynamic.css";

// Sample data (could be much larger)
const generateData = (count) =>
    Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        age: 20 + (index % 50),
        city: ["New York", "London", "Paris", "Tokyo"][index % 4],
    }));

function VirtualizedTable() {
    // Generate 1000 rows (or more) for demonstration
    const data = useMemo(() => generateData(1000), []);

    // Column definitions
    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "age", header: "Age" },
            { accessorKey: "city", header: "City" },
        ],
        []
    );

    // Table instance
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    // Virtualization settings
    const rowHeight = 35; // Height of each row in pixels
    const tableHeight = 400; // Fixed height of the table container
    // const visibleRows = Math.floor(tableHeight / rowHeight);

    // Row renderer for react-window
    const Row = ({ index, style }) => {
        const row = table.getRowModel().rows[index];
        return (
            <tr style={style}>
                {row.getVisibleCells().map((cell) => (
                    <td
                        key={cell.id}
                        style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        {cell.getValue()}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <div>
            {/* Search Input */}
            <input
                placeholder="Search..."
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px" }}
            />

            {/* Table Container */}
            <div style={{ height: `${tableHeight}px`, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{
                                            padding: "8px",
                                            background: "#f5f5f5",
                                            borderBottom: "2px solid #ddd",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : header.column.columnDef.header}
                                        {{
                                            asc: " ↑",
                                            desc: " ↓",
                                        }[header.column.getIsSorted()] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                </table>

                {/* Virtualized Body */}
                <FixedSizeList
                    height={tableHeight}
                    itemCount={table.getRowModel().rows.length}
                    itemSize={rowHeight}
                    width="100%"
                >
                    {Row}
                </FixedSizeList>
            </div>

            {/* Row Count Info */}
            <div style={{ marginTop: "10px" }}>
                Showing {table.getRowModel().rows.length} of {data.length} rows
            </div>
        </div>
    );
}

export default VirtualizedTable;
