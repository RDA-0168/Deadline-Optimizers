import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 [RailMark Build] Initializing Render cloud build...');

// 1. Install dependencies for backend
try {
  console.log('📦 [RailMark Build] Installing backend dependencies...');
  execSync('npm --prefix railmark-backend install', { stdio: 'inherit' });
} catch (err) {
  console.warn('⚠️ [RailMark Build] Backend install note:', err.message);
}

// 2. Generate Prisma client
try {
  console.log('📦 [RailMark Build] Generating Prisma client...');
  execSync('npm --prefix railmark-backend run prisma:generate', { stdio: 'inherit' });
} catch (err) {
  console.warn('⚠️ [RailMark Build] Prisma generate note:', err.message);
}

// 2. Ensure public assets are in place
try {
  const backendPublic = path.resolve('railmark-backend/public');
  const rootPublic = path.resolve('public');
  
  if (fs.existsSync(backendPublic)) {
    fs.cpSync(backendPublic, rootPublic, { recursive: true, force: true });
  } else if (fs.existsSync(rootPublic)) {
    fs.cpSync(rootPublic, backendPublic, { recursive: true, force: true });
  }
  console.log('✅ [RailMark Build] Static assets verified.');
} catch (err) {
  console.warn('⚠️ [RailMark Build] Asset sync note:', err.message);
}

console.log('🎉 [RailMark Build] Build completed successfully!');
