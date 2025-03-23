import { useState } from "react";

function App() {
    const items = ["laptop", "smartphone", "smartwatch"];
    const [cartItem, setCartItem] = useState([]);

    const handleAddToCart = (index) => {
        for (let i = 0; i < cartItem.length; i++) {
            if (cartItem[i]?.name === items[index]) {
                alert("Item already added");
                return;
            }
        }

        let currCartItem = { name: items[index], quantity: 1 };
        setCartItem([...cartItem, currCartItem]);
    };

    const handleQuantity = (name) => {
        for (let i = 0; i < cartItem.length; i++) {
            if (cartItem[i].name === name) {
                cartItem[i].quantity += 1;
            }
        }
        setCartItem([...cartItem]);
    };
    const handleRemoveItem = (name) => {
        setCartItem(
            cartItem.filter((item, i) => {
                console.log("item", item);
                return item?.name !== name;
            })
        );
    };

    console.log(cartItem);

    return (
        <div className="container">
            <div className="grid">
                <div className="grid-item">
                    <span>{items[0]}</span>
                    <img
                        src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="laptop image"
                    />
                    <button onClick={() => handleAddToCart(0)}>
                        Add to cart
                    </button>
                </div>
                <div className="grid-item">
                    <span>{items[1]}</span>
                    <img
                        src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2118&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="smartphone image"
                    />
                    <button onClick={() => handleAddToCart(1)}>
                        Add to cart
                    </button>
                </div>
                <div className="grid-item">
                    <span>{items[2]}</span>
                    <img
                        src="https://images.unsplash.com/photo-1553545204-4f7d339aa06a?q=80&w=1993&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="smartphone image"
                    />
                    <button onClick={() => handleAddToCart(2)}>
                        Add to cart
                    </button>
                </div>
            </div>
            <div className="cart">
                {cartItem.map((item, index) => {
                    return (
                        <div key={index}>
                            <div>Item Name: {item?.name}</div>
                            <div>Item Quantity: {item?.quantity}</div>
                            <button onClick={() => handleQuantity(item?.name)}>
                                Increase Quantity
                            </button>
                            <button
                                onClick={() => handleRemoveItem(item?.name)}
                            >
                                Remove Item
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
