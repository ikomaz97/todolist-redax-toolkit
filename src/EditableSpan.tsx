import {useState} from "react";

type Props = {
    value: string
}

export const EditableSpan = ({ value }: Props) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const turnOnEditMode = () => {
        setIsEditMode(true)
    }

    return (
        <>
            {isEditMode ? (
                <input value={value} autoFocus />
            ) : (
                <span onDoubleClick={turnOnEditMode}>{value}</span>
            )}
        </>
    )
}