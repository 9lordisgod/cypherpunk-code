import type { Locale } from "./types";
import {
  pageStringsEn,
  pageStringsFr,
  pageStringsJa,
  pageStringsZhCN,
} from "./pageStrings";

const en = {
  // Language picker
  langPickerTitle: "Choose your language",
  langPickerSubtitle: "Pick a language — we'll translate the whole site for you!",
  langPickerContinue: "Continue",
  langPickerMadeIn: "Made with ♥ for freedom learners worldwide",

  // Nav
  navDoc: "DOC",
  navCourses: "Bitcoin Course",
  navCatalog: "Catalog",
  navPaths: "Learning Paths",
  navAbout: "About",
  navLanguage: "Language",
  navMenuOpen: "Open menu",
  navMenuClose: "Close menu",

  // Hero
  heroBadge: "Crypto Wikipedia",
  heroTitle1: "The database of crypto.",
  heroTitle2: "The Wikipedia of the industry.",
  heroDescription:
    "A living database of the crypto world — the Wikipedia of the crypto industry. Cypherpunk education, curated resources, and encyclopedic coverage of protocols, privacy, history, and tools.",
  heroBrowse: "Browse {count} resources",
  heroPaths: "Learning paths",
  heroCuratedBy: "Curated by",

  // Archive notice
  archiveNotice:
    "The crypto industry's Wikipedia — catalog updated continuously. Content concerns?",
  archiveContact: "Contact",
  archivePolicyTitle: "Catalog & maintenance policy",
  archivePolicy1:
    "{name} is a database of the crypto world and a Wikipedia of the crypto industry — courses, papers, guides, and documentation curated for learners. It is a reference encyclopedia, not a commercial product or trading platform.",
  archivePolicy2:
    "The catalog and database are maintained and expanded on an ongoing basis. New resources, corrections, and metadata updates are applied as they become available.",
  archivePolicy3:
    "If you are a rights holder or contributor and are not satisfied with how your material is listed, contact {handle} — affected content will be reviewed and can be removed promptly.",
  archiveReadPolicy: "Read full policy",

  // Sections
  featuredTitle: "Featured",
  featuredSubtitle: "Highest-signal starting points",
  viewAll: "View all",
  browseByTopic: "Browse by topic",
  learningPathsTitle: "Learning paths",
  learningPathsSubtitle:
    "Curated sequences — wiki-style structure, product-quality curation",
  allPaths: "All paths",
  steps: "{count} steps",

  // Stats
  statResources: "Resources",
  statPaths: "Learning paths",
  statTypes: "Resource types",
  statFree: "Free resources",

  // Footer
  footerExplore: "Explore",
  footerSupport: "Support",
  footerDonate: "Donate BTC/XMR",
  footerContact: "Contact us",
  footerTagline: "Crypto Wikipedia",
  footerNote: "Cypherpunk Education & Crypto Wikipedia",

  // Labels
  topicBitcoin: "Bitcoin",
  topicMonero: "Monero",
  topicPrivacy: "Privacy",
  topicCryptography: "Cryptography",
  topicOpsec: "OpSec",
  topicCypherpunk: "Cypherpunk",
  topicLightning: "Lightning",
  topicMining: "Mining",
  topicNodes: "Nodes",
  topicWallets: "Wallets",
  topicGeneralCrypto: "General Crypto",

  typeCourse: "Course",
  typeBook: "Book",
  typePaper: "Paper",
  typeGuide: "Guide",
  typeWiki: "Wiki",
  typeVideo: "Video",
  typeDocumentation: "Docs",
  typeManifesto: "Manifesto",
  typeEvent: "Event",
  typePodcast: "Podcast",
  typeTool: "Tool",

  difficultyBeginner: "Beginner",
  difficultyIntermediate: "Intermediate",
  difficultyAdvanced: "Advanced",

  pricingFree: "Free",
  pricingPaid: "Paid",
  pricingFreemium: "Freemium",

  ...pageStringsEn,
};

