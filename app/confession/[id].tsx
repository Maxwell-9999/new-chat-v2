import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share, Send } from 'lucide-react-native';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export default function ConfessionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(234);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'I totally understand this feeling. You\'re not alone in this struggle.',
      author: 'SupportiveAnon',
      timestamp: '1 hour ago',
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      text: 'Have you considered talking to HR about this? They might be able to help.',
      author: 'WorkAdviser',
      timestamp: '45 min ago',
      likes: 8,
      isLiked: true,
    },
    {
      id: '3',
      text: 'Imposter syndrome is real. Maybe it\'s time to acknowledge your achievements!',
      author: 'MotivationalGhost',
      timestamp: '30 min ago',
      likes: 15,
      isLiked: false,
    },
  ]);

  const confession = {
    content: 'I\'ve been pretending to understand my job for 3 years now. I just nod and smile in meetings and somehow I got promoted twice.',
    category: 'work',
    timestamp: '2 hours ago',
    author: 'Anonymous_Phoenix',
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: 'You',
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{item.author}</Text>
        <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.commentLikeButton}
          onPress={() => handleCommentLike(item.id)}
        >
          <Heart 
            size={14} 
            color={item.isLiked ? '#FF6B6B' : '#666'} 
            fill={item.isLiked ? '#FF6B6B' : 'none'}
          />
          <Text style={[styles.commentLikeText, item.isLiked && styles.likedText]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1877F2" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confession</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.confessionCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>💼</Text>
            <Text style={styles.categoryText}>Work</Text>
          </View>
          
          <Text style={styles.confessionContent}>{confession.content}</Text>
          
          <View style={styles.confessionFooter}>
            <Text style={styles.confessionAuthor}>- {confession.author}</Text>
            <Text style={styles.confessionTimestamp}>{confession.timestamp}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Heart 
                size={20} 
                color={isLiked ? '#FF6B6B' : '#666'} 
                fill={isLiked ? '#FF6B6B' : 'none'}
              />
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color="#666" />
              <Text style={styles.actionText}>{comments.length}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
          
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a supportive comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={styles.sendCommentButton}
          onPress={handleAddComment}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  header: {
    backgroundColor: '#1877F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  confessionCard: {
    backgroundColor: '#34495e',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#bdc3c7',
  },
  confessionContent: {
    fontSize: 18,
    lineHeight: 26,
    color: '#ecf0f1',
    marginBottom: 20,
  },
  confessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confessionAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#bdc3c7',
  },
  confessionTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 16,
    color: '#bdc3c7',
    marginLeft: 6,
    fontWeight: '600',
  },
  likedText: {
    color: '#FF6B6B',
  },
  commentsSection: {
    backgroundColor: '#34495e',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 16,
  },
  commentContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1877F2',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ecf0f1',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  commentInputContainer: {
    backgroundColor: '#34495e',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#ecf0f1',
    marginRight: 8,
  },
  sendCommentButton: {
    backgroundColor: '#1877F2',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});