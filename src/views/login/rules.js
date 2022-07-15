export const mobileRules = [
  { required: true, message: '请输入手机号' },
  {
    pattern: /^1[0-9]\d{9}$/,
    message: '手机号码格式不正确！',
    trigger: 'onChange'
  }
]

export const codeRules = [
  { required: true, message: '请输入验证码' },
  {
    pattern: /^[0-9]{6}/,
    message: '验证码必须为6位数字！',
    trigger: 'onChange'
  }
]