type TranslationStrings = { [K in keyof typeof en]: string };

const zhCN: TranslationStrings = {
  langPickerTitle: "选择你的语言",
  langPickerSubtitle: "选择一种语言 — 我们会为你翻译整个网站！",
  langPickerContinue: "继续",
  langPickerMadeIn: "用 ♥ 为全球自由学习者制作",

  navDoc: "文档",
  navCourses: "比特币课程",
  navCatalog: "资源目录",
  navPaths: "学习路径",
  navAbout: "关于",
  navLanguage: "语言",
  navMenuOpen: "打开菜单",
  navMenuClose: "关闭菜单",

  heroBadge: "加密维基百科",
  heroTitle1: "加密世界的数据库。",
  heroTitle2: "加密行业的维基百科。",
  heroDescription:
    "加密世界的活数据库 — 加密行业的维基百科。密码朋克教育、精选资源，以及协议、隐私、历史与工具的百科式覆盖。",
  heroBrowse: "浏览 {count} 个资源",
  heroPaths: "学习路径",
  heroCuratedBy: "策划者",

  archiveNotice: "加密行业的维基百科 — 目录持续更新。内容疑虑？",
  archiveContact: "联系",
  archivePolicyTitle: "目录与维护政策",
  archivePolicy1:
    "{name} 是加密世界的数据库和加密行业的维基百科 — 为学习者策划的课程、论文、指南和文档。它是参考百科，不是商业产品或交易平台。",
  archivePolicy2:
    "目录和数据库持续维护和扩展。新的资源、修正和元数据更新会在可用时应用。",
  archivePolicy3:
    "如果您是权利持有人或贡献者，对您的材料列载方式不满意，请联系 {handle} — 受影响的内容将被审查并可迅速移除。",
  archiveReadPolicy: "阅读完整政策",

  featuredTitle: "精选",
  featuredSubtitle: "最高信号的起点",
  viewAll: "查看全部",
  browseByTopic: "按主题浏览",
  learningPathsTitle: "学习路径",
  learningPathsSubtitle: "精心策划的序列 — 维基风格结构，产品级策划",
  allPaths: "所有路径",
  steps: "{count} 步骤",

  statResources: "资源",
  statPaths: "学习路径",
  statTypes: "资源类型",
  statFree: "免费资源",

  footerExplore: "探索",
  footerSupport: "支持",
  footerDonate: "捐赠 BTC/XMR",
  footerContact: "联系我们",
  footerTagline: "加密维基百科",
  footerNote: "密码朋克教育与加密维基百科",

  topicBitcoin: "比特币",
  topicMonero: "门罗币",
  topicPrivacy: "隐私",
  topicCryptography: "密码学",
  topicOpsec: "操作安全",
  topicCypherpunk: "密码朋克",
  topicLightning: "闪电网络",
  topicMining: "挖矿",
  topicNodes: "节点",
  topicWallets: "钱包",
  topicGeneralCrypto: "一般加密",

  typeCourse: "课程",
  typeBook: "书籍",
  typePaper: "论文",
  typeGuide: "指南",
  typeWiki: "维基",
  typeVideo: "视频",
  typeDocumentation: "文档",
  typeManifesto: "宣言",
  typeEvent: "活动",
  typePodcast: "播客",
  typeTool: "工具",

  difficultyBeginner: "初学者",
  difficultyIntermediate: "中级",
  difficultyAdvanced: "进阶",

  pricingFree: "免费",
  pricingPaid: "付费",
  pricingFreemium: "免费增值",

  ...pageStringsZhCN,
};

