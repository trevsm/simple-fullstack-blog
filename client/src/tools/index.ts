export const bind = ([value, setValue]: [
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
], onChange?:()=>void) => {
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange()
      setValue(e.target.value)
    }
  }
}