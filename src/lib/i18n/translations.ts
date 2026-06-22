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
  langPickerMadeIn: "Made with ♥ in Canada",

  // Nav
  navDoc: "DOC",
  navCourses: "Bitcoin Course",
  navCatalog: "Catalog",
  navPaths: "Learning Paths",
  navAbout: "About",
  navRoadmap: "Roadmap",
  navLanguage: "Language",
  navMenuOpen: "Open menu",
  navMenuClose: "Close menu",

  // Hero
  heroBadge: "Cypherpunk Archive Database",
  heroTitle1: "Learn sovereignty.",
  heroTitle2: "Skip the trading noise.",
  heroDescription:
    "A curated, searchable archive of courses, papers, guides, and documentation for learning cryptocurrency, privacy technology, and cypherpunk philosophy — maintained continuously, without the trading noise.",
  heroBrowse: "Browse {count} resources",
  heroPaths: "Learning paths",
  heroCuratedBy: "Curated by",
  heroCanadaProud: "Proudly built in Canada 🇨🇦",

  // Archive notice
  archiveNotice:
    "An open archive of cypherpunk education — catalog updated continuously. Content concerns?",
  archiveContact: "Contact",
  archivePolicyTitle: "Archive & maintenance policy",
  archivePolicy1:
    "{name} is an archive database of cypherpunk information and education — courses, papers, guides, and documentation gathered from public sources. It is a reference index for learners, not a commercial product or trading platform.",
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
  footerTagline: "Open archive database for Bitcoin, Monero & cypherpunk education",
  footerNote: "Cypherpunk Code — open-source crypto education",

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
  langPickerMadeIn: "在加拿大用 ♥ 制作",

  navDoc: "文档",
  navCourses: "比特币课程",
  navCatalog: "资源目录",
  navPaths: "学习路径",
  navAbout: "关于",
  navRoadmap: "路线图",
  navLanguage: "语言",
  navMenuOpen: "打开菜单",
  navMenuClose: "关闭菜单",

  heroBadge: "密码朋克档案数据库",
  heroTitle1: "学习主权。",
  heroTitle2: "跳过交易杂音。",
  heroDescription:
    "精心策划、可搜索的课程、论文、指南和文档档案，用于学习加密货币、隐私技术和密码朋克哲学 — 持续维护，没有交易杂音。",
  heroBrowse: "浏览 {count} 个资源",
  heroPaths: "学习路径",
  heroCuratedBy: "策划者",
  heroCanadaProud: "自豪地在加拿大制作 🇨🇦",

  archiveNotice: "开放的密码朋克教育档案 — 目录持续更新。内容疑虑？",
  archiveContact: "联系",
  archivePolicyTitle: "档案与维护政策",
  archivePolicy1:
    "{name} 是一个密码朋克资讯与教育的档案数据库 — 从公开来源收集的课程、论文、指南和文档。它是学习者的参考索引，不是商业产品或交易平台。",
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
  footerTagline: "比特币、门罗币与密码朋克教育的开放档案数据库",
  footerNote: "Cypherpunk Code — 开源加密教育",

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
  langPickerMadeIn: "カナダで ♥ を込めて制作",

  navDoc: "DOC",
  navCourses: "ビットコインコース",
  navCatalog: "カタログ",
  navPaths: "学習パス",
  navAbout: "概要",
  navRoadmap: "ロードマップ",
  navLanguage: "言語",
  navMenuOpen: "メニューを開く",
  navMenuClose: "メニューを閉じる",

  heroBadge: "サイファーパンク アーカイブ データベース",
  heroTitle1: "主権を学ぼう。",
  heroTitle2: "トレードのノイズはスキップ。",
  heroDescription:
    "暗号通貨、プライバシー技術、サイファーパンク哲学を学ぶための、厳選された検索可能なコース、論文、ガイド、ドキュメントのアーカイブ — 継続的にメンテナンス、トレードのノイズなし。",
  heroBrowse: "{count} 件のリソースを見る",
  heroPaths: "学習パス",
  heroCuratedBy: "キュレーション",
  heroCanadaProud: "カナダで誇りを持って制作 🇨🇦",

  archiveNotice:
    "オープンなサイファーパンク教育アーカイブ — カタログは継続的に更新。コンテンツに関する懸念？",
  archiveContact: "連絡",
  archivePolicyTitle: "アーカイブとメンテナンス方針",
  archivePolicy1:
    "{name} はサイファーパンク情報と教育のアーカイブデータベースです — 公開ソースから集めたコース、論文、ガイド、ドキュメント。学習者のための参照インデックスであり、商業製品や取引プラットフォームではありません。",
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
  footerTagline:
    "ビットコイン、モネロ、サイファーパンク教育のオープンアーカイブデータベース",
  footerNote: "Cypherpunk Code — オープンソース暗号教育",

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
  langPickerMadeIn: "Fait avec ♥ au Canada",

  navDoc: "DOC",
  navCourses: "Cours Bitcoin",
  navCatalog: "Catalogue",
  navPaths: "Parcours",
  navAbout: "À propos",
  navRoadmap: "Feuille de route",
  navLanguage: "Langue",
  navMenuOpen: "Ouvrir le menu",
  navMenuClose: "Fermer le menu",

  heroBadge: "Base de données d'archives cypherpunk",
  heroTitle1: "Apprenez la souveraineté.",
  heroTitle2: "Ignorez le bruit du trading.",
  heroDescription:
    "Une archive consultable de cours, articles, guides et documentation pour apprendre la cryptomonnaie, la technologie de la vie privée et la philosophie cypherpunk — maintenue en continu, sans le bruit du trading.",
  heroBrowse: "Parcourir {count} ressources",
  heroPaths: "Parcours d'apprentissage",
  heroCuratedBy: "Curaté par",
  heroCanadaProud: "Fièrement construit au Canada 🇨🇦",

  archiveNotice:
    "Une archive ouverte d'éducation cypherpunk — catalogue mis à jour en continu. Des préoccupations sur le contenu ?",
  archiveContact: "Contacter",
  archivePolicyTitle: "Politique d'archive et de maintenance",
  archivePolicy1:
    "{name} est une base de données d'archives d'informations et d'éducation cypherpunk — cours, articles, guides et documentation recueillis de sources publiques. C'est un index de référence pour les apprenants, pas un produit commercial ni une plateforme de trading.",
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
  footerTagline:
    "Base de données d'archives ouverte pour Bitcoin, Monero et l'éducation cypherpunk",
  footerNote: "Cypherpunk Code — éducation crypto open source",

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