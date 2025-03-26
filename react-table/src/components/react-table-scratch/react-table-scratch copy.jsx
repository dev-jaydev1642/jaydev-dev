import { useMemo, useState } from "react";
import "./react-table-scratch.css";

function ReactTable() {
    const initialData = [
        { id: 1, name: "JAY", age: 25, city: "123" },
        { id: 2, name: "ABC", age: 30, city: "456" },
        { id: 3, name: "DEF", age: 35, city: "789" },
        { id: 4, name: "HIJ", age: 40, city: "012" },
        { id: 5, name: "KLM", age: 45, city: "345" },
    ];

    const [sort, setSort] = useState({
        columnName: "",
        direction: "",
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 2;
    const data = initialData;

    const filterData = useMemo(() => {
        return data.filter((row) =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [data, search]);

    const sortData = useMemo(() => {
        let sortData = [...filterData];

        sortData.sort((a, b) => {
            if (sort.columnName) {
                if (a[sort.columnName] < b[sort.columnName]) {
                    return sort.direction === "asc" ? -1 : 1;
                } else if (a[sort.columnName] > b[sort.columnName]) {
                    return sort.direction === "desc" ? -1 : 1;
                }

                return 0;
            }
        });

        return sortData;
    }, [filterData, sort]);

    const paginateData = useMemo(() => {
        const currIndex = (currentPage - 1) * itemsPerPage;
        const lastIndex = currIndex + itemsPerPage;

        return sortData.slice(currIndex, lastIndex);
    }, [sortData, currentPage]);

    const totalPage = Math.ceil(sortData.length / itemsPerPage);

    const handleSort = (key) => {
        setSort({
            columnName: key,
            direction: sort.direction === "asc" ? "desc" : "asc",
        });
    };

    const handleFilter = (e) => {
        setCurrentPage(1);
        setSearch(e.target.value);
    };

    return (
        <div className="table-container">
            <input
                type="text"
                placeholder="search"
                value={search}
                onChange={handleFilter}
            />

            <table>
                <thead>
                    <tr>
                        {["id", "name", "age", "city"].map((val) => {
                            return (
                                <th key={val} onClick={() => handleSort(val)}>
                                    {val.charAt(0).toUpperCase() + val.slice(1)}
                                    {sort.columnName === "val"
                                        ? sort.direction === "asc"
                                            ? "↑"
                                            : "↓"
                                        : ""}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {paginateData.map((val) => (
                        <tr key={val.id}>
                            <td>{val.id}</td>
                            <td>{val.name}</td>
                            <td>{val.age}</td>
                            <td>{val.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() =>
                        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPage}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prevPage) =>
                            Math.min(prevPage + 1, totalPage)
                        )
                    }
                    disabled={currentPage === totalPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ReactTable;
