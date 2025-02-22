import React from 'react'
import { Pressable } from 'react-native'

type Props = {
  children: any
  onPress: any
  style?: any
}

export const PressableWithOpacity = (props: Props) => {
  return (
    <Pressable {...props} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }, props.style]}>
      {props.children}
    </Pressable>
  )
}
