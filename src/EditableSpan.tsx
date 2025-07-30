import {ChangeEvent, useState} from "react";

type Props = {
    value: string
}

export const EditableSpan = ({ value }: Props) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [title, setTitle] = useState(value)

    const turnOnEditMode = () => {
        setIsEditMode(true)
    }
    const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }


    const turnOffEditMode = () => {
        setIsEditMode(false)
    }

    return (
        <>
            {isEditMode ? (
                <input value={title} onChange={changeTitle} onBlur={turnOffEditMode} autoFocus />
            ) : (
                <span onDoubleClick={turnOnEditMode}>{value}</span>
            )}
        </>
    )
}