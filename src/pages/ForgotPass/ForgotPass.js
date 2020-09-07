import React, { useEffect, useState } from 'react'
import { Input } from '../../components/form/Index'
import Button from '../../components/buttons/Button/Button'
import Spinner from '../../components/spinner/Spinner'
import axios from 'axios'
import './ForgotPass.js.scss'

const ForgotPass = ({ history }) => {

  const [userEmail, setUserEmail] = useState('')
  const [recover, setRecover] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (recover) {
      setTimeout(() => {
        history.push('/')
      }, 1500)
    }
  }, [recover])

  const recoverPassword = async (e) => {
    e.preventDefault()

    await axios
      .post(process.env.NODE_ENV !== 'production' ? '/auth/forgot-password' : 'https://quiick-281820.rj.r.appspot.com/auth/forgot-password', {
        email: userEmail
      })
      .then(res => {
        if (res.status === 200) {
          setRecover(true)
          console.log('Todo bien...')
        }
      })
      .catch(error => {
        console.log('Hubo un error: ', error.response)
      })
  }

  return (
    <div>
      {recover ? <Spinner /> : null}
      <div className="recover">
        <div className="recover__wrapper">
          <form onSubmit={recoverPassword}>
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
            <div className="form-account-submit__wrapper">
              <Button isSubject="primary" isType="submit" isText="Recuperar contraseña" />
            </div>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
