import { Client, Databases, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69991e8a00216d28d1c3');

const databases = new Databases(client);
const DATABASE_ID = 'marketplace';

const categories = [
    { id: 'electronics', name: 'Electronics & Tech', icon: 'monitor-speaker' },
    { id: 'fashion', name: 'Fashion & Styling', icon: 'shirt' },
    { id: 'home', name: 'Home & Decor', icon: 'sofa-lamp' }
];

const shop = { id: 'v_official_shop', name: 'V-Market Official Store', description: 'Flagship store with premium quality.' };

const products = [
    // Electronics
    { id: 'prod_elec_1', cat: 'electronics', name: 'iPhone 15 Pro Max Titanium', price: 29990000, stock: 10, img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop', desc: 'The ultimate iPhone. 48MP Camera, Titanium build.' },
    { id: 'prod_elec_2', cat: 'electronics', name: 'MacBook Pro 14" M3 Max', price: 45990000, stock: 5, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', desc: 'M3 Max Chip, Liquid Retina XDR. Born for professionals.' },
    { id: 'prod_elec_3', cat: 'electronics', name: 'Sony WH-1000XM5 ANC', price: 8490000, stock: 12, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', desc: 'Industry-leading noise cancellation. Crystal clear audio.' },
    { id: 'prod_elec_4', cat: 'electronics', name: 'Apple Watch Ultra 2', price: 18990000, stock: 8, img: 'https://images.unsplash.com/photo-1434493907317-a46b5bc78a88?q=80&w=800&auto=format&fit=crop', desc: 'The rugged and capable watch. Built for adventure.' },
    { id: 'prod_elec_5', cat: 'electronics', name: 'iPad Pro 13" M4', price: 31990000, stock: 6, img: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff2091?q=80&w=800&auto=format&fit=crop', desc: 'Tandem OLED display, M4 Chip. The absolute tablet.' },
    { id: 'prod_elec_6', cat: 'electronics', name: 'Marshall Emberton II', price: 4290000, stock: 15, img: 'https://images.unsplash.com/photo-1628102431505-8e3647413b56?q=80&w=800&auto=format&fit=crop', desc: 'Iconic portable speaker with 30+ hours of battery.' },

    // Fashion
    { id: 'prod_fash_1', cat: 'fashion', name: 'Linen Summer Shirt', price: 790000, stock: 25, img: 'https://images.unsplash.com/photo-1596755094514-f87034a26cc1?q=80&w=800&auto=format&fit=crop', desc: 'Breathable linen blend. Perfect for warm weather.' },
    { id: 'prod_fash_2', cat: 'fashion', name: 'Urban Techwear Cargo', price: 1250000, stock: 20, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop', desc: 'Multi-pocket design. Water-resistant fabric.' },
    { id: 'prod_fash_3', cat: 'fashion', name: 'Minimalist Cotton Hoodie', price: 890000, stock: 30, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop', desc: 'Oversized fit. Premium heavy cotton.' },
    { id: 'prod_fash_4', cat: 'fashion', name: 'Classic Leather Boots', price: 3500000, stock: 10, img: 'https://images.unsplash.com/photo-1520639889313-7272175b1c39?q=80&w=800&auto=format&fit=crop', desc: 'Handcrafted genuine leather. Timeless style.' },
    { id: 'prod_fash_5', cat: 'fashion', name: 'Neutral Wool Trench Coat', price: 5900000, stock: 5, img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop', desc: 'Elegant silhouette. Sustainable Italian wool.' },
    { id: 'prod_fash_6', cat: 'fashion', name: 'Silk Floral Evening Dress', price: 2490000, stock: 12, img: 'https://images.unsplash.com/photo-1539008835657-9e8e62f4044a?q=80&w=800&auto=format&fit=crop', desc: 'Luxurious silk feel. Perfect for special occasions.' },
    { id: 'prod_fash_7', cat: 'fashion', name: 'Polarized Aviator Sunglasses', price: 1850000, stock: 18, img: 'https://images.unsplash.com/photo-1511499767390-90342f5bf949?q=80&w=800&auto=format&fit=crop', desc: 'Classic metal frame. UV400 protection.' },

    // Home
    { id: 'prod_home_1', cat: 'home', name: 'Scandi Oak Coffee Table', price: 4200000, stock: 8, img: 'https://images.unsplash.com/photo-1551298370-9d3d5a3e2072?q=80&w=800&auto=format&fit=crop', desc: 'Minimalist solid oak. Nordic design excellence.' },
    { id: 'prod_home_2', cat: 'home', name: 'Arctic Ceramic Vase', price: 450000, stock: 20, img: 'https://images.unsplash.com/photo-1581337204873-ef36aa186caa?q=80&w=800&auto=format&fit=crop', desc: 'Matte white finish. Handcrafted porcelain.' },
    { id: 'prod_home_3', cat: 'home', name: 'Ambient Wood Floor Lamp', price: 1890000, stock: 12, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', desc: 'Warm yellow light. Natural oak material.' },
    { id: 'prod_home_4', cat: 'home', name: 'Velvet Emerald Armchair', price: 8900000, stock: 4, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop', desc: 'Plush velvet upholstery. Sophisticated accent piece.' },
    { id: 'prod_home_5', cat: 'home', name: 'Modern Abstract Wall Art', price: 1200000, stock: 15, img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop', desc: 'Framed canvas. Minimalist geometry.' },
    { id: 'prod_home_6', cat: 'home', name: 'Smart Herb Garden', price: 2150000, stock: 10, img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop', desc: 'Automated watering & LED. Grow your kitchen fresh.' },
    { id: 'prod_home_7', cat: 'home', name: 'Cotton Boho Throw Blanket', price: 650000, stock: 30, img: 'https://images.unsplash.com/photo-1528913122176-110f270f016d?q=80&w=800&auto=format&fit=crop', desc: 'Soft woven texture. Adds warmth to any sofa.' }
];

async function seed() {
    console.log('Seeding process started...');
    
    try {
        // Create Categories
        for (const cat of categories) {
            await databases.createDocument(DATABASE_ID, 'categories', cat.id, {
                name: cat.name,
                icon_id: cat.icon
            }).catch(() => console.log(`Category ${cat.id} exists.`));
        }

        // Create Shop
        await databases.createDocument(DATABASE_ID, 'shops', shop.id, {
            name: shop.name,
            description: shop.description,
            owner_id: 'admin_user',
            status: true
        }).catch(() => console.log(`Shop ${shop.id} exists.`));

        // Create Products
        for (const p of products) {
            await databases.createDocument(DATABASE_ID, 'products', p.id, {
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: p.stock,
                images: [p.img],
                category_id: p.cat,
                shop_id: shop.id
            }).catch(e => console.log(`Failed/Exists: ${p.id}`));
        }

        console.log('Seeding successfully completed!');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seed();
