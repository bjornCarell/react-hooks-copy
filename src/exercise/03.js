// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react';

const Name = () => {
  const [name, setName] = React.useState('');

  return (
    <div>
      <label htmlFor="name">Name</label>
      <input
        value={name}
        id="name"
        onChange={event => setName(event.target.value)}
      />
    </div>
  );
};

const FavoriteAnimal = ({animal, onAnimalChange}) => (
  <div>
    <label htmlFor="animal">Favorite Animal</label>
    <input value={animal} id="animal" onChange={onAnimalChange} />
  </div>
);

const Display = ({animal}) => (
  <div>{`Your favorite animal is: ${animal}!`}</div>
);

function App() {
  const [animal, setAnimal] = React.useState('');
  return (
    <form>
      <Name />
      <FavoriteAnimal
        animal={animal}
        onAnimalChange={event => setAnimal(event.target.value)}
      />
      <Display animal={animal} />
    </form>
  );
}

export default App;
