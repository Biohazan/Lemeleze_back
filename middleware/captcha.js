const axios = require('axios')

module.exports = (req, res, next) => {
  const captchaToken = JSON.parse(req.body.captchaToken)
  const captchaRequest = async () => {
    const res = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SITE_KEY}&response=${captchaToken}`
    )
    console.log(res)
    if (res.status === 200) {
      console.log(res)
      next()
    } else 
    throw new Error()
  }
  captchaRequest()
    .then()
    .catch(() => {
      res.status(400).json({ error: 'Il semblerai que vous soyez un robot' })
    })
}
