import React from 'react'
import Home from './layouts/Home/Home'
import Order from './pages/Order/Order'
import Delivery from './pages/Delivery/Delivery'
import Contact from './pages/Contact/Contact'
import Menu from './pages/Menu/Menu'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/order' exact component={Order} />
        <Route path='/delivery' exact component={Delivery} />
        <Route path='/contact' exact component={Contact} />
        <Route path='/menu' exact component={Menu} />
      </Switch>
    </Router>
  );
}

export default App;
