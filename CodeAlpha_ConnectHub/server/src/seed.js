import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Post } from './models/Post.js';

await connectDB();
await Promise.all([User.deleteMany({ email: /@connecthub.dev$/ }), Post.deleteMany({ content: /#devseed/ })]);

const users = await User.create([
  {
    name: 'Ava Sharma',
    username: 'ava_sharma',
    email: 'ava@connecthub.dev',
    password: 'Password123!',
    bio: 'Product designer building calm social tools.',
    skills: ['Design Systems', 'UX', 'Community']
  },
  {
    name: 'Noah Carter',
    username: 'noah_codes',
    email: 'noah@connecthub.dev',
    password: 'Password123!',
    bio: 'Full stack engineer. Shipping, learning, repeating.',
    skills: ['React', 'Node.js', 'MongoDB']
  }
]);

await Post.create([
  {
    author: users[0]._id,
    content: 'Designing communities is less about feeds and more about trust. #devseed #product',
    hashtags: ['devseed', 'product']
  },
  {
    author: users[1]._id,
    content: 'ConnectHub API is live locally. Next stop: polish the onboarding flow. #devseed #engineering',
    hashtags: ['devseed', 'engineering']
  }
]);

console.log('Development seed data created.');
await mongoose.disconnect();
