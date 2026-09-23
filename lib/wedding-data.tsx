export type Language = 'zh' | 'en';

export type TimelineItem = {
  time: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
};

export type Guest = {
  id: string;
  nameZh: string;
  nameEn: string;
  tableNumber: number;
};

export type TableItem = {
  number: number;
  seats: number;
  labelZh: string;
  labelEn: string;
};

export type WeddingData = {
  coupleNameZh: string;
  coupleNameEn: string;
  date: string;
  venueName: string;
  venueAddress: string;
  venueAddressZh: string;
  venueMapUrl: string;
  parkingInfoZh: string;
  parkingInfoEn: string;
  timeline: TimelineItem[];
  tables: TableItem[];
  guests: Guest[];
};

export const STORAGE_KEY = 'geneva-ken-wedding-data';
export const ADMIN_PASSWORD = 'wmhotel2026';

export const defaultWeddingData: WeddingData = {
  coupleNameZh: 'Geneva & Ken',
  coupleNameEn: 'Geneva & Ken',
  date: '12.12.2026',
  venueName: 'WM Hotel',
  venueAddress: '28 Wai Man Rd, Sai Kung, New Territories',
  venueAddressZh: '西貢惠民路 28 號',
  venueMapUrl: 'https://maps.google.com/?q=28+Wai+Man+Rd+Sai+Kung+Hong+Kong',
  parkingInfoZh: '泊車資料將於稍後更新。',
  parkingInfoEn: 'Parking details will be shared soon.',
  timeline: [
    {
      time: '16:00',
      titleZh: '證婚',
      titleEn: 'Ceremony',
      descriptionZh: '開放入場，見證婚禮儀式。',
      descriptionEn: 'Guest arrival and wedding ceremony.'
    },
    {
      time: '18:00',
      titleZh: '恭候',
      titleEn: 'Welcome',
      descriptionZh: '賓客落座，迎接新郎新娘。',
      descriptionEn: 'Welcome guests and await the newlyweds.'
    },
    {
      time: '19:00',
      titleZh: '入席',
      titleEn: 'Dinner Seating',
      descriptionZh: '晚宴入席，開席用餐。',
      descriptionEn: 'Dinner seating and reception begins.'
    }
  ],
  tables: Array.from({ length: 25 }, (_, index) => ({
    number: index + 1,
    seats: 12 + (index % 2 === 0 ? 1 : 0),
    labelZh: `桌 ${index + 1}`,
    labelEn: `Table ${index + 1}`
  })),
  guests: [
    { id: 'g1', nameZh: '陳大文', nameEn: 'Chan Tai Man', tableNumber: 1 },
    { id: 'g2', nameZh: '李小明', nameEn: 'Lee Siu Ming', tableNumber: 1 },
    { id: 'g3', nameZh: '王小姐', nameEn: 'Wong Sze Man', tableNumber: 2 },
    { id: 'g4', nameZh: '張先生', nameEn: 'Cheung Ho Ming', tableNumber: 2 },
    { id: 'g5', nameZh: '林小姐', nameEn: 'Lam Wai Yee', tableNumber: 3 },
    { id: 'g6', nameZh: '周柏宇', nameEn: 'Chow Pak Yu', tableNumber: 3 },
    { id: 'g7', nameZh: '朱小玲', nameEn: 'Chu Siu Ling', tableNumber: 4 },
    { id: 'g8', nameZh: '周嘉慧', nameEn: 'Chow Ka Wai', tableNumber: 4 },
    { id: 'g9', nameZh: '鄭建業', nameEn: 'Cheng Kin Yip', tableNumber: 5 },
    { id: 'g10', nameZh: '何美玲', nameEn: 'Ho Mei Ling', tableNumber: 5 },
    { id: 'g11', nameZh: '馮志強', nameEn: 'Fung Chi Keung', tableNumber: 6 },
    { id: 'g12', nameZh: '梁淑芬', nameEn: 'Leung Suk Fan', tableNumber: 6 },
    { id: 'g13', nameZh: '黃家豪', nameEn: 'Wong Ka Ho', tableNumber: 7 },
    { id: 'g14', nameZh: '潘秀英', nameEn: 'Poon Sau Ying', tableNumber: 7 },
    { id: 'g15', nameZh: '鄧偉文', nameEn: 'Tang Wai Man', tableNumber: 8 },
    { id: 'g16', nameZh: '姚詩敏', nameEn: 'Yiu Sze Man', tableNumber: 8 },
    { id: 'g17', nameZh: '吳國強', nameEn: 'Ng Kwok Keung', tableNumber: 9 },
    { id: 'g18', nameZh: '許嘉琪', nameEn: 'Hui Ka Ki', tableNumber: 9 },
    { id: 'g19', nameZh: '歐陽嘉敏', nameEn: 'Ouyang Ka Man', tableNumber: 10 },
    { id: 'g20', nameZh: '曾子傑', nameEn: 'Tsang Tsz Kit', tableNumber: 10 },
    { id: 'g21', nameZh: '黃婉玲', nameEn: 'Wong Yuen Ling', tableNumber: 11 },
    { id: 'g22', nameZh: '陳志豪', nameEn: 'Chan Chi Ho', tableNumber: 11 },
    { id: 'g23', nameZh: '關家怡', nameEn: 'Kwan Ka Yi', tableNumber: 12 },
    { id: 'g24', nameZh: '何俊傑', nameEn: 'Ho Chun Kit', tableNumber: 12 },
    { id: 'g25', nameZh: '廖麗娟', nameEn: 'Liu Lai Kuen', tableNumber: 13 },
    { id: 'g26', nameZh: '邱建國', nameEn: 'Yau Kin Kwok', tableNumber: 13 },
    { id: 'g27', nameZh: '劉健華', nameEn: 'Lau Kin Wah', tableNumber: 14 },
    { id: 'g28', nameZh: '柯雯雯', nameEn: 'Or Man Man', tableNumber: 14 },
    { id: 'g29', nameZh: '戴志明', nameEn: 'Tai Chi Ming', tableNumber: 15 },
    { id: 'g30', nameZh: '高麗麗', nameEn: 'Ko Lai Lai', tableNumber: 15 }
  ]
};
