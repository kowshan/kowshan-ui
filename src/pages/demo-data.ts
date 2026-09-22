// demo-data.ts — mock data for component showcase demos

export const demoItems = [
    { id: '1', title: 'آیتم اول', content: 'محتوای آیتم اول اینجاست' },
    { id: '2', title: 'آیتم دوم', content: 'محتوای آیتم دوم اینجاست' },
    { id: '3', title: 'آیتم سوم', content: 'محتوای آیتم سوم اینجاست' },
    { id: '4', title: 'آیتم چهارم', content: 'محتوای آیتم چهارم اینجاست' },
    { id: '5', title: 'آیتم پنجم', content: 'محتوای آیتم پنجم اینجاست' },
]

export const demoOptions = [
    { label: 'تهران', value: 'tehran' },
    { label: 'اصفهان', value: 'isfahan' },
    { label: 'شیراز', value: 'shiraz' },
    { label: 'تبریز', value: 'tabriz' },
    { label: 'مشهد', value: 'mashhad' },
]

export const demoChartData = [
    { label: 'فروردین', value: 45 },
    { label: 'اردیبهشت', value: 72 },
    { label: 'خرداد', value: 58 },
    { label: 'تیر', value: 90 },
    { label: 'مرداد', value: 65 },
    { label: 'شهریور', value: 80 },
    { label: 'مهر', value: 55 },
    { label: 'آبان', value: 70 },
]

export const demoHeatmapData = (() => {
    const data: Record<string, number> = {}
    for (let i = 0; i < 365; i++) {
        const d = new Date(2025, 0, 1)
        d.setDate(d.getDate() + i)
        const key = d.toISOString().slice(0, 10)
        data[key] = Math.floor(Math.random() * 12)
    }
    return data
})()

export const demoMessages = [
    { id: '1', senderId: 'u1', text: 'سلام، حالت چطوره؟', timestamp: Date.now() - 300000 },
    { id: '2', senderId: 'u2', text: 'ممنون، خوبم! تو چطوری؟', timestamp: Date.now() - 240000 },
    { id: '3', senderId: 'u1', text: 'خوبم مرسی، داشتم روی پروژه کار می‌کردم', timestamp: Date.now() - 180000 },
    { id: '4', senderId: 'u2', text: 'عالیه، منم دارم یاد می‌گیرم 🎉', timestamp: Date.now() - 60000 },
]

export const demoBreadcrumbs = [
    { label: 'خانه', to: '/' },
    { label: 'محصولات', to: '/products' },
    { label: 'جزئیات', to: '' },
]

export const demoComments = [
    {
        id: 'c1',
        userId: 'u1',
        userName: 'علی',
        userAvatar: '',
        text: 'خیلی عالی بود، ممنون از توضیحاتتون',
        timestamp: Date.now() - 3600000,
        likes: 5,
        dislikes: 0,
        reactions: [{ emoji: '👍', count: 3, reacted: false }, { emoji: '❤️', count: 1, reacted: true }],
        replies: [
            {
                id: 'r1',
                userId: 'u2',
                userName: 'سارا',
                userAvatar: '',
                text: 'موافقم',
                timestamp: Date.now() - 1800000,
                likes: 2,
                dislikes: 0,
                reactions: [],
                replies: [],
            }
        ],
    },
    {
        id: 'c2',
        userId: 'u3',
        userName: 'محمد',
        userAvatar: '',
        text: 'آیا نسخه فارسی هم دارد؟',
        timestamp: Date.now() - 7200000,
        likes: 1,
        dislikes: 0,
        reactions: [],
        replies: [],
    },
]

export const demoKanban = [
    {
        id: 'col1',
        title: 'انجام نشده',
        cards: [
            { id: 'k1', title: 'طراحی صفحه اصلی', description: 'طراحی UI صفحه لندینگ' },
            { id: 'k2', title: 'نوشتن تست‌ها', description: 'تست‌های واحد برای API' },
        ]
    },
    {
        id: 'col2',
        title: 'در حال انجام',
        cards: [
            { id: 'k3', title: 'توسعه بک‌اند', description: 'API سمت سرور' },
        ]
    },
    {
        id: 'col3',
        title: 'انجام شده',
        cards: [
            { id: 'k4', title: 'تنظیمات پروژه', description: 'راه‌اندازی اولیه' },
        ]
    },
]

