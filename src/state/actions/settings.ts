import AsyncStorage from '@react-native-community/async-storage'
import { getGlobal, setGlobal } from 'reactn'
import { PV } from '../../resources'
import {
  setPlayerJumpBackwards as setPlayerJumpBackwardsService,
  setPlayerJumpForwards as setPlayerJumpForwardsService,
  playerUpdateTrackPlayerCapabilities
} from '../../services/player'
import { checkIfTrackingIsEnabled } from '../../services/tracking'

export const initializeSettings = async () => {
  const [
    censorNSFWText,
    customAPIDomain,
    customAPIDomainEnabled,
    customWebDomain,
    customWebDomainEnabled,
    errorReportingEnabled,
    hideCompleted,
    hideNewEpisodesBadges,
    listenTrackingEnabled,
    urlsAPI,
    urlsWeb,
    jumpBackwardsTime,
    jumpForwardsTime,
    addCurrentItemNextInQueue,
    podcastsGridViewEnabled
  ] = await Promise.all([
    AsyncStorage.getItem(PV.Keys.CENSOR_NSFW_TEXT),
    AsyncStorage.getItem(PV.Keys.CUSTOM_API_DOMAIN),
    AsyncStorage.getItem(PV.Keys.CUSTOM_API_DOMAIN_ENABLED),
    AsyncStorage.getItem(PV.Keys.CUSTOM_WEB_DOMAIN),
    AsyncStorage.getItem(PV.Keys.CUSTOM_WEB_DOMAIN_ENABLED),
    AsyncStorage.getItem(PV.Keys.ERROR_REPORTING_ENABLED),
    AsyncStorage.getItem(PV.Keys.HIDE_COMPLETED),
    AsyncStorage.getItem(PV.Keys.NEW_EPISODES_BADGES_HIDE),
    checkIfTrackingIsEnabled(),
    PV.URLs.api(),
    PV.URLs.web(),
    AsyncStorage.getItem(PV.Keys.PLAYER_JUMP_BACKWARDS),
    AsyncStorage.getItem(PV.Keys.PLAYER_JUMP_FORWARDS),
    AsyncStorage.getItem(PV.Keys.PLAYER_ADD_CURRENT_ITEM_NEXT_IN_QUEUE),
    AsyncStorage.getItem(PV.Keys.PODCASTS_GRID_VIEW_ENABLED)
  ])

  setGlobal({
    censorNSFWText,
    customAPIDomain: customAPIDomain ? customAPIDomain : PV.URLs.apiDefaultBaseUrl,
    customAPIDomainEnabled: customAPIDomainEnabled === 'TRUE',
    customWebDomain: customWebDomain ? customWebDomain : PV.URLs.webDefaultBaseUrl,
    customWebDomainEnabled: customWebDomainEnabled === 'TRUE',
    errorReportingEnabled,
    hideCompleted,
    hideNewEpisodesBadges,
    listenTrackingEnabled,
    podcastsGridViewEnabled,
    jumpBackwardsTime: jumpBackwardsTime || PV.Player.jumpBackSeconds,
    jumpForwardsTime: jumpForwardsTime || PV.Player.jumpSeconds,
    urlsAPI,
    urlsWeb,
    addCurrentItemNextInQueue: !!addCurrentItemNextInQueue
  }, () => {
    // Call handleFinishSettingPlayerTime in case a custom jump time is available.
    handleFinishSettingPlayerTime()
  })
}

export const setCensorNSFWText = (value: boolean) => {
  setGlobal({ censorNSFWText: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.CENSOR_NSFW_TEXT, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.CENSOR_NSFW_TEXT)
  })
}

export const setHideCompleted = (value: boolean) => {
  setGlobal({ hideCompleted: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.HIDE_COMPLETED, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.HIDE_COMPLETED)
  })
}

export const setErrorReportingEnabled = (value: boolean) => {
  setGlobal({ errorReportingEnabled: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.ERROR_REPORTING_ENABLED, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.ERROR_REPORTING_ENABLED)
  })
}

