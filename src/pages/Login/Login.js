import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../components/context/UserContext'
import Spinner from '../../components/spinner/Spinner'
import { Input } from '../../components/form/Index'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
import { faSadTear } from '@fortawesome/free-regular-svg-icons'
import './Login.scss'
import axios from 'axios'

const Login = ({ history }) => {

  const { user, setUser } = useContext(UserContext)
  const { isLogin, setIsLogin } = useContext(UserContext)
  const [userEmail, setUserEmail] = useState('')
  const [userPass, setUserPass] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        history.push('/pending-orders')
      }, 1500)
    }
  }, [user])
  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios
      .post(process.env.NODE_ENV !== 'production' ? '/auth/local' : 'https://quiick-281820.rj.r.appspot.com/auth/local', {
        identifier: userEmail,
        password: userPass
      })
      .then(res => {
        setUser(res.data)
        setIsLogin(true)
      })
      .catch(err => {
        setError(`Algo ha pasado ${err}`)
        console.log(error)
      })
  }

  return (
    <div>
      {isLogin ? <Spinner /> : null}
      <div className="login">
        <div className="login__wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-account-input__wrapper">
              <Input
                input_type="email"
                label_name="Correo"
                value_state={userEmail}
                input_error={setError}
                input_setState={setUserEmail}
                placeholder_content="joaquin@email.com"
              />
            </div>
            <div className="form-account-input__wrapper">
              <Input
                input_type="password"
                label_name="Contraseña"
                value_state={userPass}
                input_error={setError}
                input_setState={setUserPass}
              />
              <small className="form-account-forgotpassword"><Link to="/recover-password"><Icon faIcon={faSadTear} />Olvide mi contraseña</Link></small>
            </div>
            <div className="form-account-submit__wrapper">
              <Button isSubject="primary" isType="submit" isText="Entrar" />
            </div>
          </form>

          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;


