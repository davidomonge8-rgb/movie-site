import React, { useState, useEffect } from 'react'
import Search from './components/search.jsx'
import Spinner from './components/spinner.jsx'
import MovieCard from './components/moviecard.jsx'
import debounce  from 'debounce'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }

}


function App() {

  const[searchTerm, setSearchTerm] = useState('')
  const[errorMessage, setErrorMessage] = useState(null);
  const[movieList, setMovieList] = useState([]);
  const[isLoading, setIsLoading] = useState(false);


  





  const fetchMovies = async (query = '')=>{
    setIsLoading(true);
    setErrorMessage(null);


    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      

      if(!response.ok){
        throw new Error('ERROR fetching movies');
      }

      const data = await response.json();
      
      if(data.response === 'False'){
        setErrorMessage(data.error || 'An error occurred while fetching movies.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);



    }catch(error){
      setErrorMessage('Failed to fetch movies. Please try again later.')
      console.error(`Error fetching movies:, ${error}`)

      
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchMovies(searchTerm);
  },[searchTerm])


  return (
    
<main>
    <div className='wrapper'>
    
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>Find <span className='text-gradient'>Movies</span> you'll enjoy without the hustle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-20'>All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ): errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie} />
              ))}
              </ul>
          )}
        </section>

      
    </div>
</main>
  )
}
 
export default App;