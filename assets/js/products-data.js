// Данные о товарах по категориям
const productsData = {
    resistors: [
        {
            id: 1,
            name: 'Резистор 0.25Вт 100 Ом 1%',
            description: 'Высокоточный резистор для электронных схем',
            price: 2,
            image: '../assets/images/products/resistors/resistor-1.jpg',
            inStock: true,
            power: 0.25,
            precision: 1
        },
        {
            id: 2,
            name: 'Резистор 0.5Вт 1кОм 5%',
            description: 'Стандартный резистор для общего применения',
            price: 3,
            image: '../assets/images/products/resistors/resistor-2.jpg',
            inStock: true,
            power: 0.5,
            precision: 5
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `Резистор ${[0.25, 0.5, 1, 2][i % 4]}Вт ${[100, 220, 330, 470, 1000, 2200, 4700, 10000][i % 8]} Ом ${[1, 5][i % 2]}%`,
        description: `Качественный резистор для ${i % 2 ? 'профессиональной' : 'любительской'} электроники`,
        price: 2 + (i % 5),
        image: `../assets/images/products/resistors/resistor-${i + 3}.jpg`,
        inStock: i % 4 !== 3,
        power: [0.25, 0.5, 1, 2][i % 4],
        precision: [1, 5][i % 2]
    }))),

    capacitors: [
        {
            id: 1,
            name: 'Конденсатор электролитический 100мкФ 16В',
            description: 'Электролитический конденсатор для фильтрации',
            price: 5,
            image: '../assets/images/products/capacitors/cap-1.jpg',
            inStock: true,
            type: 'electrolytic',
            voltage: 16
        },
        {
            id: 2,
            name: 'Конденсатор керамический 0.1мкФ 50В',
            description: 'Керамический конденсатор для высокочастотных схем',
            price: 3,
            image: '../assets/images/products/capacitors/cap-2.jpg',
            inStock: true,
            type: 'ceramic',
            voltage: 50
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `Конденсатор ${['электролитический', 'керамический', 'плёночный'][i % 3]} ${[0.1, 1, 10, 100, 220, 470, 1000][i % 7]}мкФ ${[16, 25, 50][i % 3]}В`,
        description: `${['Высококачественный', 'Надёжный', 'Компактный'][i % 3]} конденсатор для ${['фильтрации', 'развязки', 'накопления'][i % 3]}`,
        price: 3 + (i % 7),
        image: `../assets/images/products/capacitors/cap-${i + 3}.jpg`,
        inStock: i % 5 !== 4,
        type: ['electrolytic', 'ceramic', 'film'][i % 3],
        voltage: [16, 25, 50][i % 3]
    }))),

    transistors: [
        {
            id: 1,
            name: 'Транзистор BC547',
            description: 'NPN транзистор для общего применения',
            price: 4,
            image: '../assets/images/products/transistors/trans-1.jpg',
            inStock: true,
            type: 'npn',
            power: 0.5
        },
        {
            id: 2,
            name: 'Транзистор 2N3906',
            description: 'PNP транзистор для аналоговых схем',
            price: 5,
            image: '../assets/images/products/transistors/trans-2.jpg',
            inStock: true,
            type: 'pnp',
            power: 0.625
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `Транзистор ${['BC547', 'BC557', '2N3904', '2N3906', 'TIP31', 'TIP32'][i % 6]}`,
        description: `${['Высококачественный', 'Надёжный', 'Мощный'][i % 3]} ${['NPN', 'PNP'][i % 2]} транзистор`,
        price: 4 + (i % 6),
        image: `../assets/images/products/transistors/trans-${i + 3}.jpg`,
        inStock: i % 6 !== 5,
        type: ['npn', 'pnp'][i % 2],
        power: [0.5, 0.625, 1, 2][i % 4]
    }))),
    
    microcontrollers: [
        {
            id: 1,
            name: 'ATmega328P',
            description: 'Популярный микроконтроллер для Arduino',
            price: 180,
            image: '../assets/images/products/microcontrollers/mc-1.jpg',
            inStock: true,
            architecture: '8-bit',
            speed: '16MHz'
        },
        {
            id: 2,
            name: 'ESP32',
            description: 'Wi-Fi и Bluetooth микроконтроллер',
            price: 450,
            image: '../assets/images/products/microcontrollers/mc-2.jpg',
            inStock: true,
            architecture: '32-bit',
            speed: '240MHz'
        },
        // Добавляем еще 48 микроконтроллеров
        ...Array.from({ length: 48 }, (_, i) => ({
            id: i + 3,
            name: `${['ATmega', 'PIC', 'STM32', 'ESP'][i % 4]}${['8', '16', '32', '128'][i % 4]}${['A', 'B', 'C'][i % 3]}`,
            description: `${['Мощный', 'Энергоэффективный', 'Универсальный'][i % 3]} микроконтроллер для ${['встраиваемых систем', 'IoT проектов', 'робототехники'][i % 3]}`,
            price: 150 + (i * 50),
            image: `../assets/images/products/microcontrollers/mc-${i + 3}.jpg`,
            inStock: i % 7 !== 6,
            architecture: ['8-bit', '16-bit', '32-bit'][i % 3],
            speed: ['16MHz', '48MHz', '72MHz', '120MHz', '240MHz'][i % 5]
        }))
    ],

    sensors: [
        {
            id: 1,
            name: 'DHT11',
            description: 'Датчик температуры и влажности',
            price: 150,
            image: '../assets/images/products/sensors/sensor-1.jpg',
            inStock: true,
            type: 'temperature',
            interface: 'digital'
        },
        {
            id: 2,
            name: 'HC-SR04',
            description: 'Ультразвуковой датчик расстояния',
            price: 120,
            image: '../assets/images/products/sensors/sensor-2.jpg',
            inStock: true,
            type: 'distance',
            interface: 'digital'
        },
        // Добавляем еще 48 датчиков
        ...Array.from({ length: 48 }, (_, i) => ({
            id: i + 3,
            name: `${['DHT', 'BMP', 'MPU', 'MQ'][i % 4]}${['11', '22', '33', '44'][i % 4]}`,
            description: `Датчик ${['температуры', 'давления', 'движения', 'газа'][i % 4]} ${['высокой', 'средней', 'базовой'][i % 3]} точности`,
            price: 100 + (i * 20),
            image: `../assets/images/products/sensors/sensor-${i + 3}.jpg`,
            inStock: i % 8 !== 7,
            type: ['temperature', 'pressure', 'motion', 'gas'][i % 4],
            interface: ['digital', 'analog', 'i2c'][i % 3]
        }))
    ],

    displays: [
        {
            id: 1,
            name: 'LCD 1602',
            description: '16x2 символьный LCD дисплей',
            price: 200,
            image: '../assets/images/products/displays/display-1.jpg',
            inStock: true,
            type: 'lcd',
            interface: 'parallel'
        },
        {
            id: 2,
            name: 'OLED 0.96"',
            description: 'Монохромный OLED дисплей 128x64',
            price: 250,
            image: '../assets/images/products/displays/display-2.jpg',
            inStock: true,
            type: 'oled',
            interface: 'i2c'
        },
        // Добавляем еще 48 дисплеев
        ...Array.from({ length: 48 }, (_, i) => ({
            id: i + 3,
            name: `${['LCD', 'OLED', 'TFT'][i % 3]} ${['0.96"', '1.3"', '1.8"', '2.4"'][i % 4]}`,
            description: `${['Монохромный', 'Цветной', 'Графический'][i % 3]} дисплей ${['128x64', '240x240', '320x240'][i % 3]}`,
            price: 200 + (i * 30),
            image: `../assets/images/products/displays/display-${i + 3}.jpg`,
            inStock: i % 9 !== 8,
            type: ['lcd', 'oled', 'tft'][i % 3],
            interface: ['i2c', 'spi', 'parallel'][i % 3]
        }))
    ],

    power: [
        {
            id: 1,
            name: 'LM317T',
            description: 'Регулируемый линейный стабилизатор',
            price: 45,
            image: '../assets/images/products/power/power-1.jpg',
            inStock: true,
            type: 'linear',
            current: '1.5A'
        },
        {
            id: 2,
            name: 'DC-DC Step Down',
            description: 'Понижающий преобразователь LM2596',
            price: 120,
            image: '../assets/images/products/power/power-2.jpg',
            inStock: true,
            type: 'switching',
            current: '3A'
        },
        // Добавляем еще 48 компонентов питания
        ...Array.from({ length: 48 }, (_, i) => ({
            id: i + 3,
            name: `${['LM317', 'LM7805', 'XL6009', 'MP1584'][i % 4]} ${['Standard', 'Pro', 'Mini'][i % 3]}`,
            description: `${['Линейный', 'Импульсный', 'Повышающий', 'Понижающий'][i % 4]} преобразователь напряжения`,
            price: 40 + (i * 15),
            image: `../assets/images/products/power/power-${i + 3}.jpg`,
            inStock: i % 10 !== 9,
            type: ['linear', 'switching'][i % 2],
            current: ['1A', '1.5A', '2A', '3A', '5A'][i % 5]
        }))
    ],

    connectors: [
        {
            id: 1,
            name: 'USB Type-C разъем',
            description: 'Современный разъем для передачи данных и питания',
            price: 45,
            image: '../assets/images/products/connectors/usb-c-1.jpg',
            inStock: true,
            type: 'usb',
            mount: 'smd'
        },
        {
            id: 2,
            name: 'DC Jack 5.5x2.1мм',
            description: 'Стандартный разъем питания',
            price: 25,
            image: '../assets/images/products/connectors/dc-1.jpg',
            inStock: true,
            type: 'power',
            mount: 'tht'
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `${['USB', 'Audio', 'DC', 'RJ45', 'DB9', 'HDMI'][i % 6]} ${['Type-A', 'Type-B', 'Type-C', 'Mini', 'Micro'][i % 5]}`,
        description: `${['Высококачественный', 'Надёжный', 'Компактный'][i % 3]} разъём для ${['передачи данных', 'питания', 'аудио'][i % 3]}`,
        price: 20 + (i * 5),
        image: `../assets/images/products/connectors/conn-${i + 3}.jpg`,
        inStock: i % 6 !== 5,
        type: ['usb', 'audio', 'power', 'data'][i % 4],
        mount: ['smd', 'tht', 'panel'][i % 3]
    }))),

    pcb: [
        {
            id: 1,
            name: 'Макетная плата 100x100мм',
            description: 'Двусторонняя печатная плата для прототипирования',
            price: 150,
            image: '../assets/images/products/pcb/pcb-1.jpg',
            inStock: true,
            type: 'double',
            material: 'fr4'
        },
        {
            id: 2,
            name: 'Алюминиевая подложка LED PCB',
            description: 'Термостойкая плата для светодиодов',
            price: 200,
            image: '../assets/images/products/pcb/pcb-2.jpg',
            inStock: true,
            type: 'single',
            material: 'aluminum'
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `${['Макетная', 'Монтажная', 'Специализированная'][i % 3]} плата ${['50x50', '100x100', '150x150', '200x200'][i % 4]}мм`,
        description: `${['Высококачественная', 'Профессиональная', 'Универсальная'][i % 3]} печатная плата`,
        price: 100 + (i * 25),
        image: `../assets/images/products/pcb/pcb-${i + 3}.jpg`,
        inStock: i % 7 !== 6,
        type: ['single', 'double', 'multilayer'][i % 3],
        material: ['fr4', 'aluminum', 'flexible'][i % 3]
    }))),

    tools: [
        {
            id: 1,
            name: 'Паяльная станция',
            description: 'Профессиональная паяльная станция с регулировкой температуры',
            price: 3500,
            image: '../assets/images/products/tools/tool-1.jpg',
            inStock: true,
            type: 'soldering',
            category: 'assembly'
        },
        {
            id: 2,
            name: 'Мультиметр цифровой',
            description: 'Точный мультиметр для измерений',
            price: 1200,
            image: '../assets/images/products/tools/tool-2.jpg',
            inStock: true,
            type: 'measurement',
            category: 'diagnostic'
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `${['Паяльник', 'Мультиметр', 'Осциллограф', 'Отвертка', 'Пинцет', 'Бокорезы'][i % 6]}`,
        description: `${['Профессиональный', 'Точный', 'Надежный'][i % 3]} инструмент для ${['пайки', 'измерений', 'монтажа'][i % 3]}`,
        price: 500 + (i * 100),
        image: `../assets/images/products/tools/tool-${i + 3}.jpg`,
        inStock: i % 8 !== 7,
        type: ['measurement', 'soldering', 'hand'][i % 3],
        category: ['diagnostic', 'assembly', 'repair'][i % 3]
    }))),

    robotics: [
        {
            id: 1,
            name: 'Сервопривод MG996R',
            description: 'Мощный сервопривод для роботов',
            price: 450,
            image: '../assets/images/products/robotics/robot-1.jpg',
            inStock: true,
            type: 'servos',
            level: 'intermediate'
        },
        {
            id: 2,
            name: 'Колесная платформа',
            description: 'Базовая платформа для мобильного робота',
            price: 1200,
            image: '../assets/images/products/robotics/robot-2.jpg',
            inStock: true,
            type: 'chassis',
            level: 'beginner'
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `${['Сервопривод', 'Мотор', 'Контроллер', 'Шасси'][i % 4]} ${['Basic', 'Pro', 'Ultra'][i % 3]}`,
        description: `${['Надежный', 'Мощный', 'Точный'][i % 3]} компонент для ${['роботов', 'дронов', 'манипуляторов'][i % 3]}`,
        price: 400 + (i * 150),
        image: `../assets/images/products/robotics/robot-${i + 3}.jpg`,
        inStock: i % 9 !== 8,
        type: ['motors', 'servos', 'chassis', 'controllers'][i % 4],
        level: ['beginner', 'intermediate', 'advanced'][i % 3]
    }))),

    books: [
        {
            id: 1,
            name: 'Основы электроники',
            description: 'Базовый учебник по электронике',
            price: 800,
            image: '../assets/images/products/books/book-1.jpg',
            inStock: true,
            type: 'textbook',
            level: 'beginner',
            language: 'russian'
        },
        {
            id: 2,
            name: 'Arduino Programming Handbook',
            description: 'Comprehensive guide to Arduino',
            price: 1200,
            image: '../assets/images/products/books/book-2.jpg',
            inStock: true,
            type: 'reference',
            level: 'intermediate',
            language: 'english'
        }
    ].concat(Array.from({ length: 48 }, (_, i) => ({
        id: i + 3,
        name: `${['Основы', 'Практикум', 'Справочник'][i % 3]} ${['электроники', 'схемотехники', 'программирования', 'робототехники'][i % 4]}`,
        description: `${['Подробное', 'Практическое', 'Профессиональное'][i % 3]} руководство для ${['начинающих', 'практиков', 'профессионалов'][i % 3]}`,
        price: 700 + (i * 100),
        image: `../assets/images/products/books/book-${i + 3}.jpg`,
        inStock: i % 10 !== 9,
        type: ['textbook', 'reference', 'practice'][i % 3],
        level: ['beginner', 'intermediate', 'advanced'][i % 3],
        language: ['russian', 'english'][i % 2]
    })))
};
