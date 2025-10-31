import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import appColors from '../../themes/app.colors'

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

export default function Header({ title = "Driver Dashboard", subtitle, showStatus = false, isOnline = false }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {showStatus && (
          <View style={[styles.statusContainer, isOnline ? styles.onlineStatus : styles.offlineStatus]}>
            <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, // For status bar
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.whiteColor,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.whiteColor,
    opacity: 0.8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineStatus: {
    backgroundColor: appColors.greenColor,
  },
  offlineStatus: {
    backgroundColor: appColors.alertRed,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: appColors.whiteColor,
  },
  offlineDot: {
    backgroundColor: appColors.whiteColor,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  onlineText: {
    color: appColors.whiteColor,
  },
  offlineText: {
    color: appColors.whiteColor,
  },
})
