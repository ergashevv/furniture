import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning database...')

  // Delete all data in correct order (due to foreign keys)
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.galleryItem.deleteMany()
  await prisma.service.deleteMany()
  await prisma.store.deleteMany()
  await prisma.review.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.category.deleteMany()
  await prisma.admin.deleteMany()

  console.log('✅ Database cleaned')

  console.log('🌱 Starting seed with multilingual data...')

  // Create Categories (4 categories)
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        nameUz: 'Ovqatlanish Xonasi',
        nameRu: 'Столовая',
        slug: 'dining',
        descriptionUz: 'Zamonaviy va shinam ovqatlanish xonasi mebellari',
        descriptionRu: 'Современная и уютная мебель для столовой',
      },
    }),
    prisma.category.create({
      data: {
        nameUz: 'Yashash Xonasi',
        nameRu: 'Гостиная',
        slug: 'living',
        descriptionUz: 'Qulay va zamonaviy yashash xonasi mebellari',
        descriptionRu: 'Удобная и современная мебель для гостиной',
      },
    }),
    prisma.category.create({
      data: {
        nameUz: 'Yotoq Xonasi',
        nameRu: 'Спальня',
        slug: 'bedroom',
        descriptionUz: 'Hashamatli yotoq xonasi mebellari',
        descriptionRu: 'Роскошная мебель для спальни',
      },
    }),
    prisma.category.create({
      data: {
        nameUz: 'Ofis',
        nameRu: 'Офис',
        slug: 'office',
        descriptionUz: 'Professional ofis mebellari',
        descriptionRu: 'Профессиональная офисная мебель',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  const diningCategory = categories.find((c) => c.slug === 'dining')!
  const livingCategory = categories.find((c) => c.slug === 'living')!
  const bedroomCategory = categories.find((c) => c.slug === 'bedroom')!
  const officeCategory = categories.find((c) => c.slug === 'office')!

  // Create Products (5 products with professional furniture fields)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        nameUz: 'Elegant Ovqatlanish To\'plami',
        nameRu: 'Элегантный обеденный набор',
        slug: 'elegant-dining-set',
        descriptionUz: 'Zamonaviy eleganlik va an\'anaviy hunarmandchilikni uyg\'unlashtirgan ovqatlanish to\'plami. Premium eman yog\'ochdan yasalgan, qo\'lda ishlangan detallar bilan. 8 kishilik to\'plam.',
        descriptionRu: 'Современная элегантность и традиционное мастерство объединены в обеденном наборе. Изготовлен из премиум дуба с ручной обработкой деталей. Набор на 8 персон.',
        price: 4500.0,
        originalPrice: 5200.0,
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
          'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80',
        ],
        categoryId: diningCategory.id,
        featured: true,
        visible: true,
        material: 'Premium eman yog\'och',
        materialDetails: '100% tabiiy eman yog\'och, qo\'lda ishlangan, ekologik toza lak bilan qoplangan',
        dimensions: '220x100x75 cm (uzunlik x kenglik x balandlik)',
        weight: '85 kg',
        capacity: '8 kishilik',
        style: 'Modern Classic',
        finish: 'Matte Natural',
        legStyle: 'Trapezoidal',
        assemblyRequired: true,
        assemblyInfo: 'Professional o\'rnatish tavsiya etiladi. O\'rnatish xizmati mavjud.',
        deliveryInfo: 'Toshkentda 3-5 kun ichida bepul yetkazib beramiz. Viloyatlarga 7-10 kun.',
        careInstructions: 'Nam mato bilan tozalang. Quyosh nuriga to\'g\'ridan-to\'g\'ri qo\'ymang. 6 oyda bir marta yog\'och parvarish vositasini qo\'llang.',
        warranty: '3 yil kafolat',
        colors: ['#8B4513', '#D2691E', '#CD853F'],
        colorVariants: [
          {
            name: 'Tabiiy Eman',
            hex: '#8B4513',
            imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
          },
          {
            name: 'Qora Eman',
            hex: '#2C1810',
            imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80',
          },
        ],
        storage: false,
        adjustable: false,
      },
    }),
    prisma.product.create({
      data: {
        nameUz: 'Zamonaviy Divan To\'plami',
        nameRu: 'Современная коллекция диванов',
        slug: 'modern-sofa-collection',
        descriptionUz: 'Zamonaviy divan dizayni, premium mato bilan. Chuqur o\'tirish, yumshoq yostiqlar va zarif chiziqlar bilan.',
        descriptionRu: 'Современный дизайн дивана с премиум тканью. Глубокое сиденье, мягкие подушки и элегантные линии.',
        price: 3200.0,
        originalPrice: 3800.0,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
        ],
        categoryId: livingCategory.id,
        featured: true,
        visible: true,
        material: 'Premium mato, metall karkas',
        materialDetails: 'Yevropa matosi, qattiq metall karkas, yuqori sifatli penopolisterol to\'ldiruvchi',
        dimensions: '240x95x85 cm',
        weight: '65 kg',
        capacity: '3 kishilik',
        style: 'Modern',
        finish: 'Matte',
        frameMaterial: 'Qattiq metall karkas',
        cushionMaterial: 'Yuqori zichlikdagi penopolisterol + g\'o\'za',
        legStyle: 'Metall oyoqlar',
        seatHeight: '42 cm',
        backSupport: true,
        armrests: true,
        storage: false,
        adjustable: false,
        assemblyRequired: true,
        assemblyInfo: 'Yig\'ish talab qilinadi. O\'rnatish xizmati mavjud.',
        deliveryInfo: 'Toshkentda 5-7 kun ichida bepul yetkazib beramiz.',
        careInstructions: 'Vakuum bilan tozalang. Spetsial mato tozalash vositasini ishlating. Namlikdan saqlang.',
        warranty: '2 yil kafolat',
        colors: ['#8B4513', '#654321', '#3E2723'],
        colorVariants: [
          {
            name: 'Jigarrang',
            hex: '#8B4513',
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
          },
          {
            name: 'Kulrang',
            hex: '#808080',
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
          },
        ],
      },
    }),
    prisma.product.create({
      data: {
        nameUz: 'Hashamatli Yotoq Ramkasi',
        nameRu: 'Роскошная кровать',
        slug: 'luxury-bed-frame',
        descriptionUz: 'Premium yong\'oq yog\'ochidan qo\'lda yasalgan yotoq ramkasi. Zarif bosh taxta dizayni va mustahkam konstruksiya.',
        descriptionRu: 'Кровать из премиум орехового дерева ручной работы. Элегантный дизайн изголовья и прочная конструкция.',
        price: 2800.0,
        originalPrice: 3200.0,
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        ],
        categoryId: bedroomCategory.id,
        featured: true,
        visible: true,
        material: 'Premium yong\'oq yog\'och',
        materialDetails: '100% tabiiy yong\'oq yog\'och, qo\'lda ishlangan, premium lak bilan qoplangan',
        dimensions: '200x160x110 cm (uzunlik x kenglik x balandlik)',
        weight: '75 kg',
        capacity: '2 kishilik',
        style: 'Luxury Classic',
        finish: 'Glossy Natural',
        legStyle: 'Toshlangan oyoqlar',
        assemblyRequired: true,
        assemblyInfo: 'Professional o\'rnatish tavsiya etiladi.',
        deliveryInfo: 'Toshkentda 4-6 kun ichida bepul yetkazib beramiz.',
        careInstructions: 'Nam mato bilan tozalang. 6 oyda bir marta yog\'och parvarish vositasini qo\'llang.',
        warranty: '5 yil kafolat',
        colors: ['#8B4513', '#654321'],
        colorVariants: [
          {
            name: 'Tabiiy Yong\'oq',
            hex: '#8B4513',
            imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
          },
        ],
        storage: false,
        adjustable: false,
      },
    }),
    prisma.product.create({
      data: {
        nameUz: 'Professional Ofis Stol',
        nameRu: 'Профессиональный офисный стол',
        slug: 'professional-office-desk',
        descriptionUz: 'Zamonaviy ofis stoli. Keng ish maydoni, qulay saqlash tizimi va zamonaviy dizayn.',
        descriptionRu: 'Современный офисный стол. Большая рабочая поверхность, удобная система хранения и современный дизайн.',
        price: 2200.0,
        originalPrice: 2600.0,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        ],
        categoryId: officeCategory.id,
        featured: true,
        visible: true,
        material: 'MDF + Metall',
        materialDetails: 'Yuqori sifatli MDF, qattiq metall karkas, ekologik toza lak',
        dimensions: '180x80x75 cm',
        weight: '45 kg',
        style: 'Modern Minimalist',
        finish: 'Matte White',
        legStyle: 'Metall oyoqlar',
        assemblyRequired: true,
        assemblyInfo: 'Yig\'ish talab qilinadi. O\'rnatish xizmati mavjud.',
        deliveryInfo: 'Toshkentda 3-5 kun ichida bepul yetkazib beramiz.',
        careInstructions: 'Nam mato bilan tozalang. Kuchli kimyoviy moddalardan saqlang.',
        warranty: '2 yil kafolat',
        colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0'],
        colorVariants: [
          {
            name: 'Oq',
            hex: '#FFFFFF',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
          },
          {
            name: 'Kulrang',
            hex: '#E0E0E0',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
          },
        ],
        storage: true,
        adjustable: false,
      },
    }),
    prisma.product.create({
      data: {
        nameUz: 'Kengaytiriladigan Ovqatlanish Stoli',
        nameRu: 'Раздвижной обеденный стол',
        slug: 'extendable-dining-table',
        descriptionUz: 'Kengaytiriladigan ovqatlanish stoli. 6 kishidan 10 kishigacha kengaytiriladi. Premium yog\'och materiallardan yasalgan.',
        descriptionRu: 'Раздвижной обеденный стол. Расширяется от 6 до 10 человек. Изготовлен из премиум дерева.',
        price: 3200.0,
        originalPrice: 3800.0,
        imageUrl: 'https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=1200&q=80',
        ],
        categoryId: diningCategory.id,
        featured: false,
        visible: true,
        material: 'Premium eman yog\'och',
        materialDetails: '100% tabiiy eman yog\'och, qo\'lda ishlangan',
        dimensions: '180x90x75 cm (kengaytirilganda: 240x90x75 cm)',
        weight: '70 kg',
        capacity: '6-10 kishilik',
        style: 'Classic',
        finish: 'Matte Natural',
        legStyle: 'Toshlangan oyoqlar',
        assemblyRequired: true,
        assemblyInfo: 'Yig\'ish talab qilinadi. O\'rnatish xizmati mavjud.',
        deliveryInfo: 'Toshkentda 5-7 kun ichida bepul yetkazib beramiz.',
        careInstructions: 'Nam mato bilan tozalang. 6 oyda bir marta yog\'och parvarish vositasini qo\'llang.',
        warranty: '3 yil kafolat',
        colors: ['#8B4513', '#654321'],
        colorVariants: [
          {
            name: 'Tabiiy Eman',
            hex: '#8B4513',
            imageUrl: 'https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=1200&q=80',
          },
        ],
        storage: false,
        adjustable: true,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create Services (4 services)
  const services = await Promise.all([
    prisma.service.create({
      data: {
        nameUz: 'Interyer Dizayn',
        nameRu: 'Дизайн интерьера',
        slug: 'interior-design',
        descriptionUz: 'Professional interyer dizayn xizmati. 3D vizualizatsiya, rang tanlash, mebel joylashtirish.',
        descriptionRu: 'Профессиональный сервис дизайна интерьера. 3D визуализация, подбор цветов, размещение мебели.',
        icon: '🎨',
        price: 'Bepul maslahat',
        features: ['3D vizualizatsiya', 'Rang palitrasi', 'Professional maslahat'],
        order: 1,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        nameUz: 'O\'lchov va Maslahat',
        nameRu: 'Замер и консультация',
        slug: 'measurement',
        descriptionUz: 'Bepul o\'lchov xizmati. Uyingizga kelib, aniq o\'lchamlarni olamiz.',
        descriptionRu: 'Бесплатная услуга замера. Приедем к вам домой и снимем точные размеры.',
        icon: '📏',
        price: 'BEPUL',
        features: ['Bepul o\'lchov', 'Professional maslahat', 'Uyingizga kelib'],
        order: 2,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        nameUz: 'Yetkazib Berish',
        nameRu: 'Доставка',
        slug: 'delivery',
        descriptionUz: 'Toshkentda bepul yetkazib berish. Viloyatlarga ham yetkazamiz.',
        descriptionRu: 'Бесплатная доставка по Ташкенту. Также доставляем в регионы.',
        icon: '🚚',
        price: 'Toshkentda BEPUL',
        features: ['Toshkentda bepul', 'Viloyatlarga yetkazish', 'Xavfsiz yetkazish'],
        order: 3,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        nameUz: 'O\'rnatish Xizmati',
        nameRu: 'Услуга установки',
        slug: 'installation',
        descriptionUz: 'Professional o\'rnatish xizmati. Barcha mebellarni to\'g\'ri va xavfsiz o\'rnatamiz.',
        descriptionRu: 'Профессиональная услуга установки. Правильно и безопасно установим всю мебель.',
        icon: '🔧',
        price: 'Narx: loyihaga bog\'liq',
        features: ['Professional o\'rnatish', 'Xavfsiz', 'Tez va sifatli'],
        order: 4,
        visible: true,
      },
    }),
  ])

  console.log(`✅ Created ${services.length} services`)

  // Create Gallery Items (5 items)
  const galleryItems = await Promise.all([
    prisma.galleryItem.create({
      data: {
        titleUz: 'Zamonaviy Ovqatlanish Xonasi',
        titleRu: 'Современная столовая',
        descriptionUz: 'Elegant va zamonaviy ovqatlanish xonasi dizayni',
        descriptionRu: 'Элегантный и современный дизайн столовой',
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
        category: 'dining',
        featured: true,
        visible: true,
        order: 1,
      },
    }),
    prisma.galleryItem.create({
      data: {
        titleUz: 'Qulay Yashash Xonasi',
        titleRu: 'Уютная гостиная',
        descriptionUz: 'Zamonaviy va qulay yashash xonasi loyihasi',
        descriptionRu: 'Современный и уютный проект гостиной',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
        category: 'living',
        featured: true,
        visible: true,
        order: 2,
      },
    }),
    prisma.galleryItem.create({
      data: {
        titleUz: 'Hashamatli Yotoq Xonasi',
        titleRu: 'Роскошная спальня',
        descriptionUz: 'Premium yotoq xonasi dizayni',
        descriptionRu: 'Премиум дизайн спальни',
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        category: 'bedroom',
        featured: true,
        visible: true,
        order: 3,
      },
    }),
    prisma.galleryItem.create({
      data: {
        titleUz: 'Professional Ofis',
        titleRu: 'Профессиональный офис',
        descriptionUz: 'Zamonaviy ofis dizayni',
        descriptionRu: 'Современный дизайн офиса',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        category: 'office',
        featured: true,
        visible: true,
        order: 4,
      },
    }),
    prisma.galleryItem.create({
      data: {
        titleUz: 'Katta Yashash Xonasi',
        titleRu: 'Большая гостиная',
        descriptionUz: 'Keng va qulay yashash xonasi',
        descriptionRu: 'Просторная и уютная гостиная',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        category: 'living',
        featured: false,
        visible: true,
        order: 5,
      },
    }),
  ])

  console.log(`✅ Created ${galleryItems.length} gallery items`)

  // Create Banner (1 banner)
  const banner = await prisma.banner.create({
      data: {
      titleUz: 'Bayramona\ninteryer',
      titleRu: 'Праздничный\nинтерьер',
      subtitleUz: 'Premium Mebel',
      subtitleRu: 'Премиум Мебель',
      descriptionUz: 'O\'z xohishingizga mos mebel dizayni va ishlab chiqarish',
      descriptionRu: 'Дизайн и производство мебели по вашим пожеланиям',
      imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1920&q=80',
      buttonTextUz: 'KO\'PROQ KO\'RISH',
      buttonTextRu: 'УЗНАТЬ БОЛЬШЕ',
      buttonLink: '/products',
        visible: true,
        order: 1,
      },
  })

  console.log('✅ Created banner')

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  console.log('✅ Created admin user (username: admin, password: admin123)')

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
