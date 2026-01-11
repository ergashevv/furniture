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
  await prisma.category.deleteMany()
  await prisma.admin.deleteMany()

  console.log('✅ Database cleaned')

  console.log('🌱 Starting seed with real images...')

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Ovqatlanish Xonasi',
        slug: 'dining',
        description: 'Zamonaviy va shinam ovqatlanish xonasi mebellari',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Yashash Xonasi',
        slug: 'living',
        description: 'Qulay va zamonaviy yashash xonasi mebellari',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Yotoq Xonasi',
        slug: 'bedroom',
        description: 'Hashamatli yotoq xonasi mebellari',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ofis',
        slug: 'office',
        description: 'Professional ofis mebellari',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  const diningCategory = categories.find((c) => c.slug === 'dining')!
  const livingCategory = categories.find((c) => c.slug === 'living')!
  const bedroomCategory = categories.find((c) => c.slug === 'bedroom')!
  const officeCategory = categories.find((c) => c.slug === 'office')!

  // Create Products - Using the same seed data but with arrays instead of JSON.stringify
  // (We'll use a simplified version - you can add more products as needed)
  const products = await Promise.all([
    // Dining Products
    prisma.product.create({
      data: {
        name: 'Elegant Dining Set',
        slug: 'elegant-dining-set',
        description:
          'Zamonaviy eleganlik va an\'anaviy hunarmandchilikni uyg\'unlashtirgan ovqatlanish to\'plami. Premium eman yog\'ochdan yasalgan, qo\'lda ishlangan detallar bilan.',
        price: 4500.0,
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=80',
          'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80',
          'https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=1200&q=80',
        ],
        categoryId: diningCategory.id,
        featured: true,
        visible: true,
      },
    }),
    // Add more products as needed...
  ])

  console.log(`✅ Created ${products.length} products (add more as needed)`)

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Interyer Dizayn',
        slug: 'interior-design',
        description: 'Professional interyer dizayn xizmati. 3D vizualizatsiya, rang tanlash, mebel joylashtirish.',
        icon: '🎨',
        price: 'Bepul maslahat',
        features: ['3D vizualizatsiya', 'Rang palitrasi', 'Professional maslahat', 'Loyiha dizayni'],
        order: 1,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'O\'lchov va Maslahat',
        slug: 'measurement',
        description: 'Bepul o\'lchov xizmati. Uyingizga kelib, aniq o\'lchamlarni olamiz.',
        icon: '📏',
        price: 'BEPUL',
        features: ['Bepul o\'lchov', 'Professional maslahat', 'Uyingizga kelib', 'Aniq o\'lchamlar'],
        order: 2,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ishlab Chiqarish',
        slug: 'manufacturing',
        description: 'Zamonaviy fabrikamizda CNC dastgohlarida yuqori aniqlikda ishlab chiqaramiz.',
        icon: '🏭',
        price: 'Narx: loyihaga bog\'liq',
        features: ['5000+ m² fabrika', 'CNC dastgohlari', 'Yuqori aniqlik', 'Sifat nazorati'],
        order: 3,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Yetkazib Berish',
        slug: 'delivery',
        description: 'Toshkentda bepul yetkazib berish. Viloyatlarga ham yetkazamiz.',
        icon: '🚚',
        price: 'Toshkentda BEPUL',
        features: ['Toshkentda bepul', 'Viloyatlarga yetkazish', 'Xavfsiz yetkazish', 'O\'rnatish xizmati'],
        order: 4,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'O\'rnatish Xizmati',
        slug: 'installation',
        description: 'Professional o\'rnatish xizmati. Mahsulotlarni xavfsiz va to\'g\'ri o\'rnatamiz.',
        icon: '🔧',
        price: 'Narx: loyihaga bog\'liq',
        features: ['Professional o\'rnatish', 'Xavfsiz', 'Tezkor', 'Kafolat bilan'],
        order: 5,
        visible: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Kafolat va Xizmat',
        slug: 'warranty',
        description: '1-3 yil kafolat. Kafolat davrida yuzaga kelgan muammolarni bepul hal qilamiz.',
        icon: '🛡️',
        price: '1-3 yil kafolat',
        features: ['1-3 yil kafolat', 'Bepul ta\'mirlash', '24/7 qo\'llab-quvvatlash', 'Sifat kafolati'],
        order: 6,
        visible: true,
      },
    }),
  ])

  console.log(`✅ Created ${services.length} services`)

  // Create Stores
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Bosh Ofis',
        address: 'Toshkent, Yunusobod tumani, Amir Temur ko\'chasi 15',
        phone: '+998 90 123 45 67',
        email: 'info@furniglass.uz',
        workingHours: 'Du-Ju: 09:00 - 19:00, Sha-Yak: 10:00 - 17:00',
        latitude: 41.3119,
        longitude: 69.2404,
        order: 1,
        visible: true,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Ko\'rgazma Zali',
        address: 'Toshkent, Chilonzor tumani, Bunyodkor ko\'chasi 42',
        phone: '+998 90 123 45 67',
        email: 'showroom@furniglass.uz',
        workingHours: 'Du-Yak: 10:00 - 20:00',
        latitude: 41.2891,
        longitude: 69.2042,
        order: 2,
        visible: true,
      },
    }),
  ])

  console.log(`✅ Created ${stores.length} stores`)

  // Create Reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        customerName: 'Akmal Karimov',
        rating: 5,
        comment: 'Ajoyib sifat! Mebel juda chiroyli va mustahkam. Yetkazib berish ham tez bo\'ldi. Tavsiya qilaman!',
        location: 'Toshkent',
        avatar: 'AK',
        visible: true,
        featured: true,
        order: 1,
      },
    }),
    prisma.review.create({
      data: {
        customerName: 'Malika Toshmatova',
        rating: 5,
        comment: 'Professional xizmat va yuqori sifatli mahsulot. Mijozlarga yondashuv ajoyib. Rahmat!',
        location: 'Samarqand',
        avatar: 'MT',
        visible: true,
        featured: true,
        order: 2,
      },
    }),
    prisma.review.create({
      data: {
        customerName: 'Farhod Rahimov',
        rating: 5,
        comment: 'Narx va sifat nisbati ajoyib. Bepul maslahat xizmati ham juda qulay. Mamnunman!',
        location: 'Toshkent',
        avatar: 'FR',
        visible: true,
        featured: true,
        order: 3,
      },
    }),
    prisma.review.create({
      data: {
        customerName: 'Dilshoda Yunusova',
        rating: 5,
        comment: 'O\'lchamlar aniq, dizayn zamonaviy. Uyimga juda mos keldi. Kafolat ham berishdi. Ajoyib!',
        location: 'Buxoro',
        avatar: 'DY',
        visible: true,
        featured: false,
        order: 4,
      },
    }),
    prisma.review.create({
      data: {
        customerName: 'Jasur Alimov',
        rating: 5,
        comment: 'Ishlab chiqarish tezkor, o\'rnatish professional. Hammasi juda yaxshi. Rahmat!',
        location: 'Farg\'ona',
        avatar: 'JA',
        visible: true,
        featured: false,
        order: 5,
      },
    }),
  ])

  console.log(`✅ Created ${reviews.length} reviews`)

  // Create Admin User with hashed password
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  console.log(`✅ Created admin user (username: admin, password: admin123)`)

  console.log('✨ Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Products: ${products.length}`)
  console.log(`   - Services: ${services.length}`)
  console.log(`   - Stores: ${stores.length}`)
  console.log(`   - Reviews: ${reviews.length}`)
  console.log(`   - Admin: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
