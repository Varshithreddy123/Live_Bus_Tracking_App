import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDriverData } from '../../hooks/useDriverData'
import Header from '../../components/common/Header'
import Button from '../../components/common/button'
import appColors from '../../themes/app.colors'
import styles from './styles'

export default function HomeScreen() {
  const { driverData, loading, error, refetch } = useDriverData()
  const [isOnline, setIsOnline] = useState(false)
  const [currentPassengers, setCurrentPassengers] = useState(0)

  const toggleOnlineStatus = () => {
    setIsOnline(previousState => !previousState)
  }

  const handleStartRide = () => {
    Alert.alert('Start Ride', 'Are you ready to start your bus ride?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: () => console.log('Ride started') }
    ])
  }

  const handleViewRoute = () => {
    Alert.alert('Route Details', 'Navigate to route details screen')
  }

  const handleEmergency = () => {
    Alert.alert('Emergency', 'Emergency contact initiated')
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading driver data...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Welcome, ${driverData?.name || 'Driver'}`}
        subtitle="Manage your bus and customers"
        showStatus={true}
        isOnline={isOnline}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Online/Offline Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Driver Status</Text>
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleText, !isOnline && styles.activeToggleText]}>
              Offline
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: appColors.alertRed, true: appColors.greenColor }}
              thumbColor={appColors.whiteColor}
            />
            <Text style={[styles.toggleText, isOnline && styles.activeToggleText]}>
              Online
            </Text>
          </View>
        </View>

        {/* Bus Information Card */}
        <View style={styles.busCard}>
          <Text style={styles.cardTitle}>Bus Information</Text>
          <View style={styles.busInfoRow}>
            <Text style={styles.busLabel}>Bus Number:</Text>
            <Text style={styles.busValue}>{driverData?.vehicleNumber || 'N/A'}</Text>
          </View>
          <View style={styles.busInfoRow}>
            <Text style={styles.busLabel}>Vehicle Type:</Text>
            <Text style={styles.busValue}>{driverData?.vehicleType || 'N/A'}</Text>
          </View>
          <View style={styles.busInfoRow}>
            <Text style={styles.busLabel}>Route:</Text>
            <Text style={styles.busValue}>City Center to Airport</Text>
          </View>
          <View style={styles.busInfoRow}>
            <Text style={styles.busLabel}>Departure:</Text>
            <Text style={styles.busValue}>08:30 AM</Text>
          </View>
          <View style={styles.busInfoRow}>
            <Text style={styles.busLabel}>Arrival:</Text>
            <Text style={styles.busValue}>04:45 PM</Text>
          </View>
        </View>

        {/* Current Passengers */}
        <View style={styles.passengersCard}>
          <Text style={styles.cardTitle}>Current Passengers</Text>
          <View style={styles.passengerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentPassengers}</Text>
              <Text style={styles.statLabel}>On Board</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{driverData?.pendingRides || 0}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Dashboard */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${driverData?.totalEarning || 0}</Text>
              <Text style={styles.statLabelSmall}>Earnings</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{driverData?.totalRides || 0}</Text>
              <Text style={styles.statLabelSmall}>Rides</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{driverData?.rating || 0}/5</Text>
              <Text style={styles.statLabelSmall}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{driverData?.cancleRides || 0}</Text>
              <Text style={styles.statLabelSmall}>Cancelled</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Start Ride"
            onPress={handleStartRide}
            backgroundColor={isOnline ? appColors.greenColor : appColors.secondaryText}
            width="48%"
          />
          <Button
            title="View Route"
            onPress={handleViewRoute}
            backgroundColor={appColors.primary}
            width="48%"
          />
        </View>

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
          <Text style={styles.emergencyText}>🚨 Emergency</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
