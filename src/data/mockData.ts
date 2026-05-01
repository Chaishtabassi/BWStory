import { Post } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    name: 'Amit saxena',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    date: '7th July',
    location: 'Sec-15, Noida',
    views: 253,
    content: 'Kerala journalist Siddique Kappan\'s mother passes away at 90. She was suffering from age-related illnesses and breathed her last at her residence in Malappuram district.',
    likes: 124,
    dislikes: 3,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    date: '6th July',
    location: 'Connaught Place, Delhi',
    views: 1892,
    content: 'Breaking: Heavy rainfall alert issued for Mumbai and surrounding areas. Citizens advised to stay indoors.',
    likes: 567,
    dislikes: 12,
  },
  {
    id: '3',
    name: 'Rahul Verma',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    date: '5th July',
    location: 'Indiranagar, Bangalore',
    views: 445,
    content: 'Tech conference 2024 announced in Bangalore next month. Top industry leaders to participate.',
    likes: 234,
    dislikes: 8,
  },
];