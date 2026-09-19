export type ThemePreset = "classic" | "romantic" | "luxury" | "minimal" | "modern";

export interface WeddingTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  preset: ThemePreset;
}

export interface Wedding {
  id: string;
  ownerUid: string;
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate: string; // ISO date string
  description: string;
  heroText: string;
  published: boolean;
  theme: WeddingTheme;
  coverImage?: string;
  illustration?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const WEDDING_ILLUSTRATIONS = [
  { id: "hearts", label: "Love hearts", emoji: "💕" },
  { id: "couple", label: "Happy couple", emoji: "🥰" },
  { id: "celebration", label: "Celebration", emoji: "🥳" },
  { id: "sparkles", label: "Joy and sparkle", emoji: "✨" },
  { id: "rings", label: "Wedding rings", emoji: "💍" },
  { id: "flowers", label: "Happy flowers", emoji: "🌸" },
  { id: "love-birds", label: "Love birds", emoji: "🐦💕" },
  { id: "dancing", label: "Happy dance", emoji: "💃🕺" },
  { id: "hug", label: "Warm hug", emoji: "🤗" },
  { id: "kiss", label: "Sweet kiss", emoji: "💋" },
  { id: "rose", label: "Red rose", emoji: "🌹" },
  { id: "bouquet", label: "Wedding bouquet", emoji: "💐" },
  { id: "cake", label: "Wedding cake", emoji: "🎂" },
  { id: "champagne", label: "Cheers", emoji: "🥂" },
  { id: "confetti", label: "Confetti", emoji: "🎉" },
  { id: "balloons", label: "Party balloons", emoji: "🎈" },
  { id: "gift", label: "Love gift", emoji: "🎁" },
  { id: "teddy", label: "Love teddy", emoji: "🧸" },
  { id: "cats", label: "Happy cats", emoji: "😻🐱" },
  { id: "dogs", label: "Happy puppies", emoji: "🐶💖" },
  { id: "bunnies", label: "Sweet bunnies", emoji: "🐰💕" },
  { id: "pandas", label: "Cute pandas", emoji: "🐼💞" },
  { id: "koalas", label: "Cuddly koalas", emoji: "🐨" },
  { id: "foxes", label: "Love foxes", emoji: "🦊❤️" },
  { id: "bears", label: "Bear hugs", emoji: "🐻🤎" },
  { id: "penguins", label: "Sweet penguins", emoji: "🐧💙" },
  { id: "lions", label: "Brave love", emoji: "🦁" },
  { id: "unicorn", label: "Magic love", emoji: "🦄✨" },
  { id: "butterflies", label: "Love butterflies", emoji: "🦋" },
  { id: "bees", label: "Busy in love", emoji: "🐝💛" },
  { id: "ladybugs", label: "Lucky love", emoji: "🐞" },
  { id: "rainbow", label: "Happy rainbow", emoji: "🌈" },
  { id: "sunshine", label: "Sunshine joy", emoji: "🌞" },
  { id: "moon", label: "Moonlight love", emoji: "🌙💕" },
  { id: "stars", label: "Starry joy", emoji: "🌟" },
  { id: "fireworks", label: "Wedding fireworks", emoji: "🎆" },
  { id: "music", label: "Love music", emoji: "🎶" },
  { id: "microphone", label: "Happy song", emoji: "🎤" },
  { id: "guitar", label: "Wedding melody", emoji: "🎸" },
  { id: "camera", label: "Happy memories", emoji: "📸" },
  { id: "letter", label: "Love letter", emoji: "💌" },
  { id: "lock", label: "Locked hearts", emoji: "💞" },
  { id: "heart-box", label: "Heart box", emoji: "💝" },
  { id: "growing-love", label: "Growing love", emoji: "💗" },
  { id: "heart-ribbon", label: "Heart ribbon", emoji: "💟" },
  { id: "peace", label: "Peaceful love", emoji: "☮️💕" },
  { id: "home", label: "Happy home", emoji: "🏡❤️" },
  { id: "church", label: "Wedding day", emoji: "⛪💍" },
  { id: "car", label: "Just married", emoji: "🚗💐" },
  { id: "travel", label: "Love adventure", emoji: "✈️💕" },
  { id: "island", label: "Island romance", emoji: "🏝️" },
  { id: "coffee", label: "Sweet moments", emoji: "☕💖" },
  { id: "dessert", label: "Sweet celebration", emoji: "🍰✨" },
  { id: "cherries", label: "Cherry love", emoji: "🍒💕" },
  { id: "apples", label: "Happy together", emoji: "🍎💞" },
] as const;

export interface WeddingEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string; // HH:mm
  location: string;
  address: string;
  mapsUrl?: string;
  description?: string;
  icon: string;
  order: number;
}

export type AttendanceStatus = "attending" | "not_attending" | "maybe" | "unspecified";
export type MessageStatus = "pending" | "approved" | "rejected";

export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  attendanceStatus: AttendanceStatus;
  status: MessageStatus;
  createdAt?: any;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  publicId: string;
  caption?: string;
  order: number;
  createdAt?: any;
}

export const THEME_PRESETS: Record<ThemePreset, WeddingTheme> = {
  classic: {
    primaryColor: "#C9A66B",
    secondaryColor: "#2B2723",
    backgroundColor: "#FBF8F3",
    textColor: "#2B2723",
    accentColor: "#E9DCC3",
    headingFont: "Marcellus",
    bodyFont: "Jost",
    preset: "classic",
  },
  romantic: {
    primaryColor: "#C89AA0",
    secondaryColor: "#4A2E2E",
    backgroundColor: "#FFF7F5",
    textColor: "#4A2E2E",
    accentColor: "#F3DEDE",
    headingFont: "Cormorant Garamond",
    bodyFont: "Jost",
    preset: "romantic",
  },
  luxury: {
    primaryColor: "#D4AF37",
    secondaryColor: "#161412",
    backgroundColor: "#0F0E0C",
    textColor: "#F5EFE4",
    accentColor: "#2B2723",
    headingFont: "Marcellus",
    bodyFont: "Jost",
    preset: "luxury",
  },
  minimal: {
    primaryColor: "#111111",
    secondaryColor: "#555555",
    backgroundColor: "#FFFFFF",
    textColor: "#111111",
    accentColor: "#EEEEEE",
    headingFont: "Marcellus",
    bodyFont: "Jost",
    preset: "minimal",
  },
  modern: {
    primaryColor: "#8A7B6C",
    secondaryColor: "#1F1F1F",
    backgroundColor: "#F7F5F2",
    textColor: "#1F1F1F",
    accentColor: "#E4DFD6",
    headingFont: "Marcellus",
    bodyFont: "Jost",
    preset: "modern",
  },
};
