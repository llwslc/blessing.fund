import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Stores from '../stores';
import Home from './Home';
import About from './About';

class App extends React.Component {
  componentDidMount() {
    Stores.setTronLink();
  }

  render() {
    return (
      <Provider fund={Stores}>
        <Router>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
