import {
  CodeBracketIcon,
  NewspaperIcon,
  FilmIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  PaintBrushIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  MusicalNoteIcon,
  CurrencyDollarIcon,
  HeartIcon,
  GlobeAltIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

export const categories = [
  { label: 'All Categories', value: 'all', icon: HashtagIcon },
  { label: 'Technology', value: 'tech', icon: CodeBracketIcon },
  { label: 'News & Media', value: 'news', icon: NewspaperIcon },
  { label: 'Entertainment', value: 'entertainment', icon: FilmIcon },
  { label: 'Education', value: 'education', icon: AcademicCapIcon },
  { label: 'Business', value: 'business', icon: BuildingOfficeIcon },
  { label: 'Sports', value: 'sports', icon: TrophyIcon },
  { label: 'Art & Design', value: 'art', icon: PaintBrushIcon },
  { label: 'Science', value: 'science', icon: BeakerIcon },
  { label: 'Gaming', value: 'gaming', icon: PuzzlePieceIcon },
  { label: 'Music', value: 'music', icon: MusicalNoteIcon },
  { label: 'Cryptocurrency', value: 'crypto', icon: CurrencyDollarIcon },
  { label: 'Lifestyle', value: 'lifestyle', icon: HeartIcon },
  { label: 'Travel', value: 'travel', icon: GlobeAltIcon },
  { label: 'Photography', value: 'photography', icon: PhotoIcon },
  { label: 'Social', value: 'social', icon: ChatBubbleLeftRightIcon },
  { label: 'Startups', value: 'startups', icon: RocketLaunchIcon },
  { label: 'Shopping', value: 'shopping', icon: ShoppingBagIcon },
  { label: 'Community', value: 'community', icon: UserGroupIcon },
];

export const memberRanges = [
  { label: 'Any size', value: 'any', min: 0, max: Infinity },
  { label: '1K - 10K', value: '1k-10k', min: 1000, max: 10000 },
  { label: '10K - 50K', value: '10k-50k', min: 10000, max: 50000 },
  { label: '50K - 100K', value: '50k-100k', min: 50000, max: 100000 },
  { label: '100K+', value: '100k+', min: 100000, max: Infinity },
];

export const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Most Active', value: 'active' },
  { label: 'Verified Only', value: 'verified' },
]; 