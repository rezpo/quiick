import React from 'react'
import Home from './layouts/Home/Home'
import Order from './pages/Order/Order'
import Delivery from './pages/Delivery/Delivery'
import Contact from './pages/Contact/Contact'
import Menu from './pages/Menu/Menu'
import Success from './pages/Success/Success'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import PendingOrders from './pages/PendingOrders/PendingOrders'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
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
        <Route path='/success' exact component={Success} />
        <Route path='/login-orders' exact component={Login} />
        <Route path='/signup-chief' exact component={Signup} />
        {/* <ProtectedRoute path='/pending-orders' exact component={PendingOrders} /> */}
        <Route path='/pending-orders' exact component={PendingOrders} />
      </Switch>
    </Router>
  );
}

export default App;
