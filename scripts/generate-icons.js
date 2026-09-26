import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE_LOGO = path.join(ROOT, 'src', 'assets', 'logo.png');

async function generateIcons() {
  console.log('Generating high-resolution icons for Android and iOS...');

  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('Source logo not found at:', SOURCE_LOGO);
    process.exit(1);
  }

  // 1. iOS AppIcon (1024x1024)
  const iosIconDir = path.join(ROOT, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
  if (fs.existsSync(iosIconDir)) {
    const iosDest = path.join(iosIconDir, 'AppIcon-512@2x.png');
    await sharp(SOURCE_LOGO)
      .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .toFile(iosDest);
    console.log('✓ iOS AppIcon generated (1024x1024):', iosDest);
  }

  // 2. Android Mipmaps
  const androidMipmaps = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const item of androidMipmaps) {
    const dirPath = path.join(ROOT, 'android', 'app', 'src', 'main', 'res', item.dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Square icon
    const squareDest = path.join(dirPath, 'ic_launcher.png');
    await sharp(SOURCE_LOGO)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .toFile(squareDest);

    // Round icon
    const roundDest = path.join(dirPath, 'ic_launcher_round.png');
    // Create a circular mask for round icon
    const circleBuffer = Buffer.from(
      `<svg width="${item.size}" height="${item.size}"><circle cx="${item.size / 2}" cy="${item.size / 2}" r="${item.size / 2}" fill="black"/></svg>`
    );

    await sharp(SOURCE_LOGO)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .composite([{ input: circleBuffer, blend: 'dest-in' }])
      .toFile(roundDest);

    // Foreground icon
    const fgDest = path.join(dirPath, 'ic_launcher_foreground.png');
    const fgPadding = Math.round(item.size * 0.2);
    const fgInner = item.size - fgPadding * 2;
    await sharp(SOURCE_LOGO)
      .resize(fgInner, fgInner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: fgPadding,
        bottom: fgPadding,
        left: fgPadding,
        right: fgPadding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(fgDest);

    console.log(`✓ Android ${item.dir} icons generated (${item.size}px)`);
  }

  console.log('All platform icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
