import {type ChangeEvent, type KeyboardEvent, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
type Props = {
  onCreateItem: (title: string) => void
}

export const CreateItemForm = ({ onCreateItem }: Props) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== '') {
      onCreateItem(trimmedTitle)
      setTitle('')
    } else {
      setError('Title is required')
    }
  }

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
    setError(null)
  }

  const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createItemHandler()
    }
  }

  return (
      <div>
        <TextField label={'Enter a title'}
                   variant={'outlined'}
                   className={error ? 'error' : ''}
                   value={title}
                   size={'small'}
                   onChange={changeTitleHandler}
                   onKeyDown={createItemOnEnterHandler}/>
        <Button variant="contained" onClick={createItemHandler}>+</Button>

        {error && <div className={'error-message'}>{error}</div>}
      </div>
  )
}