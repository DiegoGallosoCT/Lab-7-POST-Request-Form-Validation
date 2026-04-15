import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Switch, View } from 'react-native'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { getProductCategories, create } from '../../api/ProductEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as yup from 'yup'
import { Formik } from 'formik'
import TextError from '../../components/TextError'
import ImagePicker from '../../components/ImagePicker'
import SubmitButton from '../../components/SubmitButton'
import DropDownPickerItem from '../../components/DropDownPickerItem'

export default function CreateProductScreen({ navigation, route }) {
  const [open, setOpen] = useState(false)
  const [productCategories, setProductCategories] = useState([])
  const [backendErrors, setBackendErrors] = useState()

  const initialProductValues = {
    name: null,
    description: null,
    price: null,
    order: null,
    restaurantId: route.params.id,
    productCategoryId: null,
    availability: true
  }

  const validationSchema = yup.object().shape({
    name: yup.string().max(255, 'Name too long').required('Name is required'),
    price: yup
      .number('Please enter a valid price value')
      .positive('Please enter a valid price value')
      .required('Price is required'),
    order: yup
      .number('Please enter a valid order/position value')
      .positive('Please enter a valid order/position value')
      .required('Order/position is required'),
    availability: yup.boolean().required('Availability is required'),
    productCategoryId: yup
      .number()
      .positive()
      .integer()
      .required('Product category is required')
  })

  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const fetchedProductCategories = await getProductCategories()
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map(
          e => {
            return {
              label: e.name,
              value: e.id
            }
          }
        )
        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductCategories()
  }, [])

  const createProduct = async values => {
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
      initialValues={initialProductValues}
      onSubmit={createProduct}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem name="name" label="Name:" />
              <InputItem name="description" label="Description:" />
              <InputItem name="price" label="Price:" />
              <InputItem name="order" label="Order/position to be rendered:" />

              <DropDownPickerItem
                name="productCategoryId"
                open={open}
                setOpen={setOpen}
                items={productCategories}
                setItems={setProductCategories}
                placeholder="Select the product category"
                containerStyle={{ marginBottom: 20 }}
              />

              <TextRegular>Is it available?</TextRegular>
              <Switch
                trackColor={{
                  false: GlobalStyles.brandSecondary,
                  true: GlobalStyles.brandPrimary
                }}
                thumbColor={
                  values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'
                }
                value={values.availability}
                style={styles.switch}
                onValueChange={value => setFieldValue('availability', value)}
              />

              <ImagePicker
                label="Image:"
                image={values.image}
                defaultImage={defaultProductImage}
                onImagePicked={result => setFieldValue('image', result)}
              />

              <SubmitButton onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 5
  }
})
