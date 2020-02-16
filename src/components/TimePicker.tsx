import React from 'react'
import { Picker, StyleSheet } from 'react-native'
import { useGlobal } from 'reactn'
import { getHHMMSSArray } from '../lib/utility'
import { PV } from '../resources'
import { Text, View } from './'

type Props = {
  currentTime: number
}

const generatePickerNumberItems = (total: number, key: string) => {
  const arr = [] as any
  for (let i = 0; i < total; i++) {
    arr.push(
      <Picker.Item
        key={i + key}
        label={i.toString()}
        value={i.toString()} />
    )
  }

  return arr
}

const hourItems = generatePickerNumberItems(24, 'hourItems')
const minuteItems = generatePickerNumberItems(60, 'minuteItems')
const secondItems = generatePickerNumberItems(60, 'secondItems')

export const TimePicker = (props: Props) => {
  const { currentTime } = props
  const [globalTheme] = useGlobal('globalTheme')

  const hhmmssArray = getHHMMSSArray(currentTime)
  const currentHour = hhmmssArray[0]
  const currentMinute = hhmmssArray[1]
  const currentSecond = hhmmssArray[2]

  return (
    <View style={styles.view}>
      <View style={styles.pickersWrapper}>
        <View style={styles.pickerColumn}>
          <Picker
            itemStyle={[styles.number, globalTheme.text]}
            selectedValue={currentHour}
            style={styles.numberColumn}>
            {hourItems}
          </Picker>
          <Text style={[styles.text, globalTheme.text]}>hours</Text>
        </View>
        <View style={styles.pickerColumn}>
          <Picker
            itemStyle={[styles.number, globalTheme.text]}
            selectedValue={currentMinute}
            style={styles.numberColumn}>
            {minuteItems}
          </Picker>
          <Text style={[styles.text, globalTheme.text]}>minutes</Text>
        </View>
        <View style={styles.pickerColumn}>
          <Picker
            itemStyle={[styles.number, globalTheme.text]}
            selectedValue={currentSecond}
            style={styles.numberColumn}>
            {secondItems}
          </Picker>
          <Text style={[styles.text, globalTheme.text]}>seconds</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  number: {
    fontSize: 28,
    fontWeight: PV.Fonts.weights.bold
  },
  numberColumn: {
    flex: 0
  },
  pickerColumn: {
    flex: 1
  },
  pickersWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 16
  },
  text: {
    fontSize: PV.Fonts.sizes.lg,
    textAlign: 'center'
  },
  view: {
    backgroundColor: 'red',
    flex: 1
  }
})
