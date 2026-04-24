import { apiRequest } from '@lightfish/server/api'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Form, Input, message } from 'antd'

import "./index.css";
import { useSearchParams } from 'react-router-dom';

type LoginFormValues = {
  username: string
  password: string
  remember?: boolean
}

type LoginResponse = {
  success: boolean
  message: string,
  data: {
    isNew:boolean,
    userInfo: {
      id: number,
      username: string
    }
  }
}

function setUrlParam(key: string, value: string, targetUrl: string = location.href) {
  const url = new URL(targetUrl)
  url.searchParams.set(key, value)
  return url.toString()
}

export default function Login() {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [searchParams] = useSearchParams()
  const redirect = decodeURIComponent(searchParams.get('redirect') || '')

  const { runAsync, loading } = useRequest(async (values: LoginFormValues) => {
    const {success, data, message} = await apiRequest<LoginResponse>('/api/account/login', {
      method: 'POST',
      data: {
        username: values.username,
        password: values.password,
      },
    })

    if (success) {
      messageApi.success(data.isNew ? `用户 "${data.userInfo.username}" 已创建并登录`: '登录成功')
      if (redirect) {
        if (redirect.startsWith('http')) {
          location.href = setUrlParam('token', data.userInfo.id.toString(), redirect)
        } else {
          location.href = redirect
        }
      }
      return
    }

    messageApi.error(message || '登录失败！')
  }, {
    manual: true,
  })

  const handleFinish = async (values: LoginFormValues) => {
    await runAsync(values)
  }

  return (
    <main className="lf-login-page">
      {messageContextHolder}
      <div className="lf-login-background" aria-hidden="true">
        <span className="lf-login-orb lf-login-orb--violet" />
        <span className="lf-login-orb lf-login-orb--blue" />
        <span className="lf-login-grid" />
      </div>

      <section className="lf-login-card" aria-label="登录表单">
        <header className="lf-login-header">
          <p className="lf-login-tag">LIGHTFISH ACCOUNT</p>
          <h1>欢迎回来</h1>
          <p>登录后可继续访问你的工作空间与账户配置。</p>
          <p>提示：未注册的用户名会在首次登录时自动注册。</p>
        </header>

        <Form<LoginFormValues>
          className="lf-login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleFinish}
        >
          <Form.Item
            className="lf-field"
            label={<span>用户名</span>}
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
            ]}
          >
            <Input
              size="large"
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            className="lf-field"
            label={<span>密码</span>}
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className="lf-login-form-extra">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="lf-checkbox">记住我</Checkbox>
            </Form.Item>
            <button type="button" className="lf-link-button">
              忘记密码？
            </button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="lf-login-submit"
            loading={loading}
            block
            size="large"
          >
            立即登录
          </Button>
        </Form>
      </section>
    </main>
  )
}