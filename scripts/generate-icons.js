import sharp from 'sharp';
import { join } from 'path';

const sourceIcon = join(process.cwd(), 'public', 'logo', 'icon.png');

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(join(process.cwd(), 'public', 'logo', `icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);
