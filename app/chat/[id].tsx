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
import { ArrowLeft, Send, Paperclip, Mic, Phone, Video, MoveVertical as MoreVertical, UserX, Star, Info } from 'lucide-react-native';
import { ArrowLeft, Send, Paperclip, Mic, MoveVertical as MoreVertical, UserX, Star, Info, VolumeX, Ban } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'voice' | 'image';
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing today?',
      isSent: false,
      timestamp: '2:30 PM',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      text: 'I\'m doing great, thanks for asking! How about you?',
      isSent: true,
      timestamp: '2:32 PM',
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      text: 'Pretty good! Just working on some anonymous projects 😊',
      isSent: false,
      timestamp: '2:35 PM',
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      text: 'That sounds interesting! Tell me more about it',
      isSent: true,
      timestamp: '2:37 PM',
      status: 'delivered',
      type: 'text',
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatName = id === '1' ? 'Anonymous_Phoenix' : id === '2' ? 'Secret Coders' : 'Ghost_Rider';
  const isOnline = id === '1';

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isSent: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        ));
      }, 3000);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      Alert.alert('Voice Recording', 'Recording started...');
    } else {
      Alert.alert('Voice Recording', 'Recording stopped and sent!');
    }
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Chat Options',
      'Choose an action:',
      [
        { text: 'View Profile', onPress: () => Alert.alert('Profile', `Username: ${chatName}\nStatus: ${isOnline ? 'Online' : 'Last seen recently'}\nJoined: Dec 2024`) },
        { text: isFavorite ? 'Remove from Favorites' : 'Add to Favorites', onPress: () => setIsFavorite(!isFavorite) },
        { text: 'Mute User', onPress: () => Alert.alert('Muted', `${chatName} has been muted`) },
        { text: 'Block User', style: 'destructive', onPress: () => Alert.alert('Blocked', `${chatName} has been blocked`) },
        { text: 'Report User', style: 'destructive', onPress: () => Alert.alert('Reported', `${chatName} has been reported`) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isSent ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isSent ? styles.sentText : styles.receivedText
      ]}>
        {item.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={[
          styles.timestamp,
          item.isSent ? styles.sentTimestamp : styles.receivedTimestamp
        ]}>
          {item.timestamp}
        </Text>
        {item.isSent && (
          <Text style={[
            styles.statusIcon,
            item.status === 'read' ? styles.readStatus : styles.deliveredStatus
          ]}>
            {getStatusIcon(item.status)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName}</Text>
          <Text style={styles.headerStatus}>
            {isFavorite && <Star size={16} color="#FFD700" fill="#FFD700" />}
            {isOnline ? 'Online' : 'Last seen recently'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMoreOptions}>
            <MoreVertical size={22} color="white" />
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
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={22} color="#666" />
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
            <TouchableOpacity 
              style={[styles.voiceButton, isRecording && styles.recordingButton]} 
              onPress={handleVoiceRecord}
            >
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
    backgroundColor: '#E5DDD5',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  headerStatus: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
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
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 2,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: 'white',
  },
  receivedText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    marginRight: 4,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  receivedTimestamp: {
    color: '#666',
  },
  statusIcon: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  deliveredStatus: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  readStatus: {
    color: '#FFD700',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
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
  recordingButton: {
    backgroundColor: '#FF5722',
  },
});