import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import * as yup from 'yup'
import { create, getRestaurantCategories } from '../../api/RestaurantEndpoints'
import InputItem from '../../components/InputItem'
import * as GlobalStyles from '../../styles/GlobalStyles'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import restaurantBackground from '../../../assets/restaurantBackground.jpeg'
import { showMessage } from 'react-native-flash-message'
import { Formik } from 'formik'
import TextError from '../../components/TextError'
import ImagePicker from '../../components/ImagePicker'
import SubmitButton from '../../components/SubmitButton'
import DropDownPickerItem from '../../components/DropDownPickerItem'

export default function CreateRestaurantScreen({ navigation }) {
  const [open, setOpen] = useState(false)
  const [restaurantCategories, setRestaurantCategories] = useState([])
  const [backendErrors, setBackendErrors] = useState()

  const initialRestaurantValues = {
    name: null,
    description: null,
    address: null,
    postalCode: null,
    url: null,
    shippingCosts: null,
    email: null,
    phone: null,
    restaurantCategoryId: null
  }

  const validationSchema = yup.object().shape({
    name: yup.string().max(255, 'Name too long').required('Name is required'),
    address: yup
      .string()
      .max(255, 'Address too long')
      .required('Address is required'),
    postalCode: yup
      .string()
      .max(255, 'Postal code too long')
      .required('Postal code is required'),
    url: yup.string().nullable().url('Please enter a valid url'),
    shippingCosts: yup
      .number()
      .positive('Please provide a valid shipping cost value')
      .required('Shipping costs value is required'),
    email: yup.string().nullable().email('Please enter a valid email'),
    phone: yup.string().nullable().max(255, 'Phone too long'),
    restaurantCategoryId: yup
      .number()
      .positive()
      .integer()
      .required('Restaurant category is required')
  })

  useEffect(() => {
    async function fetchRestaurantCategories() {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        const fetchedRestaurantCategoriesReshaped =
          fetchedRestaurantCategories.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurantCategories()
  }, [])

  const createRestaurant = async values => {
    setBackendErrors([])
    try {
      const createdRestaurant = await create(values)
      showMessage({
        message: `Restaurant ${createdRestaurant.name} successfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('RestaurantsScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialRestaurantValues}
      onSubmit={createRestaurant}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem name="name" label="Name:" />
              <InputItem name="description" label="Description:" />
              <InputItem name="address" label="Address:" />
              <InputItem name="postalCode" label="Postal code:" />
              <InputItem name="url" label="Url:" />
              <InputItem name="shippingCosts" label="Shipping costs:" />
              <InputItem name="email" label="Email:" />
              <InputItem name="phone" label="Phone:" />

              <DropDownPickerItem
                name="restaurantCategoryId"
                open={open}
                setOpen={setOpen}
                items={restaurantCategories}
                setItems={setRestaurantCategories}
                placeholder="Select the restaurant category"
              />

              <ImagePicker
                label="Logo:"
                image={values.logo}
                defaultImage={restaurantLogo}
                onImagePicked={result => setFieldValue('logo', result)}
              />

              <ImagePicker
                label="Hero Image:"
                image={values.heroImage}
                defaultImage={restaurantBackground}
                onImagePicked={result => setFieldValue('heroImage', result)}
              />

              {backendErrors &&
                backendErrors.map((error, index) => (
                  <TextError key={index}>
                    {error.param}-{error.msg}
                  </TextError>
                ))}

              <SubmitButton onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}
