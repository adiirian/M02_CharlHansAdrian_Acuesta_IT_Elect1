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
  View
} from 'react-native';
import { colors } from '../theme/colors';

export default function Comments() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'Profile Refresh',
      content: 'Hello! Meet my latest portrait shot—feeling confident and ready for the week.',
      image: require('../assets/images/ashley.jpg'),
      likes: 12,
      comments: [],
    },
    {
      id: '2',
      title: 'Coffee Catch-up',
      content: 'Captured a candid moment during our design sync. Bright spaces keep ideas flowing!',
      image: require('../assets/images/sunset.jpg'),
      likes: 20,
      comments: [],
    },
    {
      id: '3',
      title: 'Weekend Notes',
      content: 'Wrapped another sprint and treated myself to a mini photoshoot—balance is key.',
      image: require('../assets/images/food.jpg'),
      likes: 18,
      comments: [],
    },
  ]);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const addComment = (postId) => {
    const commentText = commentInputs[postId] || '';
    if (commentText.trim() === '') return;
    const comment = {
      id: Date.now().toString(),
      text: commentText,
      replies: [],
    };
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const addReply = (postId, commentId) => {
    if (replyText.trim() === '') return;
    const reply = {
      id: Date.now().toString(),
      text: replyText,
    };
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, replies: [...comment.replies, reply] }
                : comment
            )
          }
        : post
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Image source={item.image} style={styles.postImage} />
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Text style={styles.actionText}>👍 {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {item.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📤 Share</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={item.comments}
        keyExtractor={(comment) => comment.id}
        renderItem={({ item: comment }) => renderComment(comment, item.id)}
        style={styles.commentsList}
        scrollEnabled={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textSecondary}
          value={commentInputs[item.id] || ''}
          onChangeText={(text) => setCommentInputs({ ...commentInputs, [item.id]: text })}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => addComment(item.id)}>
          <Text style={styles.sendText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComment = (comment, postId) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentBubble}>
        <Text style={styles.commentText}>{comment.text}</Text>
        <TouchableOpacity onPress={() => setReplyingTo({ postId, commentId: comment.id })}>
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>
      </View>
      {replyingTo && replyingTo.postId === postId && replyingTo.commentId === comment.id && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reply..."
            placeholderTextColor={colors.textSecondary}
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => addReply(postId, comment.id)}>
            <Text style={styles.sendText}>Reply</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={comment.replies}
        keyExtractor={(reply) => reply.id}
        renderItem={({ item: reply }) => (
          <View style={[styles.commentBubble, styles.replyBubble]}>
            <Text style={styles.commentText}>{reply.text}</Text>
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
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          style={styles.postsList}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  postsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  postContainer: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.textPrimary,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.textSecondary,
  },
  commentsList: {
    flexGrow: 0,
  },
  commentContainer: {
    marginLeft: 20,
    marginVertical: 5,
  },
  commentBubble: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    maxWidth: '90%',
  },
  replyBubble: {
    marginLeft: 20,
    backgroundColor: colors.surface,
  },
  commentText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  replyText: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  repliesList: {
    flexGrow: 0,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {
    padding: 5,
  },
  actionText: {
    fontSize: 16,
    color: colors.accent,
  },
});
