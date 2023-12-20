import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
// Import necessary dependencies

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    // Perform the search (you can replace this with your actual search logic)
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to YouTune!</h1>
      </header>

      <section className="main-section">
        <p>Discover amazing music and more!</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>
    </div>
  );
};

export default Home;