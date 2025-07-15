import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search, Users, Lock, Globe, Crown, Hash, Star, Shield, UserCheck } from 'lucide-react-native';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  isFavorite: boolean;
  lastActivity: string;
  createdBy: string;
  roomType: 'public' | 'private';
  hasPassword?: boolean;
  isAdmin?: boolean;
}

interface RoomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export default function RoomsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('global'); // global, private
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('general');
  const [newRoomType, setNewRoomType] = useState<'public' | 'private'>('public');
  const [newRoomPassword, setNewRoomPassword] = useState('');

  const categories: RoomCategory[] = [
    { id: 'all', name: 'All Rooms', icon: '🌍', color: '#6366F1', count: 45 },
    { id: 'general', name: 'General', icon: '💬', color: '#42B883', count: 12 },
    { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#9C27B0', count: 8 },
    { id: 'music', name: 'Music', icon: '🎵', color: '#FF5722', count: 6 },
    { id: 'tech', name: 'Technology', icon: '💻', color: '#607D8B', count: 7 },
    { id: 'sports', name: 'Sports', icon: '⚽', color: '#4CAF50', count: 5 },
    { id: 'study', name: 'Study Groups', icon: '📚', color: '#FF9800', count: 7 },
  ];

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'Anonymous Gamers Unite',
      description: 'Discuss your favorite games without revealing your identity',
      category: 'gaming',
      memberCount: 234,
      isPrivate: false,
      isJoined: true,
      isFavorite: true,
      lastActivity: '2 min ago',
      createdBy: 'GameMaster_42',
      roomType: 'public',
      isAdmin: false,
    },
    {
      id: '2',
      name: 'Secret Study Group',
      description: 'Help each other with studies anonymously',
      category: 'study',
      memberCount: 89,
      isPrivate: true,
      isJoined: false,
      isFavorite: false,
      lastActivity: '15 min ago',
      createdBy: 'Scholar_Ghost',
      roomType: 'private',
      hasPassword: true,
      isAdmin: false,
    },
    {
      id: '3',
      name: 'Tech Talk Anonymous',
      description: 'Share tech insights without judgment',
      category: 'tech',
      memberCount: 156,
      isPrivate: false,
      isJoined: true,
      isFavorite: false,
      lastActivity: '5 min ago',
      createdBy: 'CodeNinja_99',
      roomType: 'public',
      isAdmin: false,
    },
    {
      id: '4',
      name: 'Music Lovers Hideout',
      description: 'Share your music taste anonymously',
      category: 'music',
      memberCount: 67,
      isPrivate: false,
      isJoined: false,
      isFavorite: false,
      lastActivity: '1 hour ago',
      createdBy: 'MelodyMaster',
      roomType: 'public',
      isAdmin: false,
    },
    {
      id: '5',
      name: 'Anonymous Sports Fans',
      description: 'Discuss sports without team bias',
      category: 'sports',
      memberCount: 123,
      isPrivate: false,
      isJoined: true,
      isFavorite: true,
      lastActivity: '30 min ago',
      createdBy: 'SportsFanatic',
      roomType: 'public',
      isAdmin: false,
    },
    {
      id: '6',
      name: 'My Private Circle',
      description: 'Super private group for close friends',
      category: 'general',
      memberCount: 5,
      isPrivate: true,
      isJoined: true,
      isFavorite: true,
      lastActivity: '10 min ago',
      createdBy: 'You',
      roomType: 'private',
      hasPassword: true,
      isAdmin: true,
    },
  ]);

  const filteredRooms = chatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesTab = selectedTab === 'global' ? (!room.isPrivate || room.roomType === 'public') : (room.isPrivate && room.isJoined);
    return matchesSearch && matchesCategory && matchesTab;
  }).sort((a, b) => {
    // Sort favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const handleJoinRoom = (roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (room?.hasPassword && !room.isJoined) {
      Alert.alert(
        'Join Private Room',
        'This room requires a password or admin approval.',
        [
          { text: 'Enter Password', onPress: () => handlePasswordEntry(roomId) },
          { text: 'Request to Join', onPress: () => handleJoinRequest(roomId) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      setChatRooms(prev => prev.map(room => 
        room.id === roomId 
          ? { ...room, isJoined: !room.isJoined, memberCount: room.isJoined ? room.memberCount - 1 : room.memberCount + 1 }
          : room
      ));
    }
  };

  const handlePasswordEntry = (roomId: string) => {
    Alert.alert(
      'Enter Password',
      'Please enter the room password:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            setChatRooms(prev => prev.map(room => 
              room.id === roomId 
                ? { ...room, isJoined: true, memberCount: room.memberCount + 1 }
                : room
            ));
            Alert.alert('Success', 'You have joined the room! 🎉');
          }
        }
      ],
      { type: 'secure-text' }
    );
  };

  const handleJoinRequest = (roomId: string) => {
    Alert.alert('Request Sent', 'Your join request has been sent to the admin. You\'ll be notified when approved.');
  };

  const toggleFavorite = (roomId: string) => {
    setChatRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, isFavorite: !room.isFavorite }
        : room
    ));
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim() && newRoomDescription.trim() && 
        (newRoomType === 'public' || newRoomPassword.trim())) {
      const newRoom: ChatRoom = {
        id: Date.now().toString(),
        name: newRoomName,
        description: newRoomDescription,
        category: newRoomCategory,
        memberCount: 1,
        isPrivate: newRoomType === 'private',
        isJoined: true,
        isFavorite: false,
        lastActivity: 'Just created',
        createdBy: 'You',
        roomType: newRoomType,
        hasPassword: newRoomType === 'private' && newRoomPassword.trim() !== '',
        isAdmin: true,
      };
      setChatRooms(prev => [newRoom, ...prev]);
      setNewRoomName('');
      setNewRoomDescription('');
      setNewRoomPassword('');
      setShowCreateRoom(false);
      
      if (newRoomType === 'private') {
        Alert.alert(
          'Room Created!',
          `Your private room has been created. ${newRoomPassword ? 'Share the password with trusted members.' : 'Share the room link with others to invite them.'}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const tabs = [
    { id: 'global', name: 'Global Rooms', icon: '🌍' },
    { id: 'private', name: 'Private Rooms', icon: '🔒' },
  ];

  const renderTabChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.tabChip,
        selectedTab === item.id && { backgroundColor: '#6366F1' }
      ]}
      onPress={() => setSelectedTab(item.id)}
    >
      <Text style={styles.tabIcon}>{item.icon}</Text>
      <Text style={[
        styles.tabText,
        selectedTab === item.id && styles.selectedTabText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const renderCategoryChip = ({ item }: { item: RoomCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && { backgroundColor: item.color }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.categoryCount,
        selectedCategory === item.id && styles.selectedCategoryCount
      ]}>
        {item.count}
      </Text>
    </TouchableOpacity>
  );

  const renderChatRoom = ({ item }: { item: ChatRoom }) => {
    const categoryInfo = getCategoryInfo(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.roomCard}
        onPress={() => router.push(`/room/${item.id}`)}
      >
        <View style={styles.roomHeader}>
          <View style={styles.roomTitleRow}>
            <View style={[styles.roomIcon, { backgroundColor: categoryInfo.color }]}>
              <Text style={styles.roomIconText}>{categoryInfo.icon}</Text>
            </View>
            <View style={styles.roomInfo}>
              <View style={styles.roomNameRow}>
                <Text style={styles.roomName}>{item.name}</Text>
                <View style={styles.roomBadges}>
                  {item.hasPassword && <Lock size={14} color="#666" />}
                  {item.isPrivate ? <Shield size={14} color="#FF6B6B" /> : <Globe size={14} color="#4CAF50" />}
                  {item.isAdmin && <Crown size={14} color="#FFD700" />}
                  {item.isFavorite && <Star size={14} color="#FFD700" fill="#FFD700" />}
                </View>
              </View>
              <Text style={styles.roomDescription}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.roomActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Star 
                size={16} 
                color={item.isFavorite ? '#FFD700' : '#ccc'} 
                fill={item.isFavorite ? '#FFD700' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.joinButton,
                item.isJoined && styles.joinedButton
              ]}
              onPress={() => handleJoinRoom(item.id)}
            >
              <Text style={[
                styles.joinButtonText,
                item.isJoined && styles.joinedButtonText
              ]}>
                {item.isJoined ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.roomFooter}>
          <View style={styles.roomStats}>
            <Users size={14} color="#666" />
            <Text style={styles.memberCount}>{item.memberCount} members</Text>
            <Text style={styles.lastActivity}>• {item.lastActivity}</Text>
          </View>
          
          <View style={styles.creatorInfo}>
            <UserCheck size={12} color="#666" />
            <Text style={styles.creatorText}>{item.createdBy}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Rooms</Text>
        <TouchableOpacity 
          style={styles.createRoomButton}
          onPress={() => setShowCreateRoom(true)}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search rooms..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <FlatList
        data={tabs}
        renderItem={renderTabChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsList}
        contentContainerStyle={styles.tabsContent}
      />
      <FlatList
        data={categories}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />

      <FlatList
        data={filteredRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
        style={styles.roomsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.roomsContent}
      />

      <Modal
        visible={showCreateRoom}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateRoom(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Room</Text>
            <TouchableOpacity onPress={handleCreateRoom}>
              <Text style={styles.modalCreate}>Create</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Room Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter room name..."
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholderTextColor="#666"
            />
            
            <Text style={styles.modalLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Describe your room..."
              value={newRoomDescription}
              onChangeText={setNewRoomDescription}
              multiline
              placeholderTextColor="#666"
            />
            
            <Text style={styles.modalLabel}>Category</Text>
            <FlatList
              data={categories.filter(cat => cat.id !== 'all')}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalCategoryChip,
                    newRoomCategory === item.id && { backgroundColor: item.color }
                  ]}
                  onPress={() => setNewRoomCategory(item.id)}
                >
                  <Text style={styles.modalCategoryIcon}>{item.icon}</Text>
                  <Text style={[
                    styles.modalCategoryText,
                    newRoomCategory === item.id && styles.selectedModalCategoryText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalCategoriesList}
            />
            
            <Text style={styles.modalLabel}>Room Type</Text>
            <View style={styles.roomTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.roomTypeOption,
                  newRoomType === 'public' && styles.selectedRoomType
                ]}
                onPress={() => setNewRoomType('public')}
              >
                <Globe size={20} color={newRoomType === 'public' ? 'white' : '#4CAF50'} />
                <Text style={[
                  styles.roomTypeText,
                  newRoomType === 'public' && styles.selectedRoomTypeText
                ]}>
                  Public
                </Text>
                <Text style={[
                  styles.roomTypeDescription,
                  newRoomType === 'public' && styles.selectedRoomTypeDescription
                ]}>
                  Anyone can join
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roomTypeOption,
                  newRoomType === 'private' && styles.selectedRoomType
                ]}
                onPress={() => setNewRoomType('private')}
              >
                <Lock size={20} color={newRoomType === 'private' ? 'white' : '#666'} />
                <Text style={[
                  styles.roomTypeText,
                  newRoomType === 'private' && styles.selectedRoomTypeText
                ]}>
                  Private
                </Text>
                <Text style={[
                  styles.roomTypeDescription,
                  newRoomType === 'private' && styles.selectedRoomTypeDescription
                ]}>
                  Invite only
                </Text>
              </TouchableOpacity>
            </View>
            
            {newRoomType === 'private' && (
              <>
                <Text style={styles.modalLabel}>Room Password</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter room password..."
                  value={newRoomPassword}
                  onChangeText={setNewRoomPassword}
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366F1',
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
  createRoomButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tabsList: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedTabText: {
    color: 'white',
  },
  categoriesList: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  selectedCategoryText: {
    color: 'white',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedCategoryCount: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  roomsList: {
    flex: 1,
  },
  roomsContent: {
    paddingHorizontal: 16,
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomTitleRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  roomIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roomIconText: {
    fontSize: 20,
  },
  roomInfo: {
    flex: 1,
  },
  roomNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  roomBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  roomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  joinButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinedButton: {
    backgroundColor: '#E8F5E8',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#4CAF50',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  lastActivity: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCreate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalCategoriesList: {
    marginBottom: 8,
  },
  modalCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  modalCategoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedModalCategoryText: {
    color: 'white',
  },
  roomTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roomTypeOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedRoomType: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  roomTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  selectedRoomTypeText: {
    color: 'white',
  },
  roomTypeDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedRoomTypeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});