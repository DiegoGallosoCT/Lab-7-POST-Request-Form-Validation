import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextRegular from './TextRegular'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function SubmitButton({ onPress, text = 'Save' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? GlobalStyles.brandSuccessTap
            : GlobalStyles.brandSuccess
        },
        styles.button
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="content-save" color="white" size={20} />
        <TextRegular textStyle={styles.text}>{text}</TextRegular>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  }
})
