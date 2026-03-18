import { setIsLoggedInAC } from "@/app/app-slice"
import { ResultCode } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import { useLoginMutation, useLazyGetCaptchaQuery } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import Alert from "@mui/material/Alert"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import { useTheme } from "@mui/material/styles"
import { StyledTextField } from "./Login.styled"
import styles from "./Login.module.css"

export const Login = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isLight = theme.palette.mode === "light"

  const [login] = useLoginMutation()
  const [getCaptcha] = useLazyGetCaptchaQuery()

  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null)
  const [loginError, setLoginError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "free@samuraijs.com",
      password: "free",
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, width: "100%" }}>
        <FormControl fullWidth>
          <FormLabel sx={{ color: isLight ? "#01579B" : "#B3E5FC" }}>
            <p>
              To login get registered
              <a
                style={{
                  color: "#0288D1",
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
            {/* Email поле */}
            <StyledTextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />

            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

            {/* Password поле с глазом */}
            <StyledTextField
              type={showPassword ? "text" : "password"}
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{
                          color: isLight ? "#01579B" : "#B3E5FC",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      sx={{
                        color: isLight ? "#01579B" : "#B3E5FC",
                      }}
                    />
                  )}
                />
              }
              sx={{
                color: isLight ? "#01579B" : "#B3E5FC",
              }}
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
                <StyledTextField label="Enter symbols" margin="normal" {...register("captcha")} />
              </>
            )}

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
