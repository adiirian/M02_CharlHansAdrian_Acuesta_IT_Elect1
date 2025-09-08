import { useState } from 'react';
import {
  FlatList,
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

  const addReply = (messageId) => {
    if (replyText.trim() === '') return;
    const reply = {
      id: Date.now().toString(),
      text: replyText,
      sender: 'me',
    };
    setMessages(messages.map(message =>
      message.id === messageId
        ? { ...message, replies: [...message.replies, reply] }
        : message
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <TouchableOpacity
        onPress={() => setReplyingTo(item.id)}
        style={[
          styles.message,
          item.sender === 'me' ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.replyText}>Reply</Text>
      </TouchableOpacity>
      <FlatList
        data={item.replies}
        keyExtractor={(reply) => reply.id}
        renderItem={({ item: reply }) => (
          <View style={[styles.message, styles.replyBubble]}>
            <Text style={styles.messageText}>{reply.text}</Text>
          </View>
        )}
        style={styles.repliesList}
        scrollEnabled={false}
      />
    </View>
  );

  return (
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
          <TextInput
            style={styles.input}
            placeholder="Reply..."
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => addReply(replyingTo)}>
            <Text style={styles.sendText}>Reply</Text>
          </TouchableOpacity>
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
  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
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
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  replyBubble: {
    marginLeft: 20,
    backgroundColor: '#555',
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
