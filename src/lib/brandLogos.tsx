import React from 'react';
import {
  Laptop,
  Smartphone,
  Headphones,
  Tv,
  Watch,
  Camera,
  Coffee,
  ShoppingBag,
  ShieldCheck,
  Car,
  Home,
  Music,
  Gamepad2,
  Cloud,
  FileText,
  CreditCard,
  Wifi,
  Radio,
  Server,
  Box,
  ShoppingCart,
  Utensils,
  Plane,
  Shirt,
  Wrench,
  Flame,
  Droplets,
  Building,
} from 'lucide-react';

/**
 * Brand metadata and official SVG / vector logos for Turkish and Global brands.
 */
export interface BrandDefinition {
  name: string;
  aliases: string[];
  color: string;
  domain?: string;
  simpleIconSlug?: string;
  svg?: (className?: string) => React.ReactNode;
}

export const BRAND_DEFINITIONS: BrandDefinition[] = [
  // ─── TURKEY E-COMMERCE & RETAIL ───
  {
    name: 'Trendyol',
    aliases: ['trendyol', 'trendyol yemek', 'trendyol hızlı market', 'trendyol go', 'trendyol pass'],
    color: '#F27A1A',
    domain: 'trendyol.com',
    simpleIconSlug: 'trendyol',
  },
  {
    name: 'Hepsiburada',
    aliases: ['hepsiburada', 'hepsipay', 'hepsiexpress', 'premium'],
    color: '#FF6000',
    domain: 'hepsiburada.com',
  },
  {
    name: 'Amazon Türkiye',
    aliases: ['amazon', 'amazon tr', 'amazon prime', 'prime video', 'kindle', 'alexa', 'aws'],
    color: '#FF9900',
    domain: 'amazon.com.tr',
    simpleIconSlug: 'amazon',
  },
  {
    name: 'N11',
    aliases: ['n11', 'n11.com', 'getir n11'],
    color: '#5B2C84',
    domain: 'n11.com',
  },
  {
    name: 'Çiçeksepeti',
    aliases: ['çiçeksepeti', 'ciceksepeti', 'çiçek sepeti'],
    color: '#0055A5',
    domain: 'ciceksepeti.com',
  },
  {
    name: 'Sahibinden',
    aliases: ['sahibinden', 'sahibinden.com', 's-param güvende'],
    color: '#FFE800',
    domain: 'sahibinden.com',
  },

  // ─── TURKEY SUPERMARKETS & FOOD ───
  {
    name: 'Migros',
    aliases: ['migros', 'migros sanal market', 'migros hemen', 'macrocenter', 'mion', 'money'],
    color: '#EE7203',
    domain: 'migros.com.tr',
  },
  {
    name: 'BİM',
    aliases: ['bim', 'bim market', 'bimcell'],
    color: '#E30613',
    domain: 'bim.com.tr',
  },
  {
    name: 'A101',
    aliases: ['a101', 'a101 kapıda', 'a 101', 'a101.com.tr'],
    color: '#00A3E0',
    domain: 'a101.com.tr',
  },
  {
    name: 'ŞOK Market',
    aliases: ['şok', 'sok', 'şok market', 'cepte şok'],
    color: '#FFE500',
    domain: 'sokmarket.com.tr',
  },
  {
    name: 'CarrefourSA',
    aliases: ['carrefoursa', 'carrefour', 'carrefoursa.com'],
    color: '#004E9A',
    domain: 'carrefoursa.com',
  },
  {
    name: 'Getir',
    aliases: ['getir', 'getirbüyük', 'getiryemek', 'getirçarşı', 'getir su'],
    color: '#5D3EBC',
    domain: 'getir.com',
    simpleIconSlug: 'getir',
  },
  {
    name: 'Yemeksepeti',
    aliases: ['yemeksepeti', 'yemek sepeti', 'banabi', 'yemeksepeti mahalle'],
    color: '#EA004B',
    domain: 'yemeksepeti.com',
  },

  // ─── TURKEY ELECTRONICS & TECH STORES ───
  {
    name: 'MediaMarkt',
    aliases: ['mediamarkt', 'media markt', 'medyamarkt'],
    color: '#DF0000',
    domain: 'mediamarkt.com.tr',
    simpleIconSlug: 'mediamarkt',
  },
  {
    name: 'Teknosa',
    aliases: ['teknosa', 'teknosa.com', 'preo'],
    color: '#FF6600',
    domain: 'teknosa.com',
  },
  {
    name: 'Vatan Bilgisayar',
    aliases: ['vatan', 'vatan bilgisayar', 'vatan computer'],
    color: '#003399',
    domain: 'vatanbilgisayar.com',
  },
  {
    name: 'İtopya',
    aliases: ['itopya', 'itopya.com', 'itopya bilgisayar'],
    color: '#E30613',
    domain: 'itopya.com',
  },
  {
    name: 'İncehesap',
    aliases: ['incehesap', 'incehesap.com', 'gaming gecesi'],
    color: '#28A745',
    domain: 'incehesap.com',
  },
  {
    name: 'EasyCep',
    aliases: ['easycep', 'easy cep', 'yenilenmiş telefon'],
    color: '#00C48C',
    domain: 'easycep.com',
  },

  // ─── TURKEY HOME APPLIANCES & ELECTRONICS BRANDS ───
  {
    name: 'Arçelik',
    aliases: ['arçelik', 'arcelik', 'arçelik beko'],
    color: '#E30613',
    domain: 'arcelik.com.tr',
  },
  {
    name: 'Beko',
    aliases: ['beko', 'beko türkiye'],
    color: '#0055A5',
    domain: 'beko.com.tr',
    simpleIconSlug: 'beko',
  },
  {
    name: 'Vestel',
    aliases: ['vestel', 'vestel venus', 'vestel ekspres'],
    color: '#E30613',
    domain: 'vestel.com.tr',
  },
  {
    name: 'Profilo',
    aliases: ['profilo', 'profilo dayanıklı ev aletleri'],
    color: '#003366',
    domain: 'profilo.com',
  },
  {
    name: 'Karaca',
    aliases: ['karaca', 'karaca home', 'cookplus', 'emsan', 'jumbo'],
    color: '#1C1C1C',
    domain: 'karaca.com',
  },
  {
    name: 'Tefal',
    aliases: ['tefal', 'rowenta', 'moulinex', 'wmf'],
    color: '#E30613',
    domain: 'tefal.com.tr',
  },
  {
    name: 'Korkmaz',
    aliases: ['korkmaz', 'korkmaz mutfak'],
    color: '#C8102E',
    domain: 'korkmaz.com.tr',
  },
  {
    name: 'Fakir',
    aliases: ['fakir', 'fakir hausgerate'],
    color: '#008080',
    domain: 'fakir.com.tr',
  },

  // ─── TURKEY TELECOM & UTILITIES ───
  {
    name: 'Turkcell',
    aliases: ['turkcell', 'turkcell pasaj', 'fizzy', 'superonline', 'gnç', 'paycell'],
    color: '#002B49',
    domain: 'turkcell.com.tr',
  },
  {
    name: 'Türk Telekom',
    aliases: ['türk telekom', 'turk telekom', 'ttnet', 'tivibu'],
    color: '#003366',
    domain: 'turktelekom.com.tr',
  },
  {
    name: 'Vodafone',
    aliases: ['vodafone', 'vodafone yanımda', 'vodafone pay'],
    color: '#E60000',
    domain: 'vodafone.com.tr',
    simpleIconSlug: 'vodafone',
  },
  {
    name: 'Digiturk',
    aliases: ['digiturk', 'beın sports', 'bein connect', 'tod', 'tod tv'],
    color: '#5C1D8D',
    domain: 'digiturk.com.tr',
  },
  {
    name: 'D-Smart',
    aliases: ['d-smart', 'dsmart', 'd smart'],
    color: '#0047BA',
    domain: 'dsmart.com.tr',
  },
  {
    name: 'Enerjisa',
    aliases: ['enerjisa', 'ayedaş', 'toroslar'],
    color: '#FFCC00',
    domain: 'enerjisa.com.tr',
  },
  {
    name: 'İGDAŞ',
    aliases: ['igdaş', 'igdas', 'doğalgaz', 'baskentgaz'],
    color: '#005BAC',
    domain: 'igdas.istanbul',
  },
  {
    name: 'İSKİ',
    aliases: ['iski', 'aski', 'izsu', 'su faturası'],
    color: '#006699',
    domain: 'iski.istanbul',
  },

  // ─── TURKEY FASHION & LIFESTYLE ───
  {
    name: 'LC Waikiki',
    aliases: ['lc waikiki', 'lcw', 'lcwaikiki'],
    color: '#00529C',
    domain: 'lcwaikiki.com',
  },
  {
    name: 'DeFacto',
    aliases: ['defacto', 'de facto'],
    color: '#0072CE',
    domain: 'defacto.com.tr',
  },
  {
    name: 'Mavi',
    aliases: ['mavi', 'mavi jeans', 'kartuş'],
    color: '#002B49',
    domain: 'mavi.com',
  },
  {
    name: 'Koton',
    aliases: ['koton', 'koton club'],
    color: '#E30613',
    domain: 'koton.com',
  },
  {
    name: 'Boyner',
    aliases: ['boyner', 'boyner grup', 'hopi'],
    color: '#000000',
    domain: 'boyner.com.tr',
  },
  {
    name: 'Beymen',
    aliases: ['beymen', 'beymen club'],
    color: '#1C1C1C',
    domain: 'beymen.com',
  },
  {
    name: 'Gratis',
    aliases: ['gratis', 'gratis kart'],
    color: '#7F2B88',
    domain: 'gratis.com',
  },
  {
    name: 'Watsons',
    aliases: ['watsons', 'watsons card'],
    color: '#009AA6',
    domain: 'watsons.com.tr',
  },
  {
    name: 'Flo',
    aliases: ['flo', 'flo ayakkabı', 'in street', 'lumberjack'],
    color: '#F37021',
    domain: 'flo.com.tr',
  },

  // ─── GLOBAL TECH & HARDWARE ───
  {
    name: 'Apple',
    aliases: ['apple', 'iphone', 'ipad', 'macbook', 'airpods', 'apple watch', 'imac', 'apple tv', 'apple music', 'icloud', 'magic mouse'],
    color: '#000000',
    domain: 'apple.com',
    simpleIconSlug: 'apple',
  },
  {
    name: 'Spotify',
    aliases: ['spotify', 'spotify premium', 'spotify family'],
    color: '#1DB954',
    domain: 'spotify.com',
    simpleIconSlug: 'spotify',
  },
  {
    name: 'Netflix',
    aliases: ['netflix', 'netflix 4k', 'netflix ultra'],
    color: '#E50914',
    domain: 'netflix.com',
    simpleIconSlug: 'netflix',
  },
  {
    name: 'YouTube',
    aliases: ['youtube', 'youtube premium', 'youtube music', 'google'],
    color: '#FF0000',
    domain: 'youtube.com',
    simpleIconSlug: 'youtube',
  },
  {
    name: 'Sony',
    aliases: ['sony', 'playstation', 'ps5', 'ps4', 'bravia', 'wh-1000xm4', 'wh-1000xm5', 'dualsense'],
    color: '#003791',
    domain: 'sony.com',
    simpleIconSlug: 'sony',
  },
  {
    name: 'Samsung',
    aliases: ['samsung', 'galaxy', 'galaxy s', 'galaxy z', 'qled', 'galaxy watch', 'galaxy buds', 'smartthings'],
    color: '#1428A0',
    domain: 'samsung.com',
    simpleIconSlug: 'samsung',
  },
  {
    name: 'Dyson',
    aliases: ['dyson', 'v15', 'v12', 'v11', 'airwrap', 'supersonic', 'corrale', 'purifier'],
    color: '#7F00FF',
    domain: 'dyson.com.tr',
  },
  {
    name: 'Philips',
    aliases: ['philips', 'hue', 'sonicare', 'airfryer', 'ambilight', 'lattego', 'oneblade'],
    color: '#0B5ED7',
    domain: 'philips.com.tr',
  },
  {
    name: 'Bosch',
    aliases: ['bosch', 'bosch ev', 'bulaşık makinesi', 'çamaşır makinesi', 'matkap', 'bosch powertool'],
    color: '#E20015',
    domain: 'bosch.com.tr',
    simpleIconSlug: 'bosch',
  },
  {
    name: 'Xiaomi',
    aliases: ['xiaomi', 'mi', 'redmi', 'poco', 'robot süpürge', 'mi band', 'dreame', 'roborock'],
    color: '#FF6900',
    domain: 'mi.com',
    simpleIconSlug: 'xiaomi',
  },
  {
    name: 'LG',
    aliases: ['lg', 'oled', 'nanocell', 'thinq', 'gram'],
    color: '#A50034',
    domain: 'lg.com',
    simpleIconSlug: 'lg',
  },
  {
    name: 'Dell',
    aliases: ['dell', 'xps', 'alienware', 'inspiron', 'latitude'],
    color: '#007DB8',
    domain: 'dell.com',
    simpleIconSlug: 'dell',
  },
  {
    name: 'Asus',
    aliases: ['asus', 'rog', 'zenbook', 'tuf', 'vivobook', 'zephyrus'],
    color: '#00539B',
    domain: 'asus.com',
    simpleIconSlug: 'asus',
  },
  {
    name: 'Lenovo',
    aliases: ['lenovo', 'thinkpad', 'legion', 'yoga', 'ideapad'],
    color: '#E2231A',
    domain: 'lenovo.com',
    simpleIconSlug: 'lenovo',
  },
  {
    name: 'HP',
    aliases: ['hp', 'omen', 'spectre', 'envy', 'pavilion', 'victus'],
    color: '#0096D6',
    domain: 'hp.com',
    simpleIconSlug: 'hp',
  },
  {
    name: 'Monster Notebook',
    aliases: ['monster', 'tulpar', 'abra', 'semruk', 'pusat'],
    color: '#00FF66',
    domain: 'monsternotebook.com.tr',
  },
  {
    name: 'MSI',
    aliases: ['msi', 'katana', 'raider', 'stealth', 'mag'],
    color: '#FF0000',
    domain: 'msi.com',
    simpleIconSlug: 'msi',
  },
  {
    name: 'Logitech',
    aliases: ['logitech', 'logitech g', 'mx master', 'g pro', 'g502', 'astro'],
    color: '#00B8FC',
    domain: 'logitech.com',
    simpleIconSlug: 'logitech',
  },
  {
    name: 'Razer',
    aliases: ['razer', 'deathadder', 'blackwidow', 'kraken', 'blade'],
    color: '#00FF00',
    domain: 'razer.com',
    simpleIconSlug: 'razer',
  },
  {
    name: 'JBL',
    aliases: ['jbl', 'charge', 'flip', 'boombox', 'tune', 'quantum'],
    color: '#FF3300',
    domain: 'jbl.com',
  },
  {
    name: 'Marshall',
    aliases: ['marshall', 'emberton', 'stanmore', 'acton', 'major'],
    color: '#1C1C1C',
    domain: 'marshallheadphones.com',
  },
  {
    name: 'Canon',
    aliases: ['canon', 'eos', 'pixma'],
    color: '#CC0000',
    domain: 'canon.com.tr',
    simpleIconSlug: 'canon',
  },
  {
    name: 'Nikon',
    aliases: ['nikon', 'z6', 'z8', 'nikkor'],
    color: '#FFE500',
    domain: 'nikon.com.tr',
    simpleIconSlug: 'nikon',
  },
  {
    name: 'GoPro',
    aliases: ['gopro', 'hero', 'hero 12', 'hero 11'],
    color: '#0099DA',
    domain: 'gopro.com',
    simpleIconSlug: 'gopro',
  },
  {
    name: 'Anker',
    aliases: ['anker', 'soundcore', 'eufy', 'nebula'],
    color: '#00A0E9',
    domain: 'anker-tr.com',
  },

  // ─── GLOBAL SUBSCRIPTIONS & STREAMING ───
  {
    name: 'Disney+',
    aliases: ['disney', 'disney+', 'disney plus'],
    color: '#113CCF',
    domain: 'disneyplus.com',
    simpleIconSlug: 'disneyplus',
  },
  {
    name: 'BluTV',
    aliases: ['blutv', 'blu tv'],
    color: '#00B4D8',
    domain: 'blutv.com',
  },
  {
    name: 'Exxen',
    aliases: ['exxen', 'exxen spor'],
    color: '#F7C928',
    domain: 'exxen.com',
  },
  {
    name: 'Gain',
    aliases: ['gain', 'gain medya'],
    color: '#00E5FF',
    domain: 'gain.tv',
  },
  {
    name: 'Storytel',
    aliases: ['storytel', 'sesli kitap'],
    color: '#FF5A00',
    domain: 'storytel.com',
    simpleIconSlug: 'storytel',
  },
  {
    name: 'Microsoft',
    aliases: ['microsoft', 'xbox', 'windows', 'surface', 'office', 'office 365', 'microsoft 365', 'game pass', 'onedrive'],
    color: '#00A4EF',
    domain: 'microsoft.com',
    simpleIconSlug: 'microsoft',
  },
  {
    name: 'PlayStation Plus',
    aliases: ['playstation', 'ps plus', 'psn', 'ps store'],
    color: '#003791',
    domain: 'playstation.com',
    simpleIconSlug: 'playstation',
  },
  {
    name: 'Steam',
    aliases: ['steam', 'valve', 'steam wallet'],
    color: '#171A21',
    domain: 'steampowered.com',
    simpleIconSlug: 'steam',
  },
  {
    name: 'Nintendo',
    aliases: ['nintendo', 'switch', 'switch oled', 'nintendo online'],
    color: '#E60012',
    domain: 'nintendo.com',
    simpleIconSlug: 'nintendoswitch',
  },
  {
    name: 'OpenAI / ChatGPT',
    aliases: ['chatgpt', 'openai', 'gpt-4', 'chatgpt plus', 'chatgpt pro'],
    color: '#10A37F',
    domain: 'openai.com',
    simpleIconSlug: 'openai',
  },
  {
    name: 'Claude',
    aliases: ['claude', 'anthropic', 'claude pro'],
    color: '#D97706',
    domain: 'anthropic.com',
    simpleIconSlug: 'anthropic',
  },
  {
    name: 'Midjourney',
    aliases: ['midjourney'],
    color: '#000000',
    domain: 'midjourney.com',
    simpleIconSlug: 'midjourney',
  },
  {
    name: 'Canva',
    aliases: ['canva', 'canva pro'],
    color: '#00C4CC',
    domain: 'canva.com',
    simpleIconSlug: 'canva',
  },
  {
    name: 'Adobe',
    aliases: ['adobe', 'creative cloud', 'photoshop', 'illustrator', 'premiere', 'acrobat'],
    color: '#FF0000',
    domain: 'adobe.com',
    simpleIconSlug: 'adobe',
  },
  {
    name: 'Figma',
    aliases: ['figma', 'figjam'],
    color: '#F24E1E',
    domain: 'figma.com',
    simpleIconSlug: 'figma',
  },
  {
    name: 'GitHub',
    aliases: ['github', 'copilot'],
    color: '#24292e',
    domain: 'github.com',
    simpleIconSlug: 'github',
  },
  {
    name: 'Notion',
    aliases: ['notion', 'notion ai'],
    color: '#000000',
    domain: 'notion.so',
    simpleIconSlug: 'notion',
  },
  {
    name: 'Duolingo',
    aliases: ['duolingo', 'super duolingo', 'duolingo max'],
    color: '#58CC02',
    domain: 'duolingo.com',
    simpleIconSlug: 'duolingo',
  },
  {
    name: 'Strava',
    aliases: ['strava', 'strava summit'],
    color: '#FC4C02',
    domain: 'strava.com',
    simpleIconSlug: 'strava',
  },

  // ─── GLOBAL RETAIL & LIFESTYLE ───
  {
    name: 'IKEA',
    aliases: ['ikea', 'ikea aile'],
    color: '#0058A3',
    domain: 'ikea.com.tr',
    simpleIconSlug: 'ikea',
  },
  {
    name: 'Zara',
    aliases: ['zara', 'zara home', 'inditex'],
    color: '#000000',
    domain: 'zara.com',
    simpleIconSlug: 'zara',
  },
  {
    name: 'H&M',
    aliases: ['h&m', 'hm', 'h & m'],
    color: '#CD1A1A',
    domain: 'hm.com',
  },
  {
    name: 'Nike',
    aliases: ['nike', 'air jordan', 'air max', 'nike run'],
    color: '#000000',
    domain: 'nike.com',
    simpleIconSlug: 'nike',
  },
  {
    name: 'Adidas',
    aliases: ['adidas', 'yeezy', 'samba', 'gazelle', 'ultraboost'],
    color: '#000000',
    domain: 'adidas.com.tr',
    simpleIconSlug: 'adidas',
  },
  {
    name: 'Puma',
    aliases: ['puma'],
    color: '#BA0C2F',
    domain: 'puma.com',
    simpleIconSlug: 'puma',
  },
  {
    name: 'Starbucks',
    aliases: ['starbucks', 'starbucks card', 'yıldız', 'frappuccino'],
    color: '#006241',
    domain: 'starbucks.com.tr',
    simpleIconSlug: 'starbucks',
  },
  {
    name: 'Decathlon',
    aliases: ['decathlon', 'quechua', 'kalenji', 'btwin', 'kipsta'],
    color: '#0082C3',
    domain: 'decathlon.com.tr',
    simpleIconSlug: 'decathlon',
  },
  {
    name: 'Sephora',
    aliases: ['sephora', 'sephora gold'],
    color: '#000000',
    domain: 'sephora.com.tr',
    simpleIconSlug: 'sephora',
  },

  // ─── AUTOMOTIVE ───
  {
    name: 'Tesla',
    aliases: ['tesla', 'model y', 'model 3', 'supercharger'],
    color: '#E82127',
    domain: 'tesla.com',
    simpleIconSlug: 'tesla',
  },
  {
    name: 'BMW',
    aliases: ['bmw', 'borusan oto'],
    color: '#0066B1',
    domain: 'bmw.com.tr',
    simpleIconSlug: 'bmw',
  },
  {
    name: 'Mercedes-Benz',
    aliases: ['mercedes', 'mercedes-benz'],
    color: '#000000',
    domain: 'mercedes-benz.com.tr',
    simpleIconSlug: 'mercedes',
  },
  {
    name: 'Audi',
    aliases: ['audi', 'doğuş oto'],
    color: '#BB0A30',
    domain: 'audi.com.tr',
    simpleIconSlug: 'audi',
  },
  {
    name: 'Volkswagen',
    aliases: ['volkswagen', 'vw', 'golf', 'passat', 'polo', 'tiguan'],
    color: '#151F6D',
    domain: 'vw.com.tr',
    simpleIconSlug: 'volkswagen',
  },
  {
    name: 'TOGG',
    aliases: ['togg', 't10x', 'trugo'],
    color: '#00A3E0',
    domain: 'togg.com.tr',
  },
];

