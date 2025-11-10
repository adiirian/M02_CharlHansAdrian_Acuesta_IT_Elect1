import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Messenger() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'other', replies: [] },
    { id: '2', text: 'Hi! How are you?', sender: 'me', replies: [] },
    { id: '3', text: 'I’m okay love!', sender: 'other', replies: [] },
  ]);
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState(null);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
      replies: [],
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  const addReply = (messageId, originalText) => {
    if (replyText.trim() === '') return;
    const reply = {
      id: Date.now().toString(),
      text: replyText,
      sender: 'me',
      replyingTo: originalText,
    };
    setMessages(messages.map(message =>
      message.id === messageId
        ? { ...message, replies: [...message.replies, reply] }
        : message
    ));
    setReplyText('');
    setReplyingTo(null);
    setReplyingToMessage(null);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={[
        styles.messageRow,
        item.sender === 'me' ? styles.myMessageRow : styles.otherMessageRow
      ]}>
        {/* Avatar for 'other' person - shown on left */}
        {item.sender === 'other' && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
          </View>
        )}

        {/* Message bubble */}
        <TouchableOpacity
          onPress={() => {
            if (item.sender === 'other') {
              setReplyingTo(item.id);
              setReplyingToMessage(item.text);
            }
          }}
          style={[
            styles.message,
            item.sender === 'me' ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          {item.sender === 'other' && (
            <Text style={styles.replyText}>Reply</Text>
          )}
        </TouchableOpacity>

        {/* Avatar for 'me' - shown on right */}
        {item.sender === 'me' && (
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/images/2x2-pic.png')}
              style={styles.avatar}
            />
          </View>
        )}
      </View>

      {/* Replies */}
      <FlatList
        data={item.replies}
        keyExtractor={(reply) => reply.id}
        renderItem={({ item: reply }) => (
          <View style={styles.replyRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/images/2x2-pic.png')}
                style={styles.avatar}
              />
            </View>
            <View style={[styles.message, styles.replyBubble]}>
              {reply.replyingTo && (
                <View style={styles.replyContext}>
                  <View style={styles.replyLine} />
                  <Text style={styles.replyContextText} numberOfLines={1}>
                    {reply.replyingTo}
                  </Text>
                </View>
              )}
              <Text style={styles.messageText}>{reply.text}</Text>
            </View>
          </View>
        )}
        style={styles.repliesList}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
        />
        {replyingTo && (
          <View style={styles.replyContainer}>
            <View style={styles.replyingToPreview}>
              <Text style={styles.replyingToLabel}>Replying to:</Text>
              <Text style={styles.replyingToText} numberOfLines={1}>
                {replyingToMessage}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(null);
                  setReplyingToMessage(null);
                  setReplyText('');
                }}
                style={styles.cancelReply}
              >
                <Text style={styles.cancelReplyText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.replyInputRow}>
              <TextInput
                style={styles.input}
                placeholder="Reply..."
                value={replyText}
                onChangeText={setReplyText}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => addReply(replyingTo, replyingToMessage)}
              >
                <Text style={styles.sendText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flatList: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 5,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  message: {
    padding: 10,
    borderRadius: 18,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  replyText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  replyContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  replyingToPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyingToLabel: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  replyingToText: {
    flex: 1,
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
  cancelReply: {
    padding: 5,
  },
  cancelReplyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyContext: {
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 8,
    marginBottom: 6,
    backgroundColor: '#2a2a2a',
    padding: 6,
    borderRadius: 4,
  },
  replyLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#007AFF',
  },
  replyContextText: {
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginRight: 40,
  },
  replyBubble: {
    backgroundColor: '#555',
    borderBottomRightRadius: 4,
  },
  repliesList: {
    flexGrow: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
