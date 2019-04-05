import * as React from 'react'
import { SearchBar } from 'react-native-elements'
import { useGlobal } from 'reactn'

type Props = {
  containerStyle?: any
  inputContainerStyle?: any
  onChangeText: any
  onClear: any
  placeholder?: string
  value?: string
}

export const PVSearchBar = (props: Props) => {
  const { containerStyle, inputContainerStyle, onChangeText, onClear, placeholder, value } = props
  const [globalTheme] = useGlobal('globalTheme')

  return (
    <SearchBar
      clearIcon={true}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      onChangeText={onChangeText}
      onClear={onClear}
      placeholder={placeholder}
      searchIcon={true}
      style={globalTheme.textInput}
      value={value} />
  )
}
