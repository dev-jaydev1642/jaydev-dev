import { useEffect, useState } from "react";

function App() {
    const [light, setLight] = useState(["red", "", ""]);
    const [currLight, setCurrLight] = useState(0);

    useEffect(() => {
        switch (currLight) {
            case 0:
                setLight(["red", "", ""]);
                break;
            case 1:
                setLight(["", "yellow", ""]);
                break;
            case 2:
                setLight(["", "", "green"]);
                break;
            default:
                setLight(["red", "", ""]);
        }
    }, [currLight]);

    useEffect(() => {
        let interval = setInterval(() => {
            setCurrLight((prevLight) => (prevLight + 1) % 3);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <div
                className="traffic-light"
                style={{ backgroundColor: light[0] }}
            ></div>
            <div
                className="traffic-light"
                style={{ backgroundColor: light[1] }}
            ></div>
            <div
                className="traffic-light"
                style={{ backgroundColor: light[2] }}
            ></div>
        </div>
    );
}

export default App;
