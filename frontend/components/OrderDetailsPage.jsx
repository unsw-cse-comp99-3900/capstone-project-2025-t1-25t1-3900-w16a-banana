import React from 'react'
import { Text } from 'react-native-paper'
import MyScrollView from './MyScrollView'

export default function OrderDetailsPage({ orderId }) {
  return (
    <MyScrollView>
      <Text variant="headlineLarge" style={{ marginBottom: 10 }}>
        Order Details for Order ID: {orderId}
      </Text>
    </MyScrollView>
  )
}
