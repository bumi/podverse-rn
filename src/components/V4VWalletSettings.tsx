import { Keyboard, StyleSheet } from 'react-native'
import React from 'reactn'
import { translate } from '../lib/i18n'
import { PV } from '../resources'
import {
  MINIMUM_APP_BOOST_PAYMENT,
  MINIMUM_APP_STREAMING_PAYMENT,
  MINIMUM_BOOST_PAYMENT,
  MINIMUM_STREAMING_PAYMENT,
  v4vGetPluralCurrencyUnit,
  v4vGetTypeMethodKey
} from '../services/v4v/v4v'
import {
  V4VProviderConnectedState,
  v4vUpdateTypeMethodSettingsAppBoostAmount,
  v4vUpdateTypeMethodSettingsAppStreamingAmount,
  v4vUpdateTypeMethodSettingsBoostAmount,
  v4vUpdateTypeMethodSettingsStreamingAmount
} from '../state/actions/v4v/v4v'
import { core } from '../styles'
import { Text, TextInput, View } from '.'

type Props = {
  navigation: any
  provider: V4VProviderConnectedState
  testID: string
}

type State = {
  localBoostAmount: string
  localStreamingAmount: string
  localAppBoostAmount: string
  localAppStreamingAmount: string
}

export class V4VWalletSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      localBoostAmount: '0',
      localStreamingAmount: '0',
      localAppBoostAmount: '0',
      localAppStreamingAmount: '0'
    }
  }

  componentDidMount() {
    const { provider } = this.props
    const { method, type } = provider
    const typeMethodKey = v4vGetTypeMethodKey(type, method)
    const typeMethodSettings = this.global.session.v4v.settings.typeMethod[typeMethodKey]

    if (typeMethodSettings) {
      this.setState({
        localBoostAmount: typeMethodSettings.boostAmount,
        localStreamingAmount: typeMethodSettings.streamingAmount,
        localAppBoostAmount: typeMethodSettings.appBoostAmount,
        localAppStreamingAmount: typeMethodSettings.appStreamingAmount
      })
    }
  }

  render() {
    const { provider, testID } = this.props
    const { method, type } = provider
    const { localBoostAmount } = this.state
    const { session } = this.global
    const typeMethodKey = v4vGetTypeMethodKey(type, method)
    const typeMethodSettings = session.v4v.settings.typeMethod[typeMethodKey]

    if (!typeMethodSettings) return null

    const boostAmountText = `${translate('Boost Amount')} (${v4vGetPluralCurrencyUnit(provider.unit)})`
    // const streamingAmountText = `${translate('Streaming Amount')} (${v4vGetPluralCurrencyUnit(provider.unit)})`

    return (
      <View>
        <View style={styles.sectionWrapper}>
          <Text style={core.headerText}>{translate('Podcaster')}</Text>
          <Text style={styles.explanationText}>{translate('Boost podcaster explanation')}</Text>
          <TextInput
            alwaysShowEyebrow
            eyebrowTitle={boostAmountText}
            keyboardType='numeric'
            onBlur={async () => {
              const { localBoostAmount } = this.state
              if (Number(localBoostAmount) && Number(localBoostAmount) > MINIMUM_BOOST_PAYMENT) {
                await v4vUpdateTypeMethodSettingsBoostAmount(this.global, type, method, Number(localBoostAmount))
              } else {
                await v4vUpdateTypeMethodSettingsBoostAmount(this.global, type, method, MINIMUM_BOOST_PAYMENT)
                this.setState({ localBoostAmount: MINIMUM_BOOST_PAYMENT.toString() })
              }
            }}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(newText: string) => {
              this.setState({ localBoostAmount: newText })
            }}
            testID={`${testID}_boost_amount_text_input`}
            value={`${localBoostAmount}`}
            wrapperStyle={styles.textInputWrapper}
          />
          {/* <TextInput
            alwaysShowEyebrow
            eyebrowTitle={streamingAmountText}
            keyboardType='numeric'
            onBlur={async () => {
              const { localStreamingAmount } = this.state
              if (Number(localStreamingAmount) && Number(localStreamingAmount) > MINIMUM_STREAMING_PAYMENT) {
                await v4vUpdateTypeMethodSettingsStreamingAmount(
                  this.global,
                  type,
                  method,
                  Number(localStreamingAmount)
                )
              } else {
                await v4vUpdateTypeMethodSettingsStreamingAmount(this.global, type, method, MINIMUM_STREAMING_PAYMENT)
                this.setState({ localStreamingAmount: MINIMUM_STREAMING_PAYMENT.toString() })
              }
            }}
            onChangeText={(newText: string) => {
              this.setState({ localStreamingAmount: newText })
            }}
            onSubmitEditing={() => Keyboard.dismiss()}
            testID={`${testID}_streaming_amount_text_input`}
            value={`${localStreamingAmount}`}
            wrapperStyle={styles.textInputWrapper}
          /> */}
        </View>
        {/* <View style={styles.sectionWrapper}>
          <Text style={core.headerText}>{translate('App')}</Text>
          <Text style={styles.explanationText}>{translate('Boost app explanation')}</Text>
          <TextInput
            alwaysShowEyebrow
            eyebrowTitle={boostAmountText}
            keyboardType='numeric'
            onBlur={async () => {
              const { localAppBoostAmount } = this.state
              if (Number(localAppBoostAmount) && Number(localAppBoostAmount) > MINIMUM_APP_BOOST_PAYMENT) {
                await v4vUpdateTypeMethodSettingsAppBoostAmount(this.global, type, method, Number(localAppBoostAmount))
              } else {
                await v4vUpdateTypeMethodSettingsAppBoostAmount(this.global, type, method, MINIMUM_APP_BOOST_PAYMENT)
                this.setState({ localBoostAmount: MINIMUM_APP_BOOST_PAYMENT.toString() })
              }
            }}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(newText: string) => {
              this.setState({ localAppBoostAmount: newText })
            }}
            testID={`${testID}_app_boost_amount_text_input`}
            value={`${localAppBoostAmount}`}
            wrapperStyle={styles.textInputWrapper}
          />
          <TextInput
            alwaysShowEyebrow
            eyebrowTitle={streamingAmountText}
            keyboardType='numeric'
            onBlur={async() => {
              const { localAppStreamingAmount } = this.state
              if (Number(localAppStreamingAmount) && Number(localAppStreamingAmount) > MINIMUM_APP_STREAMING_PAYMENT) {
                await v4vUpdateTypeMethodSettingsAppStreamingAmount(
                  this.global, type, method, Number(localAppStreamingAmount))
              } else {
                await v4vUpdateTypeMethodSettingsAppStreamingAmount(
                  this.global, type, method, MINIMUM_APP_STREAMING_PAYMENT)
                this.setState({ localAppStreamingAmount: MINIMUM_APP_STREAMING_PAYMENT.toString() })
              }
            }}
            onChangeText={(newText: string) => {
              this.setState({ localAppStreamingAmount: newText })
            }}
            onSubmitEditing={() => Keyboard.dismiss()}
            testID={`${testID}_app_streaming_amount_text_input`}
            value={`${localAppStreamingAmount}`}
            wrapperStyle={styles.textInputWrapper}
          />
        </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15
  },
  explanationText: {
    fontSize: PV.Fonts.sizes.xl,
    marginBottom: 24
  },
  sectionWrapper: {
    marginBottom: 12
  },
  switchWithTextWrapper: {
    marginBottom: 28,
    marginTop: 8
  },
  text: {
    fontSize: PV.Fonts.sizes.xxl
  },
  textInputWrapper: {
    marginTop: 0,
    marginBottom: 24
  }
})
