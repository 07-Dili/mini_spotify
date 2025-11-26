const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/mini-spotify')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const musicData = [
    {
        name: 'A.R. Rahman',
        bio: 'The Mozart of Madras, a two-time Academy Award winner.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/A.R._Rahman_at_the_Cannes_Film_Festival_2019.jpg/440px-A.R._Rahman_at_the_Cannes_Film_Festival_2019.jpg',
        albums: [
            {
                title: 'Rockstar',
                imageUrl: 'https://c.saavncdn.com/973/Rockstar-Hindi-2011-20190529125828-500x500.jpg',
                songs: [
                    { title: 'Nadaan Parinde', genre: 'Rock', mood: 'Energetic', duration: 360, language: 'Hindi' },
                    { title: 'Tum Ho', genre: 'Romantic', mood: 'Soulful', duration: 318, language: 'Hindi' },
                    { title: 'Sadda Haq', genre: 'Rock', mood: 'Rebellious', duration: 365, language: 'Hindi' },
                    { title: 'Kun Faya Kun', genre: 'Sufi', mood: 'Devotional', duration: 473, language: 'Hindi' }
                ]
            },
            {
                title: 'Dil Se',
                imageUrl: 'https://c.saavncdn.com/154/Dil-Se-Hindi-1998-20190603124756-500x500.jpg',
                songs: [
                    { title: 'Chaiyya Chaiyya', genre: 'Folk', mood: 'Happy', duration: 414, language: 'Hindi' },
                    { title: 'Dil Se Re', genre: 'Pop', mood: 'Romantic', duration: 307, language: 'Hindi' },
                    { title: 'Jiya Jale', genre: 'Classical', mood: 'Romantic', duration: 290, language: 'Malayalam' }
                ]
            }
        ]
    },
    {
        name: 'Arijit Singh',
        bio: 'The King of Playback Singing in India.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Arijit_Singh_at_GiMA_Awards_2015.jpg',
        albums: [
            {
                title: 'Aashiqui 2',
                imageUrl: 'https://c.saavncdn.com/152/Aashiqui-2-Hindi-2013-500x500.jpg',
                songs: [
                    { title: 'Tum Hi Ho', genre: 'Romantic', mood: 'Sad', duration: 262, language: 'Hindi' },
                    { title: 'Chahun Main Ya Naa', genre: 'Romantic', mood: 'Romantic', duration: 304, language: 'Hindi' },
                    { title: 'Milne Hai Mujhse Aayi', genre: 'Rock', mood: 'Energetic', duration: 295, language: 'Hindi' }
                ]
            },
            {
                title: 'Ae Dil Hai Mushkil',
                imageUrl: 'https://c.saavncdn.com/257/Ae-Dil-Hai-Mushkil-Hindi-2016-500x500.jpg',
                songs: [
                    { title: 'Ae Dil Hai Mushkil', genre: 'Pop', mood: 'Soulful', duration: 269, language: 'Hindi' },
                    { title: 'Channa Mereya', genre: 'Sufi', mood: 'Sad', duration: 289, language: 'Hindi' }
                ]
            }
        ]
    },
    {
        name: 'The Weeknd',
        bio: 'Canadian singer, songwriter, and record producer.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/The_Weeknd_Cannes_2023.png',
        albums: [
            {
                title: 'After Hours',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png',
                songs: [
                    { title: 'Blinding Lights', genre: 'Synth-pop', mood: 'Energetic', duration: 200, language: 'English' },
                    { title: 'Save Your Tears', genre: 'Synth-pop', mood: 'Melancholic', duration: 215, language: 'English' },
                    { title: 'Heartless', genre: 'R&B', mood: 'Dark', duration: 198, language: 'English' }
                ]
            },
            {
                title: 'Starboy',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png',
                songs: [
                    { title: 'Starboy', genre: 'R&B', mood: 'Cool', duration: 230, language: 'English' },
                    { title: 'I Feel It Coming', genre: 'Pop', mood: 'Chill', duration: 269, language: 'English' }
                ]
            }
        ]
    },
    {
        name: 'Taylor Swift',
        bio: 'American singer-songwriter known for her narrative songwriting.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png',
        albums: [
            {
                title: '1989',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png',
                songs: [
                    { title: 'Blank Space', genre: 'Pop', mood: 'Happy', duration: 231, language: 'English' },
                    { title: 'Style', genre: 'Pop', mood: 'Cool', duration: 231, language: 'English' },
                    { title: 'Shake It Off', genre: 'Pop', mood: 'Party', duration: 219, language: 'English' }
                ]
            },
            {
                title: 'Folklore',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png',
                songs: [
                    { title: 'Cardigan', genre: 'Indie', mood: 'Chill', duration: 239, language: 'English' },
                    { title: 'Exile', genre: 'Indie', mood: 'Sad', duration: 285, language: 'English' }
                ]
            }
        ]
    },
    {
        name: 'Diljit Dosanjh',
        bio: 'Indian singer, actor, film producer, and television presenter.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Diljit_Dosanjh.jpg',
        albums: [
            {
                title: 'G.O.A.T.',
                imageUrl: 'https://c.saavncdn.com/229/G-O-A-T-Punjabi-2020-20200729163011-500x500.jpg',
                songs: [
                    { title: 'G.O.A.T.', genre: 'Hip-Hop', mood: 'Energetic', duration: 223, language: 'Punjabi' },
                    { title: 'Clash', genre: 'Hip-Hop', mood: 'Aggressive', duration: 176, language: 'Punjabi' },
                    { title: 'Peed', genre: 'Folk', mood: 'Sad', duration: 228, language: 'Punjabi' }
                ]
            },
            {
                title: 'MoonChild Era',
                imageUrl: 'https://c.saavncdn.com/977/MoonChild-Era-Punjabi-2021-20210822063007-500x500.jpg',
                songs: [
                    { title: 'Lover', genre: 'Pop', mood: 'Romantic', duration: 190, language: 'Punjabi' },
                    { title: 'Vibe', genre: 'Pop', mood: 'Happy', duration: 185, language: 'Punjabi' }
                ]
            }
        ]
    },
    {
        name: 'BTS',
        bio: 'South Korean boy band formed in 2010.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BTS_for_Dispatch_White_Day_Special%2C_27_February_2019_01.jpg/800px-BTS_for_Dispatch_White_Day_Special%2C_27_February_2019_01.jpg',
        albums: [
            {
                title: 'Map of the Soul: 7',
                imageUrl: 'https://c.saavncdn.com/712/Map-of-the-Soul-7-Korean-2020-20200221153411-500x500.jpg',
                songs: [
                    { title: 'Boy With Luv', genre: 'K-Pop', mood: 'Happy', duration: 229, language: 'Korean' },
                    { title: 'ON', genre: 'K-Pop', mood: 'Energetic', duration: 246, language: 'Korean' },
                    { title: 'Black Swan', genre: 'K-Pop', mood: 'Artistic', duration: 198, language: 'Korean' }
                ]
            },
            {
                title: 'BE',
                imageUrl: 'https://i.scdn.co/image/ab67616d0000b273cebf1a04d603a115456f932e',
                songs: [
                    { title: 'Dynamite', genre: 'Disco', mood: 'Happy', duration: 199, language: 'English' },
                    { title: 'Life Goes On', genre: 'Hip-Hop', mood: 'Chill', duration: 207, language: 'Korean' }
                ]
            }
        ]
    },
    {
        name: 'Anirudh Ravichander',
        bio: 'Indian film composer and singer, known for his work in Tamil cinema.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Anirudh_Ravichander_at_Audio_Launch_of_Remo.jpg',
        albums: [
            {
                title: '3',
                imageUrl: 'https://c.saavncdn.com/736/3-Tamil-2011-20190731133608-500x500.jpg',
                songs: [
                    { title: 'Why This Kolaveri Di', genre: 'Folk', mood: 'Funny', duration: 240, language: 'Tamil' },
                    { title: 'Kannazhaga', genre: 'Melody', mood: 'Romantic', duration: 200, language: 'Tamil' }
                ]
            },
            {
                title: 'Vikram',
                imageUrl: 'https://c.saavncdn.com/562/Vikram-Original-Motion-Picture-Soundtrack-Tamil-2022-20220515181056-500x500.jpg',
                songs: [
                    { title: 'Pathala Pathala', genre: 'Folk', mood: 'Dance', duration: 210, language: 'Tamil' },
                    { title: 'Vikram Title Track', genre: 'Rock', mood: 'Action', duration: 230, language: 'Tamil' }
                ]
            }
        ]
    }
];

const seedData = async () => {
    try {
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Song.deleteMany({});

        console.log('Cleared existing data...');

        for (const artistData of musicData) {
            // Create Artist
            const artist = await Artist.create({
                name: artistData.name,
                bio: artistData.bio,
                imageUrl: artistData.imageUrl
            });

            for (const albumData of artistData.albums) {
                // Create Album
                const album = await Album.create({
                    title: albumData.title,
                    artist: artist._id,
                    releaseDate: new Date(),
                    imageUrl: albumData.imageUrl
                });

                // Create Songs
                const songsWithIds = albumData.songs.map(song => ({
                    ...song,
                    artist: artist._id,
                    album: album._id,
                    popularity: Math.floor(Math.random() * 50) + 50 // Random popularity 50-100
                }));

                await Song.insertMany(songsWithIds);
            }
        }

        console.log('Database seeded successfully with REAL data!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
