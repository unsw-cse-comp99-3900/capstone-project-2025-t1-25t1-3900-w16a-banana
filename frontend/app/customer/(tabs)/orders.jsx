import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { BACKEND } from '../../../constants/backend';
import useAuth from '../../../hooks/useAuth';
import useToast from '../../../hooks/useToast';
import axios from 'axios';
import OrderCard from '../../../components/OrderCard';
import groupOrdersByDate from '../../../utils/group';
import MyScrollView from '../../../components/MyScrollView';

export default function Orders() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!contextProfile?.token) return;
    fetchOrders();
  }, [contextProfile]);

  const fetchOrders = async () => {
    const url = `${BACKEND}/customer-order/`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      setOrders(response.data);
    } catch (error) {
      showToast('Failed to fetch orders', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort orders
  const inProgressStatuses = ['PENDING', 'ACCEPTED', 'READY_FOR_PICKUP', 'PICKED_UP'];

  const inProgressOrders = useMemo(() => {
    return orders
      .filter((entry) => inProgressStatuses.includes(entry.order.order_status))
      .sort((a, b) => new Date(b.order.order_time) - new Date(a.order.order_time));
  }, [orders]);

  const pastOrders = useMemo(() => {
    return orders
      .filter((entry) =>
        ['DELIVERED', 'CANCELLED'].includes(entry.order.order_status)
      )
      .sort((a, b) => new Date(b.order.order_time) - new Date(a.order.order_time));
  }, [orders]);

  const groupedPastOrders = useMemo(() => {
    return groupOrdersByDate(pastOrders);
  }, [pastOrders]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <MyScrollView>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>
        {`Ongoing Orders (${inProgressOrders.length})`}
      </Text>
      {inProgressOrders.length === 0 ? (
        <Text>No ongoing orders.</Text>
      ) : (
        inProgressOrders.map((entry) => (
          <OrderCard key={entry.order.id} entry={entry} />
        ))
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#e0e0e0', marginVertical: 4 }} />

      {/* Past Orders */}
      <Text variant="titleLarge" style={{ marginTop: 8, marginBottom: 8 }}>
        {`Past Orders (${pastOrders.length})`}
      </Text>
      {groupedPastOrders.map(({ date, entries }) => (
        <View key={date} style={{ marginBottom: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>
            {date}
          </Text>
          {entries.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </View>
      ))}
    </MyScrollView>
  );
}
