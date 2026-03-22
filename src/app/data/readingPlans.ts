export interface ReadingPlanDay {
  day: number;
  readings: Array<{
    book: string;
    chapter: number;
    verses?: string; // e.g., "1-5" or null for whole chapter
  }>;
  devotional?: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageUrl: string;
  days: ReadingPlanDay[];
}

export const readingPlans: ReadingPlan[] = [
  {
    id: 'one-year-bible',
    title: 'One Year Bible',
    description: 'Read through the entire Bible in one year with daily readings from Old Testament, New Testament, Psalms, and Proverbs.',
    duration: '365 days',
    category: 'Complete Bible',
    imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=400',
    days: [
      {
        day: 1,
        readings: [
          { book: 'Genesis', chapter: 1 },
          { book: 'Genesis', chapter: 2 },
          { book: 'Matthew', chapter: 1 },
          { book: 'Psalms', chapter: 1 },
        ],
      },
      {
        day: 2,
        readings: [
          { book: 'Genesis', chapter: 3 },
          { book: 'Matthew', chapter: 2 },
          { book: 'Psalms', chapter: 2 },
        ],
      },
      // More days would be added in a real app
    ],
  },
  {
    id: 'gospels-30',
    title: 'Life of Jesus',
    description: 'Journey through the life of Jesus Christ by reading all four Gospels in 30 days.',
    duration: '30 days',
    category: 'New Testament',
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400',
    days: [
      {
        day: 1,
        readings: [{ book: 'Matthew', chapter: 1 }],
        devotional: 'Reflect on the genealogy of Jesus and how God has been working throughout history.',
      },
      {
        day: 2,
        readings: [{ book: 'Matthew', chapter: 2 }],
        devotional: 'Consider the fulfillment of prophecy in the birth and early life of Jesus.',
      },
      {
        day: 3,
        readings: [{ book: 'Matthew', chapter: 3 }],
      },
      {
        day: 4,
        readings: [{ book: 'Matthew', chapter: 4 }],
      },
      {
        day: 5,
        readings: [{ book: 'Matthew', chapter: 5 }],
        devotional: 'The Beatitudes teach us about the character of kingdom citizens.',
      },
    ],
  },
  {
    id: 'psalms-proverbs',
    title: 'Wisdom & Worship',
    description: 'Daily readings from Psalms and Proverbs for worship and practical wisdom.',
    duration: '31 days',
    category: 'Wisdom',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    days: [
      {
        day: 1,
        readings: [
          { book: 'Psalms', chapter: 1 },
          { book: 'Proverbs', chapter: 1 },
        ],
        devotional: 'Start your day with worship and end with wisdom.',
      },
      {
        day: 2,
        readings: [
          { book: 'Psalms', chapter: 2 },
          { book: 'Proverbs', chapter: 2 },
        ],
      },
    ],
  },
  {
    id: 'new-testament-90',
    title: 'New Testament in 90 Days',
    description: 'Read the entire New Testament in three months with guided daily readings.',
    duration: '90 days',
    category: 'New Testament',
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400',
    days: [
      {
        day: 1,
        readings: [{ book: 'Matthew', chapter: 1 }],
      },
    ],
  },
  {
    id: 'prayer-devotional',
    title: 'Prayer & Devotion',
    description: 'A 7-day journey through key scriptures on prayer and developing a deeper relationship with God.',
    duration: '7 days',
    category: 'Devotional',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    days: [
      {
        day: 1,
        readings: [{ book: 'Matthew', chapter: 6, verses: '5-15' }],
        devotional: 'Jesus teaches us the Lord\'s Prayer - a model for our communication with the Father.',
      },
      {
        day: 2,
        readings: [{ book: 'Psalms', chapter: 23 }],
        devotional: 'The Lord is our shepherd - trust in His guidance and provision.',
      },
    ],
  },
  {
    id: 'faith-foundations',
    title: 'Foundations of Faith',
    description: 'Build a strong foundation with key doctrinal passages over 14 days.',
    duration: '14 days',
    category: 'Foundational',
    imageUrl: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400',
    days: [
      {
        day: 1,
        readings: [{ book: 'Genesis', chapter: 1 }],
        devotional: 'In the beginning, God created - understanding our Creator.',
      },
      {
        day: 2,
        readings: [{ book: 'John', chapter: 1 }],
        devotional: 'The Word became flesh - the incarnation of Christ.',
      },
    ],
  },
];
