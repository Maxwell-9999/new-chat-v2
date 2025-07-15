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
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search, Heart, MessageCircle, Share, Filter, Send, ThumbsDown, Flag, TrendingUp, CircleHelp as HelpCircle, UserPlus, Ban, VolumeX, Eye, EyeOff } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Confession {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  date: string;
  likes: number;
  dislikes: number;
  comments: number;
  isLiked: boolean;
  isDisliked: boolean;
  anonymousId: string;
  likedUsers: string[];
  dislikedUsers: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export default function GlobalChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSection, setSelectedSection] = useState('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [showUserActions, setShowUserActions] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  const categories: Category[] = [
    { id: 'all', name: 'All', icon: '🌍', color: '#6366F1', count: 234 },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#FF6B6B', count: 45 },
    { id: 'work', name: 'Work', icon: '💼', color: '#4ECDC4', count: 67 },
    { id: 'school', name: 'School', icon: '🎓', color: '#45B7D1', count: 89 },
    { id: 'dating', name: 'Dating', icon: '💕', color: '#F093FB', count: 123 },
    { id: 'health', name: 'Health', icon: '🏥', color: '#96CEB4', count: 34 },
    { id: 'general', name: 'General', icon: '💭', color: '#FECA57', count: 156 },
    { id: 'questions', name: 'Questions', icon: '❓', color: '#8B5CF6', count: 78 },
  ];

  const [confessions, setConfessions] = useState<Confession[]>([
    {
      id: '1',
      title: 'Pretending at Work for 3 Years',
      content: 'I\'ve been pretending to understand my job for 3 years now. I just nod and smile in meetings and somehow I got promoted twice.',
      category: 'work',
      timestamp: '2 hours ago',
      date: 'Dec 15, 2024',
      likes: 234,
      dislikes: 12,
      comments: 45,
      isLiked: false,
      isDisliked: false,
      anonymousId: 'Anonymous_Phoenix',
      likedUsers: [],
      dislikedUsers: [],
    },
    {
      id: '2',
      title: 'Family Thinks I\'m Successful',
      content: 'My family thinks I\'m successful but I\'m actually struggling financially. I don\'t know how to tell them without disappointing everyone.',
      category: 'family',
      timestamp: '4 hours ago',
      date: 'Dec 15, 2024',
      likes: 189,
      dislikes: 8,
      comments: 67,
      isLiked: true,
      isDisliked: false,
      anonymousId: 'Ghost_Rider',
      likedUsers: ['You'],
      dislikedUsers: [],
    },
    {
      id: '3',
      title: 'Crush on My Professor',
      content: 'I have a crush on my professor but I\'m too shy to even ask a question in class. Every lecture feels like torture.',
      category: 'school',
      timestamp: '6 hours ago',
      date: 'Dec 14, 2024',
      likes: 156,
      dislikes: 23,
      comments: 23,
      isLiked: false,
      isDisliked: false,
      anonymousId: 'Shadow_Cat',
      likedUsers: [],
      dislikedUsers: [],
    },
    {
      id: '4',
      title: 'Dating App Addiction',
      content: 'I\'ve been on dating apps for 2 years and I think I\'m addicted to the validation of matches, but I never actually want to meet anyone.',
      category: 'dating',
      timestamp: '8 hours ago',
      date: 'Dec 14, 2024',
      likes: 298,
      dislikes: 45,
      comments: 89,
      isLiked: true,
      isDisliked: false,
      anonymousId: 'Digital_Nomad',
      likedUsers: ['You'],
      dislikedUsers: [],
    },
    {
      id: '5',
      title: 'How to Deal with Social Anxiety?',
      content: 'I get really anxious in social situations and avoid going out. Does anyone have tips for overcoming this?',
      category: 'questions',
      timestamp: '1 hour ago',
      date: 'Dec 15, 2024',
      likes: 67,
      dislikes: 2,
      comments: 34,
      isLiked: false,
      isDisliked: false,
      anonymousId: 'Shy_Soul',
      likedUsers: [],
      dislikedUsers: [],
    },
  ]);

  const filteredConfessions = confessions.filter(confession => {
    if (blockedUsers.includes(confession.anonymousId) || hiddenPosts.includes(confession.id)) {
      return false;
    }
    
    const matchesSearch = confession.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         confession.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || confession.category === selectedCategory;
    const matchesSection = selectedSection === 'recent' || 
                          (selectedSection === 'trending' && confession.likes > 150) ||
                          (selectedSection === 'questions' && confession.category === 'questions');
    return matchesSearch && matchesCategory && matchesSection;
  }).sort((a, b) => {
    if (selectedSection === 'trending') {
      return (b.likes + b.comments) - (a.likes + a.comments);
    }
    return 0;
  });

  const handleLike = (id: string) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === id) {
        const currentUserId = 'You';
        let newLikedUsers = [...confession.likedUsers];
        let newDislikedUsers = [...confession.dislikedUsers];
        let newLikes = confession.likes;
        let newDislikes = confession.dislikes;
        
        // Remove from disliked if currently disliked
        if (confession.isDisliked) {
          newDislikedUsers = newDislikedUsers.filter(user => user !== currentUserId);
          newDislikes = Math.max(0, newDislikes - 1);
        }
        
        // Toggle like
        if (confession.isLiked) {
          newLikedUsers = newLikedUsers.filter(user => user !== currentUserId);
          newLikes = Math.max(0, newLikes - 1);
        } else {
          newLikedUsers.push(currentUserId);
          newLikes = newLikes + 1;
        }
        
        return {
          ...confession,
          isLiked: !confession.isLiked,
          isDisliked: false,
          likes: newLikes,
          dislikes: newDislikes,
          likedUsers: newLikedUsers,
          dislikedUsers: newDislikedUsers,
        };
      }
      return confession;
    }));
  };

  const handleDislike = (id: string) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === id) {
        const currentUserId = 'You';
        let newLikedUsers = [...confession.likedUsers];
        let newDislikedUsers = [...confession.dislikedUsers];
        let newLikes = confession.likes;
        let newDislikes = confession.dislikes;
        
        // Remove from liked if currently liked
        if (confession.isLiked) {
          newLikedUsers = newLikedUsers.filter(user => user !== currentUserId);
          newLikes = Math.max(0, newLikes - 1);
        }
        
        // Toggle dislike
        if (confession.isDisliked) {
          newDislikedUsers = newDislikedUsers.filter(user => user !== currentUserId);
          newDislikes = Math.max(0, newDislikes - 1);
        } else {
          newDislikedUsers.push(currentUserId);
          newDislikes = newDislikes + 1;
        }
        
        return {
          ...confession,
          isLiked: false,
          isDisliked: !confession.isDisliked,
          likes: newLikes,
          dislikes: newDislikes,
          likedUsers: newLikedUsers,
          dislikedUsers: newDislikedUsers,
        };
      }
      return confession;
    }));
  };

  const handleUserAction = (userId: string, action: 'friend' | 'block' | 'mute' | 'report' | 'hide') => {
    switch (action) {
      case 'friend':
        Alert.alert('Friend Request', `Friend request sent to ${userId}! 📤`);
        break;
      case 'block':
        Alert.alert(
          'Block User',
          `Are you sure you want to block ${userId}? You won't see their posts anymore.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Block', 
              style: 'destructive',
              onPress: () => {
                setBlockedUsers(prev => [...prev, userId]);
                Alert.alert('Blocked', `${userId} has been blocked.`);
              }
            }
          ]
        );
        break;
      case 'mute':
        setMutedUsers(prev => [...prev, userId]);
        Alert.alert('Muted', `${userId} has been muted.`);
        break;
      case 'report':
        Alert.alert(
          'Report User',
          `Why are you reporting ${userId}?`,
          [
            { text: 'Spam', onPress: () => Alert.alert('Reported', 'Thank you for reporting. We\'ll review this user.') },
            { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Thank you for reporting. We\'ll review this user.') },
            { text: 'Harassment', onPress: () => Alert.alert('Reported', 'Thank you for reporting. We\'ll review this user.') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'hide':
        setHiddenPosts(prev => [...prev, showUserActions || '']);
        Alert.alert('Hidden', 'Post has been hidden from your feed.');
        break;
    }
    setShowUserActions(null);
  };

  const handlePostConfession = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newConfession: Confession = {
        id: Date.now().toString(),
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        timestamp: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        likes: 0,
        dislikes: 0,
        comments: 0,
        isLiked: false,
        isDisliked: false,
        anonymousId: 'You',
        likedUsers: [],
        dislikedUsers: [],
      };
      setConfessions(prev => [newConfession, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const sections = [
    { id: 'recent', name: 'Recent', icon: '🕒' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'questions', name: 'Questions', icon: '❓' },
  ];

  const renderSectionChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.sectionChip,
        selectedSection === item.id && { backgroundColor: '#6366F1' }
      ]}
      onPress={() => setSelectedSection(item.id)}
    >
      <Text style={styles.sectionIcon}>{item.icon}</Text>
      <Text style={[
        styles.sectionText,
        selectedSection === item.id && styles.selectedSectionText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }: { item: Category }) => (
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

  const renderConfession = ({ item }: { item: Confession }) => {
    const categoryInfo = getCategoryInfo(item.category);
    const isUserMuted = mutedUsers.includes(item.anonymousId);
    
    return (
      <View style={styles.confessionCard}>
        <View style={styles.confessionHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeIcon}>{categoryInfo.icon}</Text>
            <Text style={styles.categoryBadgeText}>{categoryInfo.name}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
        
        <Text style={styles.confessionTitle}>{item.title}</Text>
        <Text style={styles.confessionContent}>
          {isUserMuted ? '[Content hidden - User muted]' : item.content}
        </Text>
        
        <View style={styles.confessionFooter}>
          <TouchableOpacity 
            style={styles.anonymousIdContainer}
            onPress={() => setShowUserActions(item.id)}
          >
            <Text style={styles.anonymousId}>- {item.anonymousId}</Text>
            {isUserMuted && <VolumeX size={12} color="#666" style={{ marginLeft: 4 }} />}
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <Heart 
                size={18} 
                color={item.isLiked ? '#FF6B6B' : '#666'} 
                fill={item.isLiked ? '#FF6B6B' : 'none'}
              />
              <Text style={[styles.actionText, item.isLiked && styles.likedText]}>
                {item.likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDislike(item.id)}
            >
              <ThumbsDown 
                size={18} 
                color={item.isDisliked ? '#FF6B6B' : '#666'} 
                fill={item.isDisliked ? '#FF6B6B' : 'none'}
              />
              <Text style={[styles.actionText, item.isDisliked && styles.dislikedText]}>
                {item.dislikes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/confession/${item.id}`)}
            >
              <MessageCircle size={18} color="#666" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {showUserActions === item.id && (
          <View style={styles.userActionsModal}>
            <TouchableOpacity 
              style={styles.userActionItem}
              onPress={() => handleUserAction(item.anonymousId, 'friend')}
            >
              <UserPlus size={16} color="#4CAF50" />
              <Text style={styles.userActionText}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userActionItem}
              onPress={() => handleUserAction(item.anonymousId, 'mute')}
            >
              <VolumeX size={16} color="#FF9800" />
              <Text style={styles.userActionText}>Mute User</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userActionItem}
              onPress={() => handleUserAction(item.anonymousId, 'block')}
            >
              <Ban size={16} color="#F44336" />
              <Text style={styles.userActionText}>Block User</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userActionItem}
              onPress={() => handleUserAction(item.anonymousId, 'hide')}
            >
              <EyeOff size={16} color="#666" />
              <Text style={styles.userActionText}>Hide Post</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userActionItem}
              onPress={() => handleUserAction(item.anonymousId, 'report')}
            >
              <Flag size={16} color="#F44336" />
              <Text style={styles.userActionText}>Report User</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anonymous Confessions</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => setShowNewPost(true)}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search confessions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sections}
        renderItem={renderSectionChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionsList}
        contentContainerStyle={styles.sectionsContent}
      />

      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      <FlatList
        data={filteredConfessions}
        renderItem={renderConfession}
        keyExtractor={(item) => item.id}
        style={styles.confessionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.confessionsContent}
      />

      {showUserActions && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowUserActions(null)}
          activeOpacity={1}
        />
      )}

      <Modal
        visible={showNewPost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Confession</Text>
            <TouchableOpacity onPress={handlePostConfession}>
              <Text style={styles.modalPost}>Post</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategories}>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalCategoryChip,
                    newPostCategory === category.id && { backgroundColor: category.color }
                  ]}
                  onPress={() => setNewPostCategory(category.id)}
                >
                  <Text style={styles.modalCategoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.modalCategoryText,
                    newPostCategory === category.id && styles.selectedModalCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Give your confession a title..."
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              placeholderTextColor="#666"
            />
            
            <Text style={styles.modalLabel}>Your Confession</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Share your thoughts anonymously..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#666"
            />
            
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>
                🔒 Your identity will remain completely anonymous
              </Text>
            </View>
          </ScrollView>
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
  newPostButton: {
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
  filterButton: {
    padding: 4,
  },
  sectionsList: {
    maxHeight: 50,
  },
  sectionsContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionChip: {
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
  sectionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedSectionText: {
    color: 'white',
  },
  categoriesSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoriesList: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    backgroundColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedCategoryCount: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  confessionsList: {
    flex: 1,
  },
  confessionsContent: {
    paddingHorizontal: 16,
  },
  confessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  confessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  confessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confessionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  confessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  anonymousId: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    minWidth: 40,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  likedText: {
    color: '#FF6B6B',
  },
  dislikedText: {
    color: '#FF6B6B',
  },
  userActionsModal: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    minWidth: 150,
  },
  userActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  userActionText: {
    fontSize: 14,
    color: '#ecf0f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  modalCancel: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  modalPost: {
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
    color: '#ecf0f1',
    marginBottom: 12,
  },
  modalCategories: {
    marginBottom: 24,
  },
  modalCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34495e',
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
    color: '#ecf0f1',
  },
  selectedModalCategoryText: {
    color: 'white',
  },
  modalTitleInput: {
    borderWidth: 1,
    borderColor: '#34495e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ecf0f1',
    backgroundColor: '#34495e',
    marginBottom: 24,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#34495e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ecf0f1',
    backgroundColor: '#34495e',
    height: 200,
    marginBottom: 24,
  },
  modalFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalFooterText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
});