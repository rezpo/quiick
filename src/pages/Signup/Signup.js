import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import Wrapper from '../../components/wrapper/Wrapper'
import axios from 'axios'

const Signup = ({ history }) => {

  const { user, setUser } = useContext(UserContext)
  const [userEmail, setUserEmail] = useState('')
  const [userPass, setUserPass] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [user])
  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios
      .post(process.env.NODE_ENV !== 'production' ? '/auth/local/register' : 'https://quiick-281820.rj.r.appspot.com/auth/local/register', {
        username: userEmail,
        email: userEmail,
        password: userPass
      })
      .then(res => {
        setUser(res)
        if(res.data.message){
          setError(res.data.message[0].messages[0].message)
          return
        }
      })
      .catch(err => {
        setError(`Algo ha pasado ${err}`)
      })

  }

  return (
    <Wrapper>
      <div className="login">
        <div className="login__wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input__wrapper" >
              <label> Usuario o correo </label>
              <input
                type="email"
                value={userEmail}
                placeholder="Joaquín"
                onChange={(e) => {
                  setError('')
                  setUserEmail(e.target.value)
                }}
              /> </div>
            <div className="input__wrapper" >
              <label> Constraseña </label>
              <input
                type="password"
                value={userPass}
                onChange={(e) => {
                  setError('')
                  setUserPass(e.target.value)
                }}
              /> </div>
            <div className="submit__wrapper">
              <button>Registrar</button>
            </div>
          </form>

          {error && <p>{error}</p>}
        </div>
      </div>
    </Wrapper>
  );
}

export default Signup;
