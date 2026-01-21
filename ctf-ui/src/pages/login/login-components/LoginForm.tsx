import React, { useEffect } from 'react'
import { Form, Input, Button, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { LoginRequestPayload } from '../Login.interface'
import styles from '../Login.module.scss'

interface LoginFormProps {
  onSubmit: (values: LoginRequestPayload) => void
  loading?: boolean
  error?: string | null
  onClearError?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error, onClearError }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    return () => {
      if (onClearError) {
        onClearError()
      }
    }
  }, [onClearError])

  const handleSubmit = (values: LoginRequestPayload) => {
    onSubmit(values)
  }

  const handleFormChange = () => {
    if (error && onClearError) {
      onClearError()
    }
  }

  return (
    <>
      {error && (
        <div className={styles.errorMessage}>
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={onClearError}
          />
        </div>
      )}

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters!' },
          ]}
        >
          <div>
            <label className={styles.formLabel}>Username</label>
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              className={styles.formInput}
              placeholder="admin"
              size="large"
              disabled={loading}
            />
          </div>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <div>
            <label className={styles.formLabel}>Password</label>
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              className={styles.formInput}
              placeholder="••••••••"
              size="large"
              disabled={loading}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={loading}
            disabled={loading}
            size="large"
            block
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm
