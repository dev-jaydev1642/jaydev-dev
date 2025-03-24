import { useState, useMemo, useRef, useEffect } from "react";

// Sample data
const generateData = (count) =>
    Array.from({ length: count }, (_, index) => `Item ${index + 1}`);

function VirtualizedListScratch() {
    // Generate 1000 items
    const data = useMemo(() => generateData(1000), []);

    // States
    const [visibleItems, setVisibleItems] = useState(new Set());
    const listRef = useRef(null);
    const observerRef = useRef(null);

    // Virtualization settings
    const itemHeight = 40; // Height of each item in pixels
    const listHeight = 400; // Fixed height of the list container
    const buffer = 5; // Number of items to render above/below visible area

    // Total height for the scrollable area
    const totalHeight = data.length * itemHeight;

    // Calculate initial visible range based on scroll position
    const getInitialRange = () => {
        const itemsPerPage = Math.ceil(listHeight / itemHeight);
        return {
            startIndex: 0,
            endIndex: Math.min(itemsPerPage + buffer, data.length),
        };
    };

    // Intersection Observer setup
    useEffect(() => {
        if (!listRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const newVisibleItems = new Set(visibleItems);
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.dataset.index, 10);
                    if (entry.isIntersecting) {
                        newVisibleItems.add(index);
                    } else {
                        newVisibleItems.delete(index);
                    }
                });
                setVisibleItems(newVisibleItems);
            },
            {
                root: listRef.current,
                rootMargin: `${itemHeight * buffer}px`, // Buffer above/below viewport
                threshold: 0, // Trigger when any part of the item is visible
            }
        );

        observerRef.current = observer;

        // Observe all items initially rendered
        const items = listRef.current.querySelectorAll(".list-item");
        items.forEach((item) => observer.observe(item));

        return () => {
            observer.disconnect();
        };
    }, [data, itemHeight, visibleItems]); // Re-run when visibleItems changes to observe new items

    // Determine which items to render (visible items + buffer)
    const visibleIndices = Array.from(visibleItems);
    let startIndex, endIndex;

    if (visibleIndices.length === 0) {
        // If no items are visible yet, render the initial range
        const initialRange = getInitialRange();
        startIndex = initialRange.startIndex;
        endIndex = initialRange.endIndex;
    } else {
        const minVisibleIndex = Math.min(...visibleIndices);
        const maxVisibleIndex = Math.max(...visibleIndices);
        startIndex = Math.max(minVisibleIndex - buffer, 0);
        endIndex = Math.min(maxVisibleIndex + buffer + 1, data.length);
    }

    const renderData = data.slice(startIndex, endIndex);

    return (
        <div className="list-container">
            <style>
                {`
                    .list-container {
                        max-width: 600px;
                        margin: 20px auto;
                        font-family: Arial, sans-serif;
                    }

                    /* Scroll Container */
                    .scroll-container {
                        height: ${listHeight}px;
                        overflow-y: auto;
                        position: relative;
                        border: 1px solid #ddd;
                        background-color: #fff;
                    }

                    .virtualized-body {
                        position: relative;
                        height: ${totalHeight}px;
                    }

                    .list-item {
                        position: absolute;
                        width: 100%;
                        height: ${itemHeight}px;
                        padding: 10px;
                        box-sizing: border-box;
                        border-bottom: 1px solid #ddd;
                    }

                    .list-item:hover {
                        background-color: #f5f5f5;
                    }

                    /* Info */
                    .info {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #555;
                        text-align: center;
                    }
                `}
            </style>

            {/* List Container */}
            <div className="scroll-container" ref={listRef}>
                <div className="virtualized-body">
                    {renderData.map((item, index) => (
                        <div
                            key={startIndex + index}
                            className="list-item"
                            style={{
                                top: `${(startIndex + index) * itemHeight}px`,
                            }}
                            data-index={startIndex + index}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="info">
                Showing {startIndex + 1} - {Math.min(endIndex, data.length)} of{" "}
                {data.length} items
            </div>
        </div>
    );
}

export default VirtualizedListScratch;
