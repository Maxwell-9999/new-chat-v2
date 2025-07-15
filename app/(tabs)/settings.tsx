import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { User, Shield, Bell, Palette, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Eye, Lock, Globe, RefreshCw, Star, UserX } from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  const handleGenerateNewIdentity = () => {
    Alert.alert(
      'Generate New Identity',
      'This will create a new anonymous username and reset your profile. Your chat history will be preserved but your identity will change. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate', 
          style: 'destructive',
          onPress: () => {
            const newUsername = `Anonymous_${Math.random().toString(36).substr(2, 9)}`;
            Alert.alert('New Identity Created!', `Your new username is: ${newUsername}`);
          }
        }
      ]
    );
  };

  const handleViewProfile = () => {
    Alert.alert(
      'Your Anonymous Profile',
      'Username: Anonymous_User_7439\nAge: 25\nGender: Prefer not to say\nJoined: Dec 2024\n\nRooms Joined: 12\nConfessions Posted: 8\nComments Made: 45',
      [{ text: 'OK' }]
    );
  };
  const SettingsItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue, 
    onSwitchChange,
    textColor = '#333',
    iconColor = '#6366F1'
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    textColor?: string;
    iconColor?: string;
  }) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingsTitle, { color: textColor }]}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#ddd', true: '#6366F1' }}
          thumbColor="white"
        />
      ) : (
        <ChevronRight size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>A</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Anonymous_User_7439</Text>
          <Text style={styles.profileStatus}>🔒 Anonymous Social Platform</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleViewProfile}>
          <Eye size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingsItem
          icon={User}
          title="Anonymous Profile"
          subtitle="Manage your anonymous identity"
          onPress={handleViewProfile}
        />
        <SettingsItem
          icon={Shield}
          title="Privacy & Security"
          subtitle="Control your privacy settings"
          onPress={() => {}}
        />
        <SettingsItem
          icon={Eye}
          title="Read Receipts"
          subtitle="Show when you've read messages"
          showSwitch
          switchValue={readReceipts}
          onSwitchChange={setReadReceipts}
        />
        <SettingsItem
          icon={Globe}
          title="Show Online Status"
          subtitle="Let others see when you're online"
          showSwitch
          switchValue={showOnlineStatus}
          onSwitchChange={setShowOnlineStatus}
        />
        <SettingsItem
          icon={Star}
          title="Favorites"
          subtitle="Manage your favorite rooms and chats"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingsItem
          icon={Bell}
          title="Notifications"
          subtitle="Manage notification settings"
          showSwitch
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        <SettingsItem
          icon={Palette}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          showSwitch
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingsItem
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Get help and report issues"
          onPress={() => {}}
        />
        <SettingsItem
          icon={Info}
          title="About"
          subtitle="App information and terms"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <SettingsItem
          icon={RefreshCw}
          title="Generate New Identity"
          subtitle="Create a new anonymous profile"
          onPress={handleGenerateNewIdentity}
          iconColor="#F59E0B"
        />
        <SettingsItem
          icon={UserX}
          title="Block List"
          subtitle="Manage blocked users"
          onPress={() => {}}
          iconColor="#EF4444"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AnonSocial v2.1.0</Text>
        <Text style={styles.footerSubtext}>
          Your identity is protected across all features
        </Text>
        <Text style={styles.footerEmoji}>🔒✨🤝</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 8,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerEmoji: {
    fontSize: 20,
  },
});