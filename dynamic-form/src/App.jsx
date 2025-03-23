import { useReducer } from "react";

const initalState = {
    name: "",
    email: "",
    password: "",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "name":
            return { ...state, name: action.payload };
        case "email":
            return { ...state, email: action.payload };
        case "password":
            return { ...state, password: action.payload };
        default:
            throw new Error("Unknown action");
    }
};

function App() {
    const [{ name, email, password }, dispatch] = useReducer(
        reducer,
        initalState
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("Form submitted");
        console.log(`name: ${name} email: ${email} password${password}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) =>
                    dispatch({ type: "name", payload: e.target.value })
                }
            />
            <label htmlFor="email">Email:</label>
            <input
                id="email"
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                    dispatch({ type: "email", payload: e.target.value })
                }
            />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                    dispatch({ type: "password", payload: e.target.value })
                }
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default App;