/**
 * Intelligent Brand Identification from text
 */
export function findBrand(text: string): BrandDefinition | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // 1. Direct name match
  for (const def of BRAND_DEFINITIONS) {
    if (def.name.toLowerCase() === clean) return def;
  }

  // 2. Exact alias match or word match
  for (const def of BRAND_DEFINITIONS) {
    for (const alias of def.aliases) {
      if (clean === alias || clean.startsWith(`${alias} `) || clean.endsWith(` ${alias}`) || clean.includes(` ${alias} `)) {
        return def;
      }
    }
  }

  // 3. Substring match
  for (const def of BRAND_DEFINITIONS) {
    for (const alias of def.aliases) {
      if (clean.includes(alias)) {
        return def;
      }
    }
  }

  return null;
}

/**
 * Helper to build Google/Clearbit High-Res Favicon CDN URL for any merchant domain
 */
export function getDomainFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Returns a sleek category icon component based on product name or brand keywords.
 */
export function getCategoryFallbackIcon(name: string, brand?: string) {
  const query = `${name || ''} ${brand || ''}`.toLowerCase();

  if (query.match(/telefon|iphone|samsung|galaxy|xiaomi|redmi|huawei|oppo|pixel|mobil|cep/)) {
    return Smartphone;
  }
  if (query.match(/laptop|bilgisayar|macbook|dell|lenovo|thinkpad|asus|hp|notebook|pc|monster|msi|monitör/)) {
    return Laptop;
  }
  if (query.match(/kulaklık|airpods|headphone|buds|wh-1000|ses|speaker|hoparlör|jbl|marshall|bose/)) {
    return Headphones;
  }
  if (query.match(/tv|televizyon|oled|qled|ekran|display|bravia/)) {
    return Tv;
  }
  if (query.match(/saat|watch|band|bileklik|garmin|apple watch/)) {
    return Watch;
  }
  if (query.match(/kamera|fotoğraf|canon|nikon|sony alpha|gopro|video/)) {
    return Camera;
  }
  if (query.match(/kahve|makarna|tencere|mutfak|airfryer|blender|dyson|süpürge|ütü|bulaşık|çamaşır|buzdolabı/)) {
    return Coffee;
  }
  if (query.match(/konsol|oyun|playstation|ps5|xbox|nintendo|switch|steam/)) {
    return Gamepad2;
  }
  if (query.match(/araba|araç|lastik|oto|tesla|bmw|mercedes|audi|togg|yakıt|benzin|opet|shell/)) {
    return Car;
  }
  if (query.match(/ev|mobilya|yatak|koltuk|ikea|doğtaş|kelebek|enza/)) {
    return Home;
  }
  if (query.match(/müzik|spotify|apple music|deezer|fizy/)) {
    return Music;
  }
  if (query.match(/cloud|drive|dropbox|icloud|depolama|sunucu|server/)) {
    return Cloud;
  }
  if (query.match(/giyim|ayakkabı|nike|adidas|zara|elbise|mont|koton|lcw|defacto|mavi/)) {
    return Shirt;
  }
  if (query.match(/market|migros|bim|a101|şok|carrefour|getir|gıda|yemek|restoran/)) {
    return ShoppingCart;
  }
  if (query.match(/elektrik|su|doğalgaz|fatura|enerjisa|igdaş|iski|turkcell|telekom|vodafone/)) {
    return FileText;
  }
  if (query.match(/seyahat|bilet|uçak|otel|thy|pegasus|turna|obilet/)) {
    return Plane;
  }

  return ShieldCheck;
}
