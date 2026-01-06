import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { selectThemeMode } from "@/app/app-slice"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas"

export const Login: React.FC = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit = (data: LoginInputs) => {
    console.log("Submit:", data)
    // reset() // по необходимости
  }

  return (
    <Grid container justifyContent={"center"}>
      <FormControl component="form" onSubmit={handleSubmit(onSubmit)}>
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

        <FormGroup>
          {/*<TextField*/}
          {/*  label="Email"*/}
          {/*  margin="normal"*/}
          {/*  {...register("email")}*/}
          {/*  error={!!errors.email}*/}
          {/*  helperText={errors.email?.message}*/}
          {/*/>*/}

          <TextField
            type="password"
            label="Password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                }
                label="Remember me"
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </FormGroup>
      </FormControl>
    </Grid>
  )
}