const ja: TranslationStrings = {
  langPickerTitle: "言語を選んでください",
  langPickerSubtitle: "言語を選ぶと、サイト全体が翻訳されます！",
  langPickerContinue: "続ける",
  langPickerMadeIn: "世界中の自由学習者のために ♥ を込めて制作",

  navDoc: "DOC",
  navCourses: "ビットコインコース",
  navCatalog: "カタログ",
  navPaths: "学習パス",
  navAbout: "概要",
  navLanguage: "言語",
  navMenuOpen: "メニューを開く",
  navMenuClose: "メニューを閉じる",

  heroBadge: "暗号ウィキペディア",
  heroTitle1: "暗号世界のデータベース。",
  heroTitle2: "暗号業界のウィキペディア。",
  heroDescription:
    "暗号世界の生きたデータベース — 暗号業界のウィキペディア。サイファーパンク教育、厳選リソース、プロトコル・プライバシー・歴史・ツールの百科的カバレッジ。",
  heroBrowse: "{count} 件のリソースを見る",
  heroPaths: "学習パス",
  heroCuratedBy: "キュレーション",

  archiveNotice:
    "暗号業界のウィキペディア — カタログは継続的に更新。コンテンツに関する懸念？",
  archiveContact: "連絡",
  archivePolicyTitle: "カタログとメンテナンス方針",
  archivePolicy1:
    "{name} は暗号世界のデータベースであり暗号業界のウィキペディアです — 学習者向けにキュレーションされたコース、論文、ガイド、ドキュメント。参照百科であり、商業製品や取引プラットフォームではありません。",
  archivePolicy2:
    "カタログとデータベースは継続的にメンテナンス・拡張されています。新しいリソース、修正、メタデータの更新は利用可能になり次第適用されます。",
  archivePolicy3:
    "権利者または貢献者で、素材の掲載方法に不満がある場合は {handle} にご連絡ください — 該当コンテンツは審査され、迅速に削除できます。",
  archiveReadPolicy: "完全な方針を読む",

  featuredTitle: "おすすめ",
  featuredSubtitle: "最高シグナルの出発点",
  viewAll: "すべて見る",
  browseByTopic: "トピックで探す",
  learningPathsTitle: "学習パス",
  learningPathsSubtitle:
    "厳選されたシーケンス — ウィキスタイルの構造、プロダクト品質のキュレーション",
  allPaths: "すべてのパス",
  steps: "{count} ステップ",

  statResources: "リソース",
  statPaths: "学習パス",
  statTypes: "リソースタイプ",
  statFree: "無料リソース",

  footerExplore: "探索",
  footerSupport: "サポート",
  footerDonate: "BTC/XMR を寄付",
  footerContact: "お問い合わせ",
  footerTagline: "暗号ウィキペディア",
  footerNote: "サイファーパンク教育と暗号ウィキペディア",

  topicBitcoin: "ビットコイン",
  topicMonero: "モネロ",
  topicPrivacy: "プライバシー",
  topicCryptography: "暗号学",
  topicOpsec: "OpSec",
  topicCypherpunk: "サイファーパンク",
  topicLightning: "ライトニング",
  topicMining: "マイニング",
  topicNodes: "ノード",
  topicWallets: "ウォレット",
  topicGeneralCrypto: "一般暗号",

  typeCourse: "コース",
  typeBook: "書籍",
  typePaper: "論文",
  typeGuide: "ガイド",
  typeWiki: "ウィキ",
  typeVideo: "動画",
  typeDocumentation: "ドキュメント",
  typeManifesto: "マニフェスト",
  typeEvent: "イベント",
  typePodcast: "ポッドキャスト",
  typeTool: "ツール",

  difficultyBeginner: "初級",
  difficultyIntermediate: "中級",
  difficultyAdvanced: "上級",

  pricingFree: "無料",
  pricingPaid: "有料",
  pricingFreemium: "フリーミアム",

  ...pageStringsJa,
};

