import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../helpers/utils";
import "@styles/SearchBarSelectPokemon.css";
import { useBattleContext } from "../context/battleContext";
import { FaCheckCircle } from "react-icons/fa";
import { MutatingDots } from "react-loader-spinner";
import { searchPokemonApi } from "../../services/searchPokemonApi";

const SearchBarSelectPokemon = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleSelectedPokemons, selectedPokemons } = useBattleContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchPokemonApi(searchTerm);
        setSearchResults([response]);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="search-select">
      <p className="input-search-text">Search by name or Id</p>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="pikachu, 25"
      />
      {loading && (
        <div className="loader-container">
          <MutatingDots
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="three-dots-loading"
            wrapperStyle={{ textAlign: "center" }}
          />
        </div>
      )}
      {searchResults.length === 0 && (
        <p className="no-result-text">No results found</p>
      )}
      {error && <p className="error-text">{error}</p>}
      <ul>
        {searchResults.map((pokemon) => (
          <li key={pokemon.id} onClick={() => handleSelectedPokemons(pokemon)}>
            <img
              loading="lazy"
              src={
                pokemon.sprites.other["showdown"].front_default ||
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default
              }
            />
            {capitalizeFirstLetter(pokemon.name)}
            {selectedPokemons.find(
              (selectedPokemon) => selectedPokemon.id === pokemon.id
            ) && (
              <div className="selected-pokemon">
                <FaCheckCircle className="check-icon" size={35} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBarSelectPokemon;
