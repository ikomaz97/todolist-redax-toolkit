import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"

import {
  useLoginMutation,
  useLazyGetCaptchaQuery,
} from "@/features/auth/api/authApi"

import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"

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
import { useState } from "react"

import styles from "./Login.module.css"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const [login] = useLoginMutation()
  const [getCaptcha] = useLazyGetCaptchaQuery()

  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null)
  const [loginError, setLoginError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: "",
    },
  })

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await login(data).unwrap()

      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))

        reset()
        setCaptchaUrl(null)
        setLoginError("")
      }

      if (res.resultCode === ResultCode.Error) {
        setLoginError(res.messages?.[0] || "Login error")
      }

      if (res.resultCode === ResultCode.CaptchaError) {
        const captcha = await getCaptcha().unwrap()
        setCaptchaUrl(captcha.url)
        setLoginError("Введите символы с картинки")
      }
    } catch {
      setLoginError("Network error")
    }
  }

  return (
    <Grid container justifyContent="center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: 400, width: "100%" }}
      >
        <FormControl fullWidth>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{
                  color: theme.palette.primary.main,
                  marginLeft: 5,
                }}
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
            />

            {errors.email && (
              <span className={styles.errorMessage}>
                {errors.email.message}
              </span>
            )}

            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
            />

            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} />
                  )}
                />
              }
            />

            {captchaUrl && (
              <>
                <img
                  src={captchaUrl}
                  alt="captcha"
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: "100%",
                  }}
                />

                <TextField
                  label="Enter symbols"
                  margin="normal"
                  {...register("captcha")}
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}