const fr: TranslationStrings = {
  langPickerTitle: "Choisissez votre langue",
  langPickerSubtitle:
    "Choisissez une langue — nous traduirons tout le site pour vous !",
  langPickerContinue: "Continuer",
  langPickerMadeIn: "Fait avec ♥ pour les apprenants du monde entier",

  navDoc: "DOC",
  navCourses: "Cours Bitcoin",
  navCatalog: "Catalogue",
  navPaths: "Parcours",
  navAbout: "À propos",
  navLanguage: "Langue",
  navMenuOpen: "Ouvrir le menu",
  navMenuClose: "Fermer le menu",

  heroBadge: "Wikipédia crypto",
  heroTitle1: "La base de données du monde crypto.",
  heroTitle2: "La Wikipédia de l'industrie.",
  heroDescription:
    "Une base de données vivante du monde crypto — la Wikipédia de l'industrie cryptographique. Éducation cypherpunk, ressources curatées et couverture encyclopédique des protocoles, de la vie privée, de l'histoire et des outils.",
  heroBrowse: "Parcourir {count} ressources",
  heroPaths: "Parcours d'apprentissage",
  heroCuratedBy: "Curaté par",

  archiveNotice:
    "La Wikipédia de l'industrie crypto — catalogue mis à jour en continu. Des préoccupations sur le contenu ?",
  archiveContact: "Contacter",
  archivePolicyTitle: "Politique du catalogue et de maintenance",
  archivePolicy1:
    "{name} est une base de données du monde crypto et la Wikipédia de l'industrie — cours, articles, guides et documentation pour les apprenants. C'est une encyclopédie de référence, pas un produit commercial ni une plateforme de trading.",
  archivePolicy2:
    "Le catalogue et la base de données sont maintenus et élargis en continu. De nouvelles ressources, corrections et mises à jour de métadonnées sont appliquées dès qu'elles sont disponibles.",
  archivePolicy3:
    "Si vous êtes un titulaire de droits ou un contributeur et n'êtes pas satisfait de la façon dont votre matériel est répertorié, contactez {handle} — le contenu concerné sera examiné et peut être retiré rapidement.",
  archiveReadPolicy: "Lire la politique complète",

  featuredTitle: "En vedette",
  featuredSubtitle: "Les meilleurs points de départ",
  viewAll: "Voir tout",
  browseByTopic: "Parcourir par sujet",
  learningPathsTitle: "Parcours d'apprentissage",
  learningPathsSubtitle:
    "Séquences curatées — structure wiki, curation de qualité produit",
  allPaths: "Tous les parcours",
  steps: "{count} étapes",

  statResources: "Ressources",
  statPaths: "Parcours",
  statTypes: "Types de ressources",
  statFree: "Ressources gratuites",

  footerExplore: "Explorer",
  footerSupport: "Soutien",
  footerDonate: "Donner BTC/XMR",
  footerContact: "Nous contacter",
  footerTagline: "Wikipédia crypto",
  footerNote: "Cypherpunk Education & Crypto Wikipedia",

  topicBitcoin: "Bitcoin",
  topicMonero: "Monero",
  topicPrivacy: "Vie privée",
  topicCryptography: "Cryptographie",
  topicOpsec: "OpSec",
  topicCypherpunk: "Cypherpunk",
  topicLightning: "Lightning",
  topicMining: "Minage",
  topicNodes: "Nœuds",
  topicWallets: "Portefeuilles",
  topicGeneralCrypto: "Crypto général",

  typeCourse: "Cours",
  typeBook: "Livre",
  typePaper: "Article",
  typeGuide: "Guide",
  typeWiki: "Wiki",
  typeVideo: "Vidéo",
  typeDocumentation: "Docs",
  typeManifesto: "Manifeste",
  typeEvent: "Événement",
  typePodcast: "Podcast",
  typeTool: "Outil",

  difficultyBeginner: "Débutant",
  difficultyIntermediate: "Intermédiaire",
  difficultyAdvanced: "Avancé",

  pricingFree: "Gratuit",
  pricingPaid: "Payant",
  pricingFreemium: "Freemium",

  ...pageStringsFr,
};

export const translations: Record<Locale, TranslationStrings> = {
  en,
  "zh-CN": zhCN,
  ja,
  fr,
};

export type { TranslationStrings };

export function t(
  locale: Locale,
  key: keyof TranslationStrings,
  vars?: Record<string, string | number>
): string {
  let text: string = translations[locale][key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}