export const demoJsonData = {
    name: 'K-Kit',
    version: '1.0.0',
    features: ['RTL', 'Dark Mode', 'Lazy Loading'],
    config: {
        theme: 'light',
        language: 'fa',
        direction: 'rtl',
    }
}

export const demoMarkdown = `# عنوان تست

این یک متن **بولد** و *ایتالیک* است.

## لیست
- آیتم اول
- آیتم دوم
- آیتم سوم

\`\`\`js
const hello = 'سلام دنیا'
console.log(hello)
\`\`\`
`

export const demoDiff = {
    left: `function greet(name) {
    return "Hello " + name
}

const msg = greet("World")
console.log(msg)`,
    right: `function greet(name, lang = "en") {
    const greetings = { en: "Hello", fa: "سلام" }
    return \`\${greetings[lang]} \${name}\`
}

const msg = greet("Ali", "fa")
console.log(msg)`,
}

export const demoTimeline = [
    { id: '1', title: 'ثبت‌نام', description: 'کاربر در سایت ثبت‌نام کرد', time: '۲ ساعت پیش', color: 'var(--k-primary)' },
    { id: '2', title: 'خرید اشتراک', description: 'اشتراک ۳ ماهه خریداری شد', time: '۱ ساعت پیش', color: 'var(--k-success)' },
    { id: '3', title: 'ورود به پنل', description: 'اولین ورود به پنل مدیریت', time: '۳۰ دقیقه پیش', color: 'var(--k-info)' },
]

export const demoTagInput = ['Vue', 'TypeScript', 'Tailwind']

export const demoTreeData = {
    id: 'root',
    label: 'شرکت',
    children: [
        {
            id: 'tech',
            label: 'فنی',
            children: [
                { id: 'dev', label: 'توسعه', children: [] },
                { id: 'ops', label: 'عملیات', children: [] },
            ]
        },
        {
            id: 'sales',
            label: 'فروش',
            children: [
                { id: 'online', label: 'آنلاین', children: [] },
                { id: 'offline', label: 'حضوری', children: [] },
            ]
        },
    ]
}

export const demoPermissionData = [
    {
        id: 'users',
        label: 'مدیریت کاربران',
        children: [
            { id: 'users-view', label: 'مشاهده', checked: true },
            { id: 'users-create', label: 'ایجاد', checked: false },
            { id: 'users-edit', label: 'ویرایش', checked: true },
            { id: 'users-delete', label: 'حذف', checked: false },
        ]
    },
    {
        id: 'products',
        label: 'مدیریت محصولات',
        children: [
            { id: 'products-view', label: 'مشاهده', checked: true },
            { id: 'products-create', label: 'ایجاد', checked: true },
            { id: 'products-edit', label: 'ویرایش', checked: false },
        ]
    },
]

export const demoPricingFeatures = [
    '۱۰۰ کاربر',
    'پشتیبانی ۲۴/۷',
    'فضای نامحدود',
    'API دسترسی',
]

export const demoLessonList = [
    { id: '1', title: 'مقدمه', duration: '۵:۳۰', completed: true },
    { id: '2', title: 'نصب و راه‌اندازی', duration: '۱۲:۴۵', completed: true },
    { id: '3', title: 'مباحث پیشرفته', duration: '۲۰:۱۵', completed: false },
    { id: '4', title: 'پروژه عملی', duration: '۴۵:۰۰', completed: false },
]

export const demoStoryItems = [
    { id: '1', label: 'آموزش', color: '#1db954', hasNew: true },
    { id: '2', label: 'مسابقه', color: '#f59e0b', hasNew: true },
    { id: '3', label: 'نتایج', color: '#ef4444', hasNew: false },
    { id: '4', label: 'اخبار', color: '#3b82f6', hasNew: true },
]