export const saveCustomAPIDomain = async (value?: string) => {
  // Call setItem before PV.URLs.api(), because api() reads from PV.Keys.CUSTOM_API_DOMAIN
  if (value) {
    await AsyncStorage.setItem(PV.Keys.CUSTOM_API_DOMAIN, value)
    const urlsAPI = await PV.URLs.api()
    setGlobal({ urlsAPI })
  } else {
    setGlobal({ customWebDomain: PV.URLs.apiDefaultBaseUrl }, async () => {
      await AsyncStorage.setItem(PV.Keys.CUSTOM_API_DOMAIN, PV.URLs.apiDefaultBaseUrl)
      const urlsAPI = await PV.URLs.api()
      setGlobal({ urlsAPI })
    })
  }
}

export const setCustomAPIDomainEnabled = (value?: boolean) => {
  setGlobal({ customAPIDomainEnabled: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.CUSTOM_API_DOMAIN_ENABLED, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.CUSTOM_API_DOMAIN_ENABLED)
  })
}

export const saveCustomWebDomain = async (value?: string) => {
  // Call setItem before PV.URLs.web(), because web() reads from PV.Keys.CUSTOM_WEB_DOMAIN
  if (value) {
    await AsyncStorage.setItem(PV.Keys.CUSTOM_WEB_DOMAIN, value)
    const urlsWeb = await PV.URLs.web()
    setGlobal({ urlsWeb })
  } else {
    setGlobal({ customWebDomain: PV.URLs.webDefaultBaseUrl }, async () => {
      await AsyncStorage.setItem(PV.Keys.CUSTOM_WEB_DOMAIN, PV.URLs.webDefaultBaseUrl)
      const urlsWeb = await PV.URLs.web()
      setGlobal({ urlsWeb })
    })
  }
}

export const setCustomWebDomainEnabled = (value?: boolean) => {
  setGlobal({ customWebDomainEnabled: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.CUSTOM_WEB_DOMAIN_ENABLED, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.CUSTOM_WEB_DOMAIN_ENABLED)
  })
}

export const setPlayerJumpBackwards = (val?: string) => {
  const newValue = setPlayerJumpBackwardsService(val)
  setGlobal({ jumpBackwardsTime: newValue })
}

export const setPlayerJumpForwards = (val?: string) => {
  const newValue = setPlayerJumpForwardsService(val)
  setGlobal({ jumpForwardsTime: newValue })
}

export const handleFinishSettingPlayerTime = () => {
  const { jumpBackwardsTime, jumpForwardsTime } = getGlobal()
  const newJumpBackwardsTime = jumpBackwardsTime === '' ? PV.Player.jumpBackSeconds : jumpBackwardsTime
  const newJumpForwardsTime = jumpForwardsTime === '' ? PV.Player.jumpSeconds : jumpForwardsTime
  setGlobal({
    jumpBackwardsTime: newJumpBackwardsTime,
    jumpForwardsTime: newJumpForwardsTime
  }, () => {
    playerUpdateTrackPlayerCapabilities()
  })
}

export const setAddCurrentItemNextInQueue = async (val: boolean) => {
  if (val) {
    await AsyncStorage.setItem(PV.Keys.PLAYER_ADD_CURRENT_ITEM_NEXT_IN_QUEUE, 'TRUE')
    setGlobal({ addCurrentItemNextInQueue: !!val })
  } else {
    await AsyncStorage.removeItem(PV.Keys.PLAYER_ADD_CURRENT_ITEM_NEXT_IN_QUEUE)
    setGlobal({ addCurrentItemNextInQueue: false })
  }
}

export const setPodcastsGridView = (value: boolean) => {
  setGlobal({ podcastsGridViewEnabled: value }, async () => {
    value
      ? await AsyncStorage.setItem(PV.Keys.PODCASTS_GRID_VIEW_ENABLED, 'TRUE')
      : await AsyncStorage.removeItem(PV.Keys.PODCASTS_GRID_VIEW_ENABLED)
  })
}
