export const bind = ([value, setValue]: [
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
]) => {
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
  }
}