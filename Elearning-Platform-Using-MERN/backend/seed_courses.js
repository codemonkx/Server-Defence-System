const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning';

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    teacher: String,
    teacherId: mongoose.Schema.Types.ObjectId,
    price: Number,
    img: String,
    videos: [mongoose.Schema.Types.ObjectId]
});

const Course = mongoose.model('course', courseSchema);

const newCourses = [
    {
        title: "Financial Analysis Masterclass",
        description: "Learn to analyze financial statements like a pro. Perfect for aspiring investors and business analysts.",
        category: "Business",
        teacher: "Michael Chen",
        teacherId: new mongoose.Types.ObjectId(),
        price: 4999,
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Digital Marketing Strategy",
        description: "Master SEO, SEM, and social media marketing to grow your business online.",
        category: "Business",
        teacher: "Sarah Johnson",
        teacherId: new mongoose.Types.ObjectId(),
        price: 3500,
        img: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d9?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Advanced React Patterns",
        description: "Take your React skills to the next level with advanced hooks, context, and performance optimization.",
        category: "Tech",
        teacher: "David Miller",
        teacherId: new mongoose.Types.ObjectId(),
        price: 7500,
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Full Stack Web Development with Next.js",
        description: "Build modern, scalable applications with the latest Next.js features and Tailwind CSS.",
        category: "Tech",
        teacher: "Alex Rivera",
        teacherId: new mongoose.Types.ObjectId(),
        price: 9000,
        img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Mindfulness and Emotional Intelligence",
        description: "Develop self-awareness and resilience with practical mindfulness techniques for daily life.",
        category: "Personal Development",
        teacher: "Emma Wilson",
        teacherId: new mongoose.Types.ObjectId(),
        price: 2000,
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Public Speaking Confidence",
        description: "Overcome fear and deliver powerful presentations that captivate your audience.",
        category: "Personal Development",
        teacher: "James Taylor",
        teacherId: new mongoose.Types.ObjectId(),
        price: 2500,
        img: "https://images.unsplash.com/photo-1475721027187-402473394859?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Python for Data Analysis",
        description: "Learn Pandas, NumPy, and Matplotlib to perform professional data analysis tasks.",
        category: "Data Science",
        teacher: "Dr. Robert King",
        teacherId: new mongoose.Types.ObjectId(),
        price: 5500,
        img: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "SQL Masterclass: zero to Hero",
        description: "Master PostgreSQL and MySQL to manage data efficiently for any application.",
        category: "Data Science",
        teacher: "Linda Gonzalez",
        teacherId: new mongoose.Types.ObjectId(),
        price: 4000,
        img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "AWS Certified Solutions Architect",
        description: "Pass your AWS certification with this comprehensive guide to cloud architecture.",
        category: "Tech",
        teacher: "Ryan Anderson",
        teacherId: new mongoose.Types.ObjectId(),
        price: 8500,
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop",
        videos: []
    },
    {
        title: "Entrepreneurship 101",
        description: "Everything you need to know to start your own successful business from scratch.",
        category: "Business",
        teacher: "Mark Stevens",
        teacherId: new mongoose.Types.ObjectId(),
        price: 6000,
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        videos: []
    }
];

async function seed() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB for seeding...");

        // Using insertMany to add multiple courses at once
        const result = await Course.insertMany(newCourses);
        console.log(`Successfully seeded ${result.length} new courses.`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
