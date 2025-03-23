import { useState } from "react";

function App() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        if (task) {
            setTasks([...tasks, task]);
            setTask("");
        }
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2>To Do List</h2>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
            />
            <button type="button" onClick={addTask}>
                Add
            </button>
            <div>
                {tasks.map((task, index) => {
                    return (
                        <div key={index}>
                            <span>{task}</span>
                            <button onClick={() => deleteTask(index)}>X</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
