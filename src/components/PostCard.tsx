import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Post } from '../types';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes);
  
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
      setLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setLiked(true);
      if (disliked) {
        setDislikesCount(dislikesCount - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikesCount(dislikesCount - 1);
      setDisliked(false);
    } else {
      setDislikesCount(dislikesCount + 1);
      setDisliked(true);
      if (liked) {
        setLikesCount(likesCount - 1);
        setLiked(false);
      }
    }
  };

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
  };

  const handleBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
  };

  const handleSeek = (value: number) => {
    const seekTime = value * duration;
    videoRef.current?.seek(seekTime);
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{post.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.date}>{post.date}</Text>
            <Text style={styles.dot}>•</Text>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ 
            uri: post.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }}
          style={styles.video}
          paused={paused}
          resizeMode="cover"
          onLoad={(data) => {
            setDuration(data.duration);
            setIsLoading(false);
          }}
          onProgress={(data) => {
            setCurrentTime(data.currentTime);
          }}
          repeat={true}
        />
        
        <TouchableOpacity 
          style={styles.videoOverlay} 
          onPress={handlePlayPause}
          activeOpacity={0.9}
        >
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Icon name="hourglass-empty" size={40} color="#fff" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          
          {!isLoading && paused && (
            <View style={styles.playButton}>
              <Icon name="play-arrow" size={50} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.controlBar}>
          <TouchableOpacity onPress={handleBackward} style={styles.controlButton}>
            <Icon name="replay-10" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
            <Icon name={paused ? "play-arrow" : "pause"} size={28} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleForward} style={styles.controlButton}>
            <Icon name="forward-10" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <View style={styles.progressBar}>
            <TouchableOpacity 
              style={styles.progressTouchArea}
              onPress={(event) => {
                const { locationX } = event.nativeEvent;
                const progress = locationX / (width - 32 - 80);
                handleSeek(Math.max(0, Math.min(1, progress)));
              }}
            >
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(currentTime / duration) * 100}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Icon name="visibility" size={18} color="#666" />
        <Text style={styles.viewsText}>{post.views} Views</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Icon 
            name="thumb-up" 
            size={24} 
            color={liked ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
          <Icon 
            name="thumb-down" 
            size={24} 
            color={disliked ? '#f44336' : '#666'} 
          />
          <Text style={[styles.actionText, disliked && styles.dislikedText]}>
            {dislikesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={24} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  dot: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  content: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    flex: 1,
  },
  progressTouchArea: {
    height: 30,
    justifyContent: 'center',
  },
  progressBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  likedText: {
    color: '#4CAF50',
  },
  dislikedText: {
    color: '#f44336',
  },
});

export default PostCard;