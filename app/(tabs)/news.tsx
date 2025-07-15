import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Bell, Calendar, Star, Zap, Shield, Users, MessageCircle, Heart } from 'lucide-react-native';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'update' | 'feature' | 'security' | 'community';
  date: string;
  timestamp: string;
  isImportant: boolean;
  likes: number;
  comments: number;
}

export default function NewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Enhanced Privacy Features Released! 🔒',
      content: 'We\'ve added new end-to-end encryption for all private rooms and improved anonymous ID generation. Your privacy is our top priority, and these updates ensure even better protection of your identity.',
      type: 'security',
      date: 'Dec 15, 2024',
      timestamp: '2 hours ago',
      isImportant: true,
      likes: 234,
      comments: 45,
    },
    {
      id: '2',
      title: 'New Confession Categories Added',
      content: 'Based on your feedback, we\'ve added new categories including Mental Health, Career Advice, and Relationship Tips. Share your thoughts in these specialized spaces for better community support.',
      type: 'feature',
      date: 'Dec 14, 2024',
      timestamp: '1 day ago',
      isImportant: false,
      likes: 189,
      comments: 67,
    },
    {
      id: '3',
      title: 'Community Milestone: 100K Anonymous Users! 🎉',
      content: 'We\'ve reached an incredible milestone of 100,000 anonymous users! Thank you for making this platform a safe space for authentic conversations. Here\'s to many more meaningful connections.',
      type: 'community',
      date: 'Dec 12, 2024',
      timestamp: '3 days ago',
      isImportant: true,
      likes: 567,
      comments: 123,
    },
    {
      id: '4',
      title: 'Performance Improvements & Bug Fixes',
      content: 'This update includes faster message loading, improved search functionality, and fixes for room creation issues. We\'ve also optimized the app for better battery life.',
      type: 'update',
      date: 'Dec 10, 2024',
      timestamp: '5 days ago',
      isImportant: false,
      likes: 98,
      comments: 23,
    },
    {
      id: '5',
      title: 'New Moderation Tools for Room Admins',
      content: 'Room administrators now have access to advanced moderation tools including member management, message filtering, and automated spam detection to maintain healthy discussions.',
      type: 'feature',
      date: 'Dec 8, 2024',
      timestamp: '1 week ago',
      isImportant: false,
      likes: 156,
      comments: 34,
    },
    {
      id: '6',
      title: 'Security Update: Enhanced Anonymous Protection',
      content: 'We\'ve implemented additional security measures to protect user anonymity, including improved IP masking and enhanced data encryption. Your safety remains our priority.',
      type: 'security',
      date: 'Dec 5, 2024',
      timestamp: '10 days ago',
      isImportant: true,
      likes: 298,
      comments: 78,
    },
  ];

  const filters = [
    { id: 'all', name: 'All Updates', icon: '📢', color: '#6366F1' },
    { id: 'feature', name: 'Features', icon: '✨', color: '#8B5CF6' },
    { id: 'security', name: 'Security', icon: '🔒', color: '#EF4444' },
    { id: 'update', name: 'Updates', icon: '🔄', color: '#10B981' },
    { id: 'community', name: 'Community', icon: '👥', color: '#F59E0B' },
  ];

  const filteredNews = newsItems.filter(item => 
    selectedFilter === 'all' || item.type === selectedFilter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Star size={16} color="#8B5CF6" />;
      case 'security': return <Shield size={16} color="#EF4444" />;
      case 'update': return <Zap size={16} color="#10B981" />;
      case 'community': return <Users size={16} color="#F59E0B" />;
      default: return <Bell size={16} color="#6366F1" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return '#8B5CF6';
      case 'security': return '#EF4444';
      case 'update': return '#10B981';
      case 'community': return '#F59E0B';
      default: return '#6366F1';
    }
  };

  const renderFilterChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item.id && { backgroundColor: item.color }
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Text style={styles.filterIcon}>{item.icon}</Text>
      <Text style={[
        styles.filterText,
        selectedFilter === item.id && styles.selectedFilterText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={[styles.newsCard, item.isImportant && styles.importantCard]}>
      {item.isImportant && (
        <View style={styles.importantBadge}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={styles.importantText}>Important</Text>
        </View>
      )}
      
      <View style={styles.newsHeader}>
        <View style={styles.typeContainer}>
          {getTypeIcon(item.type)}
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={12} color="#666" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsContent}>{item.content}</Text>
      
      <View style={styles.newsFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <View style={styles.engagementStats}>
          <View style={styles.statItem}>
            <Heart size={14} color="#FF6B6B" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={14} color="#666" />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News & Updates</Text>
        <View style={styles.headerBadge}>
          <Bell size={16} color="white" />
          <Text style={styles.headerBadgeText}>Live</Text>
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Stay Updated! 📱</Text>
        <Text style={styles.welcomeText}>
          Get the latest news about new features, security updates, and community highlights.
        </Text>
      </View>

      <FlatList
        data={filters}
        renderItem={renderFilterChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersList}
        contentContainerStyle={styles.filtersContent}
      />

      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        style={styles.newsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.newsContent}
      />
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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  welcomeSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  filtersList: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
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
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedFilterText: {
    color: 'white',
  },
  newsList: {
    flex: 1,
  },
  newsContent: {
    paddingHorizontal: 16,
  },
  newsCard: {
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
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  importantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  importantText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
    marginLeft: 4,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  engagementStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});