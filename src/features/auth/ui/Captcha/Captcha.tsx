// src/features/auth/ui/Captcha/Captcha.tsx
import ReCAPTCHA from "react-google-recaptcha"
import { forwardRef } from "react"

type Props = {
  onChange: (token: string | null) => void
  onExpired?: () => void
  onErrored?: () => void
}

export const Captcha = forwardRef<ReCAPTCHA, Props>(({ onChange, onExpired, onErrored }, ref) => {
  return (
    <ReCAPTCHA
      ref={ref}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={onChange}
      onExpired={onExpired}
      onErrored={onErrored}
      hl="ru"
      theme="light"
    />
  )
})

Captcha.displayName = "Captcha"