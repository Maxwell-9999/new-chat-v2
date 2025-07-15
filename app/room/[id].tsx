import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Users, Settings, Share, Image, Mic, LogOut, UserMinus, Crown, Shield } from 'lucide-react-native';

interface RoomMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'system';
  isOwn: boolean;
}

export default function RoomChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([
    {
      id: '1',
      text: 'Welcome to Anonymous Gamers Unite! 🎮',
      sender: 'System',
      timestamp: '10:00 AM',
      type: 'system',
      isOwn: false,
    },
    {
      id: '2',
      text: 'Hey everyone! Anyone playing the new RPG that just came out?',
      sender: 'GameMaster_42',
      timestamp: '10:15 AM',
      type: 'text',
      isOwn: false,
    },
    {
      id: '3',
      text: 'Yes! I\'ve been playing it all weekend. The graphics are amazing!',
      sender: 'PixelWarrior',
      timestamp: '10:17 AM',
      type: 'text',
      isOwn: false,
    },
    {
      id: '4',
      text: 'I\'m thinking of getting it. Is it worth the price?',
      sender: 'You',
      timestamp: '10:20 AM',
      type: 'text',
      isOwn: true,
    },
    {
      id: '5',
      text: 'Definitely! The storyline is incredible and there\'s so much content.',
      sender: 'QuestSeeker',
      timestamp: '10:22 AM',
      type: 'text',
      isOwn: false,
    },
  ]);
  const [memberCount, setMemberCount] = useState(234);
  const [isAdmin, setIsAdmin] = useState(id === '6'); // User is admin of room 6
  const flatListRef = useRef<FlatList>(null);

  const roomName = id === '1' ? 'Anonymous Gamers Unite' : 
                  id === '2' ? 'Secret Study Group' : 
                  id === '3' ? 'Tech Talk Anonymous' : 'Chat Room';
                  id === '6' ? 'My Private Circle' :

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: RoomMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isOwn: true,
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleRoomSettings = () => {
    const adminOptions = [
      { text: 'Room Info', onPress: () => Alert.alert('Room Info', `Room: ${roomName}\nMembers: ${memberCount}\nCreated: Dec 2024\nType: ${id === '6' ? 'Private' : 'Public'}`) },
      { text: 'Manage Members', onPress: () => handleManageMembers() },
      { text: 'Invite Members', onPress: () => handleInviteMembers() },
      { text: 'Room Settings', onPress: () => Alert.alert('Settings', 'Room settings opened') },
      { text: 'Leave Room', style: 'destructive', onPress: () => handleLeaveRoom() },
      { text: 'Cancel', style: 'cancel' }
    ];

    const memberOptions = [
      { text: 'Room Info', onPress: () => Alert.alert('Room Info', `Room: ${roomName}\nMembers: ${memberCount}\nCreated: Dec 2024`) },
      { text: 'Invite Members', onPress: () => handleInviteMembers() },
      { text: 'Leave Room', style: 'destructive', onPress: () => handleLeaveRoom() },
      { text: 'Cancel', style: 'cancel' }
    ];

    Alert.alert('Room Options', 'Choose an action:', isAdmin ? adminOptions : memberOptions);
  };

  const handleManageMembers = () => {
    Alert.alert(
      'Manage Members',
      'Select a member to manage:',
      [
        { text: 'GameMaster_42', onPress: () => handleMemberAction('GameMaster_42') },
        { text: 'PixelWarrior', onPress: () => handleMemberAction('PixelWarrior') },
        { text: 'QuestSeeker', onPress: () => handleMemberAction('QuestSeeker') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleMemberAction = (memberName: string) => {
    Alert.alert(
      `Manage ${memberName}`,
      'Choose an action:',
      [
        { text: 'Make Admin', onPress: () => Alert.alert('Success', `${memberName} is now an admin`) },
        { text: 'Kick from Room', style: 'destructive', onPress: () => Alert.alert('Kicked', `${memberName} has been removed from the room`) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleInviteMembers = () => {
    Alert.alert(
      'Invite Members',
      'Room link copied to clipboard!\n\nShare this link: anonsocial://room/join/abc123\n\nOr share the room code: ABC123',
      [{ text: 'OK' }]
    );
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      'Leave Room',
      `Are you sure you want to leave ${roomName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const handleShareRoom = () => {
    Alert.alert(
      'Share Room',
      'Room link copied to clipboard! 📋\n\nShare this link with others to invite them to this room.\n\nLink: anonsocial://room/join/abc123',
      [{ text: 'OK' }]
    );
  };

  const renderMessage = ({ item }: { item: RoomMessage }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage
      ]}>
        {!item.isOwn && (
          <View style={styles.senderRow}>
            <Text style={styles.senderName}>{item.sender}</Text>
            {item.sender === 'GameMaster_42' && <Crown size={12} color="#FFD700" />}
          </View>
        )}
        <Text style={[
          styles.messageText,
          item.isOwn ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.isOwn ? styles.ownTimestamp : styles.otherTimestamp
        ]}>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.roomNameRow}>
            <Text style={styles.headerName}>{roomName}</Text>
            {isAdmin && <Crown size={16} color="#FFD700" />}
            {id === '6' && <Shield size={16} color="#FF6B6B" />}
          </View>
          <View style={styles.memberInfo}>
            <Users size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.memberCount}>{memberCount} members</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareRoom}>
            <Share size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleRoomSettings}>
            <Settings size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.mediaButton}>
            <Image size={22} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor="#666"
          />
          
          {message.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Send size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.voiceButton}>
              <Mic size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  roomNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 2,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#666',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mediaButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#6366F1',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  voiceButton: {
    backgroundColor: '#10B981',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});