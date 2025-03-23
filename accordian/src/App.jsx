import { useState } from "react";

function App() {
    const [active, setActive] = useState([true, false, false]);

    return (
        <div className="container">
            <div>
                <div className="accordian">
                    <div onClick={() => setActive([!active[0], false, false])}>
                        <span>A-1</span>
                        <span>+</span>
                    </div>
                    <p style={{ display: active[0] ? "block" : "none" }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aspernatur itaque suscipit amet asperiores numquam rerum
                        dolor maiores, quo impedit corrupti deserunt maxime
                        obcaecati blanditiis nihil. Repudiandae excepturi rem
                        iure nihil.
                    </p>
                </div>
                <div className="accordian">
                    <div onClick={() => setActive([false, !active[1], false])}>
                        <span>A-2</span>
                        <span>+</span>
                    </div>
                    <p style={{ display: active[1] ? "block" : "none" }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aspernatur itaque suscipit amet asperiores numquam rerum
                        dolor maiores, quo impedit corrupti deserunt maxime
                        obcaecati blanditiis nihil. Repudiandae excepturi rem
                        iure nihil.
                    </p>
                </div>
                <div className="accordian">
                    <div onClick={() => setActive([false, false, !active[2]])}>
                        <span>A-3</span>
                        <span>+</span>
                    </div>
                    <p style={{ display: active[2] ? "block" : "none" }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aspernatur itaque suscipit amet asperiores numquam rerum
                        dolor maiores, quo impedit corrupti deserunt maxime
                        obcaecati blanditiis nihil. Repudiandae excepturi rem
                        iure nihil.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
