"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../src/config/database");
const models_1 = require("../src/models");
const bcrypt_1 = require("../src/utils/bcrypt");
const regionals = [
    {
        name: 'SENA Regional Bogotá',
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 57 No. 8-69',
        location: {
            type: 'Point',
            coordinates: [-74.0721, 4.711],
        },
    },
    {
        name: 'SENA Regional Antioquia',
        city: 'Medellín',
        department: 'Antioquia',
        address: 'Calle 52 No. 32-45',
        location: {
            type: 'Point',
            coordinates: [-75.5636, 6.2442],
        },
    },
    {
        name: 'SENA Regional Valle',
        city: 'Cali',
        department: 'Valle del Cauca',
        address: 'Carrera 5 No. 24-53',
        location: {
            type: 'Point',
            coordinates: [-76.5319, 3.4516],
        },
    },
    {
        name: 'SENA Regional Atlántico',
        city: 'Barranquilla',
        department: 'Atlántico',
        address: 'Calle 30 No. 34-20',
        location: {
            type: 'Point',
            coordinates: [-74.7966, 10.9639],
        },
    },
    {
        name: 'SENA Regional Santander',
        city: 'Bucaramanga',
        department: 'Santander',
        address: 'Carrera 27 No. 33-50',
        location: {
            type: 'Point',
            coordinates: [-73.1198, 7.1193],
        },
    },
];
const bicycleColors = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo'];
const bicycleBrands = ['GW', 'Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott'];
async function seed() {
    try {
        console.log('🌱 Starting seed process...\n');
        await (0, database_1.connectDB)();
        console.log('🗑️  Clearing existing data...');
        await models_1.Regional.deleteMany({});
        await models_1.User.deleteMany({});
        await models_1.Bicycle.deleteMany({});
        console.log('✅ Existing data cleared\n');
        console.log('🏢 Creating regionals...');
        const createdRegionals = await models_1.Regional.insertMany(regionals);
        console.log(`✅ ${createdRegionals.length} regionals created\n`);
        console.log('👤 Creating admin user...');
        const adminPassword = await bcrypt_1.BcryptUtils.hash('admin123');
        const adminUser = await models_1.User.create({
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
        console.log('👥 Creating sample users...');
        const userPassword = await bcrypt_1.BcryptUtils.hash('user123');
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
        const createdUsers = await models_1.User.insertMany(sampleUsers);
        console.log(`✅ ${createdUsers.length} sample users created`);
        console.log(`   Password for all users: user123\n`);
        console.log('🚲 Creating 100 bicycles...');
        const bicycles = [];
        for (let i = 1; i <= 100; i++) {
            const regional = createdRegionals[i % createdRegionals.length];
            const brand = bicycleBrands[i % bicycleBrands.length];
            const color = bicycleColors[i % bicycleColors.length];
            bicycles.push({
                code: `BIC-${String(i).padStart(3, '0')}`,
                brand,
                bicycleModel: `Model ${i}`,
                color,
                status: 'available',
                rentalPricePerHour: 5000 + Math.floor(Math.random() * 3000),
                regionalId: regional._id,
                currentLocation: regional.location
                    ? {
                        type: 'Point',
                        coordinates: [
                            regional.location.coordinates[0] + (Math.random() - 0.5) * 0.01,
                            regional.location.coordinates[1] + (Math.random() - 0.5) * 0.01,
                        ],
                    }
                    : undefined,
                purchaseDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
            });
        }
        const createdBicycles = await models_1.Bicycle.insertMany(bicycles);
        console.log(`✅ ${createdBicycles.length} bicycles created\n`);
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
    }
    catch (error) {
        console.error('❌ Error during seed:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map