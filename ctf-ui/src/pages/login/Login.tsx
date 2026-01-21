import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import LoginForm from './login-components/LoginForm'
import { LoginRequestPayload } from './Login.interface'
import styles from './Login.module.scss'
import { authActions } from './Login.reducer'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { loading, error } = useAppSelector(state => state.auth.login)
  const { isAuthenticated } = useAppSelector(state => state.auth)
  
  const loginData = useAppSelector(state => state.auth.login.data)

  useEffect(() => {
    if (loginData && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [loginData, isAuthenticated, navigate])

  const handleLogin = (values: LoginRequestPayload) => {
    dispatch(
      authActions.requestLogin({
        username: values.username,
        password: values.password,
      }),
    )
  }


  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <img
            src={`${import.meta.env.BASE_URL}resources/images/product_text_logo.png`}
            alt="CTF Logo"
            style={{ width: '100%', height: '150px' }}
            className={styles.logoImage}
          />
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>

        <p className={styles.footer}>© 2025 Continuous Testing Framework. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Login
