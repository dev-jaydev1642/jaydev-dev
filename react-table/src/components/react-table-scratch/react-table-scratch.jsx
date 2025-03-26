import "./react-table-scratch.css";
import { useState, useMemo } from "react";

function ReactTableScratch() {
    // Initial data
    const initialData = [
        { id: 1, name: "John", age: 25, city: "New York" },
        { id: 2, name: "Jane", age: 30, city: "London" },
        { id: 3, name: "Bob", age: 35, city: "Paris" },
        { id: 4, name: "Alice", age: 28, city: "Tokyo" },
    ];

    // States
    const data = initialData;
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

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

    // Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Handlers
    const handleSort = (key) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        });
    };

    const handleFilter = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="table-container">
            {/* Search */}
            <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={handleFilter}
            />

            {/* Table */}
            <table>
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
                <tbody>
                    {paginatedData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>{item.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ReactTableScratch;
