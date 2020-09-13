import React, { useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import { Route, Redirect } from 'react-router-dom';
export default function ProtectedRoute({ children, ...props }) {

  const { isLogin } = useContext(UserContext)

  return isLogin ? (<Route {...props}>{children}</Route>) : (<Redirect to="/" />)
}
