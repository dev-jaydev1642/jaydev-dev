import { useState, useMemo, useRef, useEffect } from "react";

function VirtualizedTableScratch() {
    // Initial data
    const initialData = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        age: 20 + (index % 50),
        city: ["New York", "London", "Paris", "Tokyo"][index % 4],
    }));

    // States
    const [data, _] = useState(initialData);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [filter, setFilter] = useState("");
    const [visibleRows, setVisibleRows] = useState(new Set());
    const tableRef = useRef(null);
    const observerRef = useRef(null);
    const rowRefs = useRef(new Map()); // Store references to DOM nodes for observing

    // Virtualization settings
    const rowHeight = 35; // Height of each row in pixels
    const tableHeight = 400; // Fixed height of the table container
    const buffer = 5; // Number of rows to render above/below visible area

    // Search function
    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(filter.toLowerCase())
        );
    }, [data, filter]);

    // Sort function
    const sortedData = useMemo(() => {
        let sortableData = [...filteredData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [filteredData, sortConfig]);

    // Total height for the scrollable area
    const totalHeight = sortedData.length * rowHeight;

    // Calculate initial visible range based on scroll position
    const getInitialRange = () => {
        const rowsPerPage = Math.ceil(tableHeight / rowHeight);
        return {
            startIndex: 0,
            endIndex: Math.min(rowsPerPage + buffer, sortedData.length),
        };
    };

    // Intersection Observer setup
    useEffect(() => {
        if (!tableRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const newVisibleRows = new Set(visibleRows);
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.dataset.index, 10);
                    if (entry.isIntersecting) {
                        newVisibleRows.add(index);
                    } else {
                        newVisibleRows.delete(index);
                    }
                });
                setVisibleRows(newVisibleRows);
            },
            {
                root: tableRef.current,
                rootMargin: `${rowHeight * buffer}px`, // Buffer above/below viewport
                threshold: 0, // Trigger when any part of the row is visible
            }
        );

        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [rowHeight, visibleRows]); // Only depend on rowHeight, not sortedData

    // Determine which rows to render (visible rows + buffer)
    const visibleIndices = Array.from(visibleRows);
    let startIndex, endIndex;

    if (visibleIndices.length === 0) {
        // If no rows are visible yet, render the initial range
        const initialRange = getInitialRange();
        startIndex = initialRange.startIndex;
        endIndex = initialRange.endIndex;
    } else {
        const minVisibleIndex = Math.min(...visibleIndices);
        const maxVisibleIndex = Math.max(...visibleIndices);
        startIndex = Math.max(minVisibleIndex - buffer, 0);
        endIndex = Math.min(maxVisibleIndex + buffer + 1, sortedData.length);
    }

    const renderData = sortedData.slice(startIndex, endIndex);

    // Observe/unobserve rows as they are rendered
    useEffect(() => {
        const observer = observerRef.current;
        if (!observer) return;

        // Observe new rows
        renderData.forEach((_, index) => {
            const actualIndex = startIndex + index;
            const rowNode = rowRefs.current.get(actualIndex);
            if (rowNode && !visibleRows.has(actualIndex)) {
                observer.observe(rowNode);
            }
        });

        // Unobserve rows that are no longer rendered
        rowRefs.current.forEach((node, index) => {
            if (index < startIndex || index >= endIndex) {
                observer.unobserve(node);
                rowRefs.current.delete(index);
            }
        });
    }, [startIndex, endIndex, renderData, visibleRows]); // Depend on startIndex and endIndex

    // Handlers
    const handleSort = (key) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        });
        setVisibleRows(new Set()); // Reset visible rows on sort
        if (tableRef.current) tableRef.current.scrollTop = 0; // Reset scroll
    };

    const handleFilter = (e) => {
        setFilter(e.target.value);
        setVisibleRows(new Set()); // Reset visible rows on filter
        if (tableRef.current) tableRef.current.scrollTop = 0; // Reset scroll
    };

    return (
        <div className="table-container">
            <style>
                {`
                    .table-container {
                        max-width: 800px;
                        margin: 20px auto;
                        font-family: Arial, sans-serif;
                    }

                    /* Search Input */
                    input[type="text"] {
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 20px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 16px;
                        box-sizing: border-box;
                    }

                    input[type="text"]:focus {
                        outline: none;
                        border-color: #007bff;
                        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
                    }

                    /* Table Styles */
                    .virtualized-table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: #fff;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }

                    th {
                        padding: 12px 15px;
                        background-color: #f5f5f5;
                        font-weight: 600;
                        color: #333;
                        border-bottom: 2px solid #ddd;
                        cursor: pointer;
                        user-select: none;
                        position: sticky;
                        top: 0;
                        z-index: 1;
                    }

                    th:hover {
                        background-color: #e9ecef;
                    }

                    td {
                        padding: 8px 15px;
                        border-bottom: 1px solid #ddd;
                    }

                    /* Virtualized Container */
                    .scroll-container {
                        height: ${tableHeight}px;
                        overflow-y: auto;
                        position: relative;
                    }

                    .virtualized-body {
                        position: relative;
                        height: ${totalHeight}px;
                    }

                    .row {
                        position: absolute;
                        width: 100%;
                        height: ${rowHeight}px;
                    }

                    .row:hover td {
                        background-color: #f1f1f1;
                    }

                    /* Row Count Info */
                    .row-info {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #555;
                        text-align: center;
                    }
                `}
            </style>

            {/* Search */}
            <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={handleFilter}
            />

            {/* Table Container */}
            <div className="scroll-container" ref={tableRef}>
                <table className="virtualized-table">
                    <thead>
                        <tr>
                            {["id", "name", "age", "city"].map((key) => (
                                <th key={key} onClick={() => handleSort(key)}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    {sortConfig.key === key
                                        ? sortConfig.direction === "asc"
                                            ? " ↑"
                                            : " ↓"
                                        : ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="virtualized-body">
                        {renderData.map((item, index) => {
                            const actualIndex = startIndex + index;
                            return (
                                <tr
                                    key={item.id}
                                    className="row"
                                    style={{
                                        position: "absolute",
                                        top: `${actualIndex * rowHeight}px`,
                                        height: `${rowHeight}px`,
                                        width: "100%",
                                    }}
                                    data-index={actualIndex}
                                    ref={(node) => {
                                        if (node) {
                                            rowRefs.current.set(
                                                actualIndex,
                                                node
                                            );
                                        }
                                    }}
                                >
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.city}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Row Count Info */}
            <div className="row-info">
                Showing {startIndex + 1} -{" "}
                {Math.min(endIndex, sortedData.length)} of {sortedData.length}{" "}
                rows
            </div>
        </div>
    );
}

export default VirtualizedTableScratch;
