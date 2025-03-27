import React from 'react';

const SignUp = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Sign Up Successful!');
    };

    return (
        <div>
            <h1>Restaurant Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Restaurant Name:
                    <input type="text" name="restaurantName" required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;