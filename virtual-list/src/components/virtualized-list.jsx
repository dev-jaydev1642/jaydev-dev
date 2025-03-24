import { useMemo } from "react";
import { List } from "react-virtualized";

// Sample data
const generateData = (count) =>
    Array.from({ length: count }, (_, index) => `Item ${index + 1}`);

function VirtualizedList() {
    // Generate 1000 items
    const data = useMemo(() => generateData(1000), []);

    // Virtualization settings
    const rowHeight = 40; // Height of each row in pixels
    const listHeight = 400; // Fixed height of the list container

    // Row renderer
    const rowRenderer = ({ index, key, style }) => (
        <div key={key} style={style} className="list-item">
            {data[index]}
        </div>
    );

    return (
        <div className="list-container">
            <style>
                {`
                    .list-container {
                        max-width: 600px;
                        margin: 20px auto;
                        font-family: Arial, sans-serif;
                    }

                    .list-item {
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                        background-color: #fff;
                    }

                    .list-item:hover {
                        background-color: #f5f5f5;
                    }
                `}
            </style>

            <List
                width={600} // Width of the list
                height={listHeight} // Height of the list
                rowCount={data.length} // Total number of rows
                rowHeight={rowHeight} // Height of each row
                rowRenderer={rowRenderer} // Function to render each row
            />

            <div className="info">Total items: {data.length}</div>
        </div>
    );
}

export default VirtualizedList;
