import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { TextField, Grid, FormControl, FormGroup, Button } from "@mui/material"
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas"

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    // при желании можно включить триггеры: mode: 'onBlur' | 'onChange'
  })

  const onSubmit = (data: LoginInputs) => {
    console.log(data)
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormGroup>
            <TextField
              label="Email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email ? String(errors.email.message) : ""}
              {...register("email")}
            />

            <TextField
              label="Пароль"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password ? String(errors.password.message) : ""}
              {...register("password")}
            />

            {/* пример для чекбокса: */}
            {/* <Controller ... /> или register('rememberMe') с Checkbox */}

            <Button type="submit">Войти</Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
