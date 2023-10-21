import React, { useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([
    { title: '', rating: 0 },
    { title: '', rating: 0 },
    { title: '', rating: 0 }
  ]);
  const [recommendations, setRecommendations] = useState('');
  const [hasClickedRecommend, setHasClickedRecommend] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/get-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // You can send movie data to your backend if needed
        // body: JSON.stringify({ movies: movies })
        body: JSON.stringify({ movies: movies })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        setHasClickedRecommend(true);
      } else {
        console.error('Failed to retrieve recommendations');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className='pageTitle'>Movie Recommendation</p>
        <form onSubmit={e => e.preventDefault()}>
          {movies.map((movie, index) => (
            <div key={index}>
              <input
                placeholder="Movie title"
                value={movie.title}
                onChange={e => handleInputChange(index, 'title', e.target.value)}
              />
              <div>
                {[1, 2, 3, 4, 5].map(starNumber => (
                  <span
                    key={starNumber}
                    onClick={() => handleStarClick(index, starNumber)}
                    style={{ cursor: 'pointer' }}
                  >
                    {starNumber <= movie.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit}>Get Recommendations</button>
        </form>

        {hasClickedRecommend && (
          <div>
            <h2>Recommendations:</h2>
            <p>{recommendations}</p>
          </div>
        )}
      </header>
    </div>
  );

  function handleInputChange(index, field, value) {
    const newMovies = [...movies];
    newMovies[index][field] = value;
    setMovies(newMovies);
  }

  function handleStarClick(index, starNumber) {
    handleInputChange(index, 'rating', starNumber);
  }
}

export default App;
