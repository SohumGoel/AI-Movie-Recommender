import React, { useState } from 'react';
import './App.css';
import { googleLogout, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


function App() {
  const [movies, setMovies] = useState([
    { title: '', rating: 0 },
    { title: '', rating: 0 },
    { title: '', rating: 0 }
  ]);
  const [recommendations, setRecommendations] = useState('');
  const [hasClickedRecommend, setHasClickedRecommend] = useState(false);
  const [user, setUser] = useState(null);  // Track logged-in user state

  const handleLoginSuccess = (credentialResponse) => {
    const userData = jwtDecode(credentialResponse.credential);
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null); // Reset user state on logout
    resetForm();  // Reset form and recommendations
    console.log('User logged out');
  };

  // Function to reset form inputs and recommendations
  const resetForm = () => {
    setMovies([
      { title: '', rating: 0 },
      { title: '', rating: 0 },
      { title: '', rating: 0 }
    ]);
    setRecommendations('');
    setHasClickedRecommend(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/get-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        <div className="container">

            {/* Google Login */}
          {!user ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          ) : (
            <div>
              <h2>Welcome, {user.name}</h2>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

           {user && (
              <form onSubmit={e => e.preventDefault()} className="movie-form">
                {movies.map((movie, index) => (
                  <div key={index}>
                    <input
                      placeholder="Movie title"
                      value={movie.title}
                      onChange={e => handleInputChange(index, 'title', e.target.value)}
                    />
                    <div className="starRating">
                      {[1, 2, 3, 4, 5].map(starNumber => (
                        <span
                          key={starNumber}
                          onClick={() => handleStarClick(index, starNumber)}
                        >
                          {starNumber <= movie.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleSubmit}>Get Recommendations</button>
              </form>
           )}

              {/* Recommendations Section */}
              {user && hasClickedRecommend && (
                <div className="recommendations">     
                  <h2>Recommendations:</h2>
                  <ul>
                    {recommendations.split('\n').map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