export const demoOrgData = {
    id: 'ceo',
    name: 'مدیرعامل',
    role: 'مدیرعامل',
    avatar: '',
    children: [
        {
            id: 'cto',
            name: 'مدیر فنی',
            role: 'CTO',
            avatar: '',
            children: [
                { id: 'dev1', name: 'توسعه‌دهنده ۱', role: 'Frontend', avatar: '', children: [] },
                { id: 'dev2', name: 'توسعه‌دهنده ۲', role: 'Backend', avatar: '', children: [] },
            ]
        },
        {
            id: 'cmo',
            name: 'مدیر بازاریابی',
            role: 'CMO',
            avatar: '',
            children: []
        },
    ]
}

export const demoGanttData = [
    { id: '1', name: 'طراحی', start: '2025-01-01', end: '2025-01-15', progress: 100, color: '#1db954' },
    { id: '2', name: 'توسعه', start: '2025-01-10', end: '2025-02-28', progress: 65, color: '#3b82f6' },
    { id: '3', name: 'تست', start: '2025-02-15', end: '2025-03-15', progress: 20, color: '#f59e0b' },
    { id: '4', name: 'استقرار', start: '2025-03-10', end: '2025-03-31', progress: 0, color: '#ef4444' },
]

export const demoContactCard = {
    name: 'علی رضایی',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    email: 'ali@example.com',
    role: 'توسعه‌دهنده',
    avatar: '',
}

export const demoCourseCard = {
    id: '1',
    title: 'آموزش Vue 3 از صفر',
    instructor: 'استاد محمدی',
    thumbnail: '',
    price: 299000,
    originalPrice: 499000,
    discount: 40,
    rating: 4.8,
    students: 1250,
    duration: '۱۲ ساعت',
    progress: 35,
    level: 'متوسط',
}

export const demoProductCard = {
    id: '1',
    name: ' هدفون بی‌سیم',
    price: 890000,
    originalPrice: 1200000,
    discount: 26,
    image: '',
    rating: 4.5,
    reviews: 234,
}

export const demoJobCard = {
    title: 'توسعه‌دهنده فرانت‌اند',
    company: 'شرکت فناوری',
    location: 'تهران',
    salary: '۱۵-۲۵ میلیون',
    type: 'تمام‌وقت',
    postedAt: '۲ روز پیش',
    tags: ['Vue', 'TypeScript', 'Tailwind'],
}

export const demoTeamCard = {
    name: 'سارا احمدی',
    role: 'طراح UI/UX',
    avatar: '',
    email: 'sara@example.com',
}

export const demoTestimonial = {
    name: 'رضا کریمی',
    role: 'مدیر پروژه',
    avatar: '',
    text: 'K-Kit بهترین کیت UI فارسی‌ست که دیدم. سرعت توسعه رو ۳ برابر کرد.',
    rating: 5,
}

export const demoQuizCard = {
    question: 'کدام مورد زیر ویژگی Vue 3 است؟',
    options: ['Composition API', 'Angular CLI', 'JSX', 'jQuery'],
    correctIndex: 0,
}

export const demoAssessment = {
    question: 'بهترین روش برای مدیریت state در Vue 3 کدام است؟',
    options: ['Redux', 'Pinia', 'Vuex', 'MobX'],
    correctIndex: 1,
}

export const demoOrderSummary = {
    items: [
        { name: 'دوره Vue 3', quantity: 1, price: 299000 },
        { name: 'دوره TypeScript', quantity: 2, price: 199000 },
    ],
    discount: 100000,
    tax: 0,
    currency: 'تومان',
}

export const demoCouponConfig = [
    { code: 'WELCOME', discount: 20, type: 'percent' as const },
    { code: 'FLAT50', discount: 50000, type: 'fixed' as const },
]

export const demoInfiniteItems = Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
    text: `آیتم شماره ${i + 1}`,
}))

export const demoFilterBarData = [
    { key: 'status', label: 'وضعیت', type: 'select' as const, options: [
        { label: 'فعال', value: 'active' },
        { label: 'غیرفعال', value: 'inactive' },
    ]},
    { key: 'date', label: 'تاریخ', type: 'text' as const },
]

export const demoVirtualListItems = Array.from({ length: 1000 }, (_, i) => ({
    id: String(i + 1),
    name: `کاربر ${i + 1}`,
    email: `user${i + 1}@example.com`,
}))
