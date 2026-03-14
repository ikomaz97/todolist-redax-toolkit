import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { Captcha } from "@/features/auth/ui/Captcha/Captcha"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { useRef, useState } from "react"
import type ReCAPTCHA from "react-google-recaptcha"
import styles from "./Login.module.css"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()
  const theme = getTheme(themeMode)

  const [captchaRequired, setCaptchaRequired] = useState(false)
  const [loginError, setLoginError] = useState("")
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: ""
    },
  })

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await login(data).unwrap()

      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.token)
        reset()
        setCaptchaRequired(false)
        setLoginError("")
      }
    } catch (err: any) {
      if (err.data?.resultCode === 10 || err.data?.error === "Captcha is required") {
        setCaptchaRequired(true)
        setLoginError("Требуется подтверждение, что вы не робот")
      } else {
        setLoginError(err.data?.messages?.[0] || "Ошибка входа")
      }

      recaptchaRef.current?.reset()
      setValue("captcha", "")
    }
  }

  const handleCaptchaChange = (token: string | null) => {
    setValue("captcha", token || "")
    if (token) {
      setLoginError("")
    }
  }

  const handleCaptchaExpired = () => {
    setValue("captcha", "")
    setLoginError("Время капчи истекло, подтвердите снова")
  }

  const handleCaptchaError = () => {
    setLoginError("Ошибка загрузки капчи, попробуйте обновить страницу")
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "400px", width: "100%" }}>
        <FormControl fullWidth>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <FormGroup>
            <TextField
              label="Email"
              margin="normal"
              error={!!errors.email}
              {...register("email")}
              disabled={captchaRequired}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
              disabled={captchaRequired}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <Checkbox {...field} checked={value} disabled={captchaRequired} />
                  )}
                />
              }
            />

            {captchaRequired && (
              <div style={{ margin: "15px 0", display: "flex", justifyContent: "center" }}>
                <Captcha
                  ref={recaptchaRef}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                  onErrored={handleCaptchaError}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={captchaRequired && !recaptchaRef.current?.getValue()}
            >
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}