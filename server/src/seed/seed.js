import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Expertise from '../models/Expertise.js';
import Award from '../models/Award.js';
import Publication from '../models/Publication.js';
import Contact from '../models/Contact.js';
import SiteSettings from '../models/SiteSettings.js';

import * as data from './data.js';

const FRESH = process.argv.includes('--fresh');

async function upsertSingleton(Model, values) {
  const doc = (await Model.findOne()) || new Model({});
  Object.assign(doc, values);
  await doc.save();
  return doc;
}

async function seedCollection(Model, rows, label) {
  const count = await Model.countDocuments();
  if (count > 0 && !FRESH) {
    console.log(`· ${label}: ${count} existing entries left untouched (use --fresh to replace)`);
    return;
  }
  if (FRESH) await Model.deleteMany({});
  await Model.insertMany(rows);
  console.log(`✓ ${label}: ${rows.length} entries`);
}

async function run() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding.');
  }
  if (password.length < 10) {
    throw new Error('ADMIN_PASSWORD must be at least 10 characters.');
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log(`· Admin ${email} already exists — password left unchanged`);
  } else {
    await Admin.create({ email, password, name: process.env.ADMIN_NAME || 'Site Administrator' });
    console.log(`✓ Admin created: ${email}`);
  }

  await upsertSingleton(Profile, data.profile);
  console.log('✓ Profile');
  await upsertSingleton(Contact, data.contact);
  console.log('✓ Contact');
  await upsertSingleton(SiteSettings, data.settings);
  console.log('✓ Site settings');

  await seedCollection(Education, data.education, 'Education');
  await seedCollection(Experience, data.experience, 'Experience & training');
  await seedCollection(Expertise, data.expertise, 'Expertise');
  await seedCollection(Award, data.awards, 'Awards');
  await seedCollection(Publication, data.publications, 'Publications');

  console.log('\nSeed complete. Sign in at /admin/login');
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
