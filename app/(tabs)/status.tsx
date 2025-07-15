import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Camera } from 'lucide-react-native';

interface StatusItem {
  id: string;
  name: string;
  timestamp: string;
  isViewed: boolean;
  isMyStatus: boolean;
}

export default function StatusScreen() {
  const [statuses, setStatuses] = useState<StatusItem[]>([
    {
      id: '1',
      name: 'My Status',
      timestamp: 'Tap to add status update',
      isViewed: false,
      isMyStatus: true,
    },
    {
      id: '2',
      name: 'Anonymous_Phoenix',
      timestamp: '2 hours ago',
      isViewed: false,
      isMyStatus: false,
    },
    {
      id: '3',
      name: 'Ghost_Rider',
      timestamp: '5 hours ago',
      isViewed: true,
      isMyStatus: false,
    },
    {
      id: '4',
      name: 'Shadow_Cat',
      timestamp: '1 day ago',
      isViewed: true,
      isMyStatus: false,
    },
  ]);

  const renderStatusItem = ({ item }: { item: StatusItem }) => (
    <TouchableOpacity
      style={styles.statusItem}
      onPress={() => router.push(`/status/${item.id}`)}
    >
      <View style={styles.statusAvatarContainer}>
        <View style={[
          styles.statusAvatar,
          item.isMyStatus && styles.myStatusAvatar,
          !item.isViewed && !item.isMyStatus && styles.unviewedStatusAvatar
        ]}>
          <Text style={styles.avatarText}>
            {item.isMyStatus ? '+' : item.name.charAt(0)}
          </Text>
        </View>
        {item.isMyStatus && (
          <View style={styles.addStatusIcon}>
            <Plus size={16} color="white" />
          </View>
        )}
      </View>
      
      <View style={styles.statusContent}>
        <Text style={styles.statusName}>{item.name}</Text>
        <Text style={styles.statusTimestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#128C7E" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Camera size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={statuses}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item.id}
        style={styles.statusList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent updates</Text>
          </View>
        )}
      />

      <View style={styles.privacyNotice}>
        <Text style={styles.privacyText}>
          🔒 Your status updates are completely anonymous
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#128C7E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  statusList: {
    flex: 1,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  statusAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  myStatusAvatar: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  unviewedStatusAvatar: {
    borderColor: '#25D366',
    borderWidth: 3,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addStatusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  statusContent: {
    flex: 1,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statusTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  privacyNotice: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#128C7E',
    textAlign: 'center',
    fontWeight: '500',
  },
});