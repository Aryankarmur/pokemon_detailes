import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
  const api = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=124";

  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const fetchpokemon = async () => {
    try {
      const resp = await fetch(api);
      const data = await resp.json();
      const detailedPokeData = data.results.map(async (resData) => {
        const pokeUrlfetch = await fetch(resData.url);
        const pokeData = await pokeUrlfetch.json();
        return pokeData;
      });
      // console.log(detailedPokeData);
      const pokeDataResp = await Promise.all(detailedPokeData);
      console.log(pokeDataResp);
      setPokemon(pokeDataResp);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      setError(error)
    }
  };

  useEffect(() => {
    fetchpokemon();
  }, []);

  // search funtionality
    const searchData = pokemon.filter((curPokemon)=>curPokemon.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    )
  }
  
  if (error) {
    return (
      <div>
        <h1>Error: {error.message} </h1>
      </div>
    )  
  }

  return (
    <>
      <section className="container">
        <header>
          <h1>Lets catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input type="text" placeholder="search Pokemon" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div>
          <ul className="cards">
            {searchData.map((curPokemon) => {
              return (
                  <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
                  
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};
