import React, {createContext, useState} from 'react'

export const UserContext = createContext(null)
export default ({children}) => {

  const [user, setUser] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [isLogin, setIsLogin] = useState(false)

  return(
    <UserContext.Provider value={{user, setUser, userToken, setUserToken, isLogin, setIsLogin}}>
      {children}
    </UserContext.Provider>
  )
}
