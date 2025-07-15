import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { User, Calendar, Users } from 'lucide-react-native';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleSignUp = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 13) {
      Alert.alert('Error', 'Please enter a valid age (13+)');
      return;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    // Check if username is unique (in real app, this would be a server call)
    Alert.alert(
      'Welcome! 🎉',
      `Your anonymous profile has been created!\n\nUsername: ${username}\nAge: ${age}\nGender: ${gender}\n\nYou can now start connecting anonymously!`,
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const generateRandomUsername = () => {
    const adjectives = ['Anonymous', 'Secret', 'Hidden', 'Mystery', 'Shadow', 'Ghost', 'Phantom', 'Silent'];
    const nouns = ['Phoenix', 'Rider', 'Cat', 'Wolf', 'Eagle', 'Tiger', 'Dragon', 'Falcon'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    setUsername(`${randomAdj}_${randomNoun}_${randomNum}`);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to AnonSocial</Text>
        <Text style={styles.headerSubtitle}>
          Create your anonymous profile to get started
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your anonymous username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#999"
              maxLength={30}
            />
          </View>
          <TouchableOpacity style={styles.generateButton} onPress={generateRandomUsername}>
            <Text style={styles.generateButtonText}>Generate Random Username</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {genders.map((genderOption) => (
              <TouchableOpacity
                key={genderOption}
                style={[
                  styles.genderOption,
                  gender === genderOption && styles.selectedGender
                ]}
                onPress={() => setGender(genderOption)}
              >
                <Users size={16} color={gender === genderOption ? 'white' : '#666'} />
                <Text style={[
                  styles.genderText,
                  gender === genderOption && styles.selectedGenderText
                ]}>
                  {genderOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Create Anonymous Profile</Text>
        </TouchableOpacity>

        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Your Privacy is Protected</Text>
          <Text style={styles.privacyText}>
            • Your real identity is never shared{'\n'}
            • All conversations are anonymous{'\n'}
            • No personal data is collected{'\n'}
            • You can change your username anytime
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    padding: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  generateButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  generateButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: '48%',
  },
  selectedGender: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  genderText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedGenderText: {
    color: 'white',
  },
  signUpButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  privacyNotice: {
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 12,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
});