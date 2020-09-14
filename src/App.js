import React from 'react'
import Home from './layouts/Home/Home'
import Order from './pages/Order/Order'
import Delivery from './pages/Delivery/Delivery'
import Contact from './pages/Contact/Contact'
import Success from './pages/Success/Success'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Notfound from './pages/Notfound/Notfound'
import ForgotPass from './pages/ForgotPass/ForgotPass'
import Account from './pages/Account/Account'
import Wrapper from './components/wrapper/Wrapper'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'

function App() {
  return (
    <Router>
      <Wrapper>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/:restaurant/:tableId/order' exact component={Order} />
          <Route path='/delivery' exact component={Delivery} />
          <Route path='/contact' exact component={Contact} />
          <Route path='/success' exact component={Success} />
          <Route path='/login' exact component={Login} />
          <Route path='/signup' exact component={Signup} />
          <Route path='/recover-password' exact component={ForgotPass} />
          <ProtectedRoute path='/:userid/:username/account' exact component={Account} />
          <Route component={Notfound} />
        </Switch>
      </Wrapper>
    </Router>
  );
}

export default App;

