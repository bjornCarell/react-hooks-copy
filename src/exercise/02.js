// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key);
    if (localStorageValue) {
      return deserialize(localStorageValue);
    }
    // We make the default value optionally a function. If it's 
    // computationally expensive we don't want it to have to be 
    // passed every single time.
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  // useRef gives an object we can mutate without triggering re-renders,
  // unlike useSate where re-render is triggered on every change
  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    // preKeyRef.current keeps track of our previous key
    const prevKey = prevKeyRef.current;
    // and if the previous key is not the same as the key passed as an argument
    // then we got a new key, and we want to change it in localstorage
    if (prevKey !== key) {
      // We change it by removing the previous key
      window.localStorage.removeItem(prevKey);
    }
    // then we assign the key passed as an argument to the previous key 
    prevKeyRef.current = key;
    // we set the key in localstorage
    window.localStorage.setItem(key, serialize(value));
  }, [key, value, serialize]);

  return [value, setValue];
};

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value);
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
