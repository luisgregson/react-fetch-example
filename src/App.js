import "./styles.css";
import { useState } from "react";

const DEFAULT_BREWERIES_STATE = {
  data: [],
  error: null,
  loading: false
};

export const App = () => {
  const [searchInput, setSearchInput] = useState("");
  const [breweries, setBreweries] = useState(DEFAULT_BREWERIES_STATE);

  const searchForBrewery = () => {
    // clear data and errors, and set loading state
    setBreweries({
      ...DEFAULT_BREWERIES_STATE,
      loading: true
    });

    // fetch breweries
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${searchInput}`)
      .then((response) => response.json())
      .then((breweriesResponse) => {
        if (Array.isArray(breweriesResponse) && breweriesResponse.length) {
          // clear loading and errors, and set data state
          setBreweries({
            ...DEFAULT_BREWERIES_STATE,
            // map breweries to just some useful fields
            data: breweriesResponse.map((brewery) => {
              return {
                id: brewery.id,
                name: brewery.name,
                websiteURL: brewery.website_url
              };
            })
          });
        } else {
          // unexpected response, clear loading and data, set error
          setBreweries({
            ...DEFAULT_BREWERIES_STATE,
            error: "No results found. Try another search."
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setBreweries({
          ...DEFAULT_BREWERIES_STATE,
          error: "An unexpected error occurred. Please try again later."
        });
      });
  };

  const handleSubmit = e => {
    e.preventDefault()
    searchForBrewery()
  }

  return (
    <div className="App">
      <h1>API Test with Data, Errors, and Loading</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="brewery">Search for a brewery: </label>
        <input
          name="brewery"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {breweries.loading && <p>Loading...</p>}
      {breweries.error && <p style={{ color: "red" }}>{breweries.error}</p>}
      {breweries.data.map((brewery) => (
        <div key={brewery.id}>
          <p>{brewery.name}</p>
          {brewery.websiteURL && (
            <a href={brewery.websiteURL} title={`${brewery.name} website`}>
              Website
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
