import React from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { ErrorMessage, useFormikContext } from 'formik'
import TextError from './TextError'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function DropDownPickerItem({
  name,
  open,
  setOpen,
  items,
  setItems,
  placeholder,
  containerStyle
}) {
  const { values, setFieldValue } = useFormikContext()

  return (
    <>
      <DropDownPicker
        open={open}
        value={values[name]}
        items={items}
        setOpen={setOpen}
        onSelectItem={item => {
          setFieldValue(name, item.value)
        }}
        setItems={setItems}
        placeholder={placeholder}
        containerStyle={[{ height: 40, marginTop: 20 }, containerStyle]}
        style={{ backgroundColor: GlobalStyles.brandBackground }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
      />
      <ErrorMessage name={name} render={msg => <TextError>{msg}</TextError>} />
    </>
  )
}
