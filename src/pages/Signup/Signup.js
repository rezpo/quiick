import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import Spinner from '../../components/spinner/Spinner'
import { Input } from '../../components/form/Index'
import Button from '../../components/buttons/Button/Button'
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
        if (res.data.message) {
          setError(res.data.message[0].messages[0].message)
          return
        }
      })
      .catch(err => {
        setError(`Algo ha pasado ${err}`)
      })

  }

  return (
    <div className="login">
      <div className="login__wrapper">
        <form onSubmit={handleSubmit}>
          <div className="form-account-input__wrapper" >
            <Input
              input_type="email"
              label_name="Correo"
              value_state={userEmail}
              input_error={setError}
              input_setState={setUserEmail}
              placeholder_content="joaquin@email.com"
            />
          </div>
          <div className="form-account-input__wrapper" >
            <Input
              input_type="password"
              label_name="Contraseña"
              value_state={userPass}
              input_error={setError}
              input_setState={setUserPass}
            />
          </div>
          <div className="form-account-submit__wrapper">
            <Button isSubject="primary" isType="submit" isText="Registrar" />
          </div>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default Signup;
