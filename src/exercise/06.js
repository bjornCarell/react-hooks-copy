// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon';

const ErrorFallback = ({error, resetErrorBoundary}) => (
  <div>
    <p>Something went wrong:</p>
    <pre style={{whiteSpace: 'pre-wrap'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

function PokemonInfo({pokemonName}) {
  const IDLE = 'no request made yet';
  const PENDING = 'request started';
  const RESOLVED = 'request successful';
  const REJECTED = 'request rejected';

  const [state, setState] = React.useState({
    pokemon: null,
    error: undefined,
    status: IDLE,
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({status: PENDING});
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({
          pokemon: pokemonData,
          status: RESOLVED,
        });
      },
      err => {
        setState({
          error: err,
          status: REJECTED,
        });
      },
    );
  }, [pokemonName]);

  switch (state.status) {
    case PENDING:
      return <PokemonInfoFallback name={pokemonName} />;
    case RESOLVED:
      return <PokemonDataView pokemon={state.pokemon} />;
    case REJECTED:
      throw new Error(state.error.message);
    default:
      return 'Submit a pokemon';
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
