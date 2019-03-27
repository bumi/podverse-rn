import React from 'reactn'
import { Text, View } from '../components'
import { core } from '../styles'

type Props = {
  navigation?: any
}

type State = {}

export class DownloadsScreen extends React.Component<Props, State> {

  static navigationOptions = {
    title: 'Downloads'
  }

  render() {
    const { globalTheme } = this.global

    return (
      <View style={core.view}>
        <Text style={globalTheme.text}>Downloads</Text>
      </View>
    )
  }
}
