import React from 'react';
import {Route} from 'react-router-dom'
import NavBar from './Components/Navigation/Toolbar/Toolbar';
import Creator from './Containers/Creator/Creator';
import Viewer from './Containers/Viewer/Viewer';
import Editor from './Containers/Editor/Editor'

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Route path="/" exact component={Viewer}/>
      <Route path="/edit/:id" component={Editor}/>
      <Route path="/create" exact component={Creator}/>
  
    </div>
  );
}

export default App;
