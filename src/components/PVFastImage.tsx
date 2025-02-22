import { isValidUrl, ValueTag } from 'podverse-shared'
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import { SvgUri } from 'react-native-svg'
import React from 'reactn'
import { downloadImageFile, getSavedImageUri } from '../lib/storage'
import { PV } from '../resources'
import { LightningIcon, NewContentBadge, Text } from '.'
const PlaceholderImage = PV.Images.PLACEHOLDER.default

type Props = {
  accessible?: boolean
  allowFullView?: boolean
  cache?: string
  isSmall?: boolean
  newContentCount?: number
  placeholderLabel?: string
  resizeMode?: any
  source?: string
  styles?: any
  // valueTags are used for rendering a lightning icon
  valueTags?: ValueTag[] | null
}

type State = {
  hasError: boolean
  localImageSource: { exists: boolean; imageUrl: string | null }
}

export class PVFastImage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      localImageSource: { imageUrl: props.source || null, exists: false }
    }
  }

  componentDidMount() {
    this._loadImage()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps?.source !== this.props.source) {
      this._loadImage()
    }
  }

  _handleError = () => {
    const { localImageSource } = this.state
    if (!localImageSource?.exists) {
      this.setState({ hasError: true })
    }
  }

  _loadImage = async () => {
    const { source } = this.props
    if (source) {
      const savedImageResults = await getSavedImageUri(source)
      if (savedImageResults.exists) {
        this.setState({ hasError: false, localImageSource: savedImageResults }, () => {
          ;(async () => {
            await downloadImageFile(source)
            const latestSavedImageResults = await getSavedImageUri(source)
            this.setState({
              hasError: false,
              localImageSource: latestSavedImageResults
            })
          })()
        })
      } else {
        await downloadImageFile(source)
        const savedImageResults = await getSavedImageUri(source)
        this.setState({
          hasError: false,
          localImageSource: savedImageResults
        })
      }
    }
  }

  _showImageFullView = () => {
    const { source } = this.props

    this.setGlobal({
      imageFullViewSourceUrl: source,
      imageFullViewShow: true
    })
  }

  render() {
    const { accessible = false, allowFullView, newContentCount,
    placeholderLabel, resizeMode = 'contain', source, styles, valueTags } = this.props
    const { hasError, localImageSource } = this.state
    const { hideNewEpisodesBadges, session, userAgent } = this.global
    const showLightningIcons = session?.v4v?.showLightningIcons
    let imageSource = source
    let isValid = false
    if (localImageSource.exists) {
      imageSource = 'file://' + localImageSource.imageUrl
      isValid = true
    } else {
      isValid = isValidUrl(imageSource)

      /* Insecure images will not load on iOS, so force image URLs to https */
      if (Platform.OS === 'ios' && imageSource) {
        imageSource = imageSource.replace('http://', 'https://')
      }
    }
    const isSvg = imageSource && imageSource.endsWith('.svg')

    const image = isSvg ? (
      <Pressable disabled={!allowFullView} onPress={this._showImageFullView}>
        <View style={styles}>
          <SvgUri
            accessible={accessible}
            key={imageSource}
            width='100%'
            height='100%'
            uri={imageSource || null}
          />
        </View>
      </Pressable>
    ) : (
      <Pressable disabled={!allowFullView} onPress={this._showImageFullView}>
        <View style={styles}>
          <Image
            accessible={accessible}
            key={imageSource}
            onError={this._handleError}
            resizeMode={resizeMode}
            source={{
              uri: imageSource,
              headers: {
                ...(userAgent ? { 'User-Agent': userAgent } : {})
              }
            }}
            style={{ height: '100%', width: '100%' }}
          />
          {!hideNewEpisodesBadges && !!newContentCount && newContentCount > 0 && (
            <NewContentBadge count={newContentCount} />
          )}
          <LightningIcon
            showLightningIcons={showLightningIcons}
            valueTags={valueTags}
            wrapperStyles={defaultStyles.lightningIcon}
          />
        </View>
      </Pressable>
    )

    return (
      <>
        {isValid && !hasError ? (
          image
        ) : (
          <View style={styles}>
            <PlaceholderImage accessible={accessible} width='100%' height='100%' />
            {!!placeholderLabel && (
              <View style={defaultStyles.placeholderWrapper}>
                <Text style={defaultStyles.placeholderLabel}>{placeholderLabel}</Text>
              </View>
            )}
          </View>
        )}
      </>
    )
  }
}

const defaultStyles = StyleSheet.create({
  lightningIcon: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: PV.Colors.skyLight,
    backgroundColor: PV.Colors.ink,
    position: 'absolute',
    bottom: 1,
    left: 1,
    zIndex: 1000000,
    minWidth: 23,
    minHeight: 23,
    marginLeft: 0,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderLabel: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    padding: 2,
    textAlign: 'center'
  },
  placeholderWrapper: {
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
})
