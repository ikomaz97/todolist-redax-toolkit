import './App.css'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {Header} from "@/common/components/Header/Header.tsx";
import {Main} from "@/app/Main.tsx";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {selectThemeMode} from "@/app/app-selectors.ts";
import {getTheme} from "@/common/theme/theme.ts";

// Добавьте определение типа FilterValues
export type FilterValues = 'all' | 'active' | 'completed'

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  return (
      <ThemeProvider theme={theme}>
        <div className={'app'}>
          <CssBaseline />
          <Header/>
          <Main/>
        </div>
      </ThemeProvider>
  )
}