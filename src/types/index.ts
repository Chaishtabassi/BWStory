export interface Post {
  id: string;
  name: string;
  avatar: string;
  date: string;
  location: string;
  views: number;
  content: string;
  likes: number;
  dislikes: number;
  image?: string;
}

export interface UserProfile {
  name: string;
  gender: string;
  location: string;
  profession: string;
  bio: string;
}

export type RootStackParamList = {
  Discover: undefined;
  Profile: undefined;
};