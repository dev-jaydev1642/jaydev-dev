import { useState } from "react";
import "./index.css";

function App() {
    const [value, setValue] = useState(0);
    return (
        <div className="app">
            <div>{value}</div>
            <div className="buttons">
                <button
                    disabled={value === 0}
                    onClick={() => setValue(value - 1)}
                >
                    -
                </button>
                <button onClick={() => setValue(value + 1)}>+</button>
            </div>
            <button onClick={() => setValue(0)}>Reset</button>
        </div>
    );
}

export default App;
