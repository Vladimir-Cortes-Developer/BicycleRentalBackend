import 'reflect-metadata';
import { connectDB } from '../src/config/database';
import { Regional, User, Bicycle, Event } from '../src/models';
import { BcryptUtils } from '../src/utils/bcrypt';

const regionals = [
  {
    name: 'SENA Regional Bogotá',
    city: 'Bogotá',
    department: 'Cundinamarca',
    address: 'Calle 57 No. 8-69',
    location: {
      type: 'Point' as const,
      coordinates: [-74.0721, 4.711],
    },
  },
  {
    name: 'SENA Regional Antioquia',
    city: 'Medellín',
    department: 'Antioquia',
    address: 'Calle 52 No. 32-45',
    location: {
      type: 'Point' as const,
      coordinates: [-75.5636, 6.2442],
    },
  },
  {
    name: 'SENA Regional Valle',
    city: 'Cali',
    department: 'Valle del Cauca',
    address: 'Carrera 5 No. 24-53',
    location: {
      type: 'Point' as const,
      coordinates: [-76.5319, 3.4516],
    },
  },
  {
    name: 'SENA Regional Atlántico',
    city: 'Barranquilla',
    department: 'Atlántico',
    address: 'Calle 30 No. 34-20',
    location: {
      type: 'Point' as const,
      coordinates: [-74.7966, 10.9639],
    },
  },
  {
    name: 'SENA Regional Santander',
    city: 'Bucaramanga',
    department: 'Santander',
    address: 'Carrera 27 No. 33-50',
    location: {
      type: 'Point' as const,
      coordinates: [-73.1198, 7.1193],
    },
  },
];

const bicycleColors = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo'];
const bicycleBrands = ['GW', 'Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott'];
const bicycleTypes = ['mountain', 'road', 'hybrid', 'electric'] as const;

async function seed() {
  try {
    console.log('🌱 Starting seed process...\n');

    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Regional.deleteMany({});
    await User.deleteMany({});
    await Bicycle.deleteMany({});
    await Event.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create regionals
    console.log('🏢 Creating regionals...');
    const createdRegionals = await Regional.insertMany(regionals);
    console.log(`✅ ${createdRegionals.length} regionals created\n`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await BcryptUtils.hash('admin123');
    const adminUser = await User.create({
      documentType: 'CC',
      documentNumber: '1000000001',
      firstName: 'Admin',
      lastName: 'SENA',
      email: 'admin@sena.edu.co',
      passwordHash: adminPassword,
      phone: '3001234567',
      socioeconomicStratum: 3,
      role: 'admin',
      regionalId: createdRegionals[0]._id,
      isActive: true,
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);
    console.log(`   Password: admin123\n`);

    // Create sample users
    console.log('👥 Creating sample users...');
    const userPassword = await BcryptUtils.hash('user123');
    const sampleUsers = [];

    for (let i = 0; i < 5; i++) {
      const regional = createdRegionals[i % createdRegionals.length];
      sampleUsers.push({
        documentType: 'CC',
        documentNumber: `100000000${i + 2}`,
        firstName: `Usuario${i + 1}`,
        lastName: `Apellido${i + 1}`,
        email: `usuario${i + 1}@sena.edu.co`,
        passwordHash: userPassword,
        phone: `300123456${i}`,
        socioeconomicStratum: (i % 6) + 1,
        role: 'user',
        regionalId: regional._id,
        isActive: true,
      });
    }

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ ${createdUsers.length} sample users created`);
    console.log(`   Password for all users: user123\n`);

    // Create 100 bicycles distributed across regionals
    console.log('🚲 Creating 100 bicycles...');
    const bicycles = [];

    for (let i = 1; i <= 100; i++) {
      const regional = createdRegionals[i % createdRegionals.length];
      const brand = bicycleBrands[i % bicycleBrands.length];
      const color = bicycleColors[i % bicycleColors.length];

      const bicycleType = bicycleTypes[i % bicycleTypes.length];
      const statuses = ['available', 'available', 'available', 'maintenance'] as const; // 75% disponibles

      bicycles.push({
        code: `BIC-${String(i).padStart(3, '0')}`,
        brand,
        bicycleModel: `${brand} ${bicycleType.toUpperCase()} ${i}`,
        bicycleType,
        color,
        status: statuses[i % statuses.length],
        rentalPricePerHour: 5000 + Math.floor(Math.random() * 3000), // Entre 5000 y 8000
        regionalId: regional._id,
        currentLocation: regional.location
          ? {
              type: 'Point' as const,
              coordinates: [
                regional.location.coordinates[0] + (Math.random() - 0.5) * 0.01,
                regional.location.coordinates[1] + (Math.random() - 0.5) * 0.01,
              ],
            }
          : undefined,
        purchaseDate: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        ),
        description: `Bicicleta ${bicycleType} ${brand} ${color} en excelente estado`,
      });
    }

    const createdBicycles = await Bicycle.insertMany(bicycles);
    console.log(`✅ ${createdBicycles.length} bicycles created\n`);

    // Summary
    console.log('📊 Seed Summary:');
    console.log(`   Regionals: ${createdRegionals.length}`);
    console.log(`   Users: ${createdUsers.length + 1} (including admin)`);
    console.log(`   Bicycles: ${createdBicycles.length}`);
    console.log('\n✅ Seed process completed successfully!');

    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:');
    console.log(`     Email: admin@sena.edu.co`);
    console.log(`     Password: admin123`);
    console.log('   Users:');
    console.log(`     Email: usuario1@sena.edu.co to usuario5@sena.edu.co`);
    console.log(`     Password: user123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

seed();
