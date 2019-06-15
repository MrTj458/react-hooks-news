import React from "react"
import { Link } from 'react-router-dom'
import useFormValidation from './useFormValidation'
import validateLogin from './validateLogin'
import firebase from '../../firebase'

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
}

function Login(props) {
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser)
  const [login, setLogin] = React.useState(true)
  const [firebaseError, setFirebaseError] = React.useState(null)

  async function authenticateUser() {
    const { name, email, password } = values
    try {
      login ? await firebase.login(email, password) : await firebase.register(name, email, password)
      props.history.push('/')
    } catch (err) {
      console.error('Authentication Error', err)
      setFirebaseError(err.message)
    }
  }
  
  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && 
          <input
            onChange={handleChange}
            value={values.name}
            name="name"
            type="text"
            placeholder="Your Name"
            autoComplete="off"
          />
        }
        <input
          onChange={handleChange}
          value={values.email}
          name="email"
          type="email"
          placeholder="Your Email"
          autoComplete="off"
          className={errors.email && 'error-input'}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          value={values.password}
          name="password"
          type="password"
          placeholder="Choose a secure password"
          className={errors.password && 'error-input'}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmitting}
            style={{ background: isSubmitting ? "grey" : "orange" }}
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            {login ? "Need to create an account?" : "Already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot Password?</Link>
      </div>
    </div>
  )
}

export default Login
