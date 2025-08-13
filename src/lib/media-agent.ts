/**
 * TreeAI Media Management Agent
 * Expert system for handling all media files (photos, videos, audio)
 * Manages storage, optimization, validation, and integration
 */

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  path: string;
  publicPath: string;
  type: 'image' | 'video' | 'audio';
  format: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  optimized: boolean;
  compressed: boolean;
  webpVersion?: string;
  thumbnails?: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  project?: string;
  location?: string;
  category: string;
}

export interface MediaInventory {
  images: MediaFile[];
  videos: MediaFile[];
  audio: MediaFile[];
  missing: string[];
  duplicates: string[];
  totalFiles: number;
  totalSize: number;
  lastUpdated: Date;
}

export interface OptimizationSettings {
  images: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    formats: string[];
    createWebP: boolean;
    createThumbnails: boolean;
    thumbnailSizes: number[];
  };
  videos: {
    maxBitrate: string;
    formats: string[];
    createThumbnails: boolean;
  };
}

export class MediaAgent {
  private basePath: string;
  private publicPath: string;
  private inventory: MediaInventory | null = null;
  private settings: OptimizationSettings;

  constructor(basePath = '/Users/ain/ProWebsite/apps/web', publicPath = 'public') {
    this.basePath = basePath;
    this.publicPath = path.join(basePath, publicPath);
    this.settings = {
      images: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        formats: ['webp', 'jpg'],
        createWebP: true,
        createThumbnails: true,
        thumbnailSizes: [150, 300, 600]
      },
      videos: {
        maxBitrate: '2M',
        formats: ['mp4', 'webm'],
        createThumbnails: true
      }
    };
  }

  /**
   * Comprehensive media audit - scans all media files and identifies issues
   */
  async auditMedia(): Promise<MediaInventory> {
    console.log('🔍 Starting comprehensive media audit...');
    
    const inventory: MediaInventory = {
      images: [],
      videos: [],
      audio: [],
      missing: [],
      duplicates: [],
      totalFiles: 0,
      totalSize: 0,
      lastUpdated: new Date()
    };

    try {
      // Scan public directory for all media files
      const mediaFiles = await this.scanDirectory(this.publicPath);
      
      // Process each file
      for (const filePath of mediaFiles) {
        const mediaFile = await this.analyzeFile(filePath);
        if (mediaFile) {
          inventory[`${mediaFile.type}s` as keyof MediaInventory].push(mediaFile);
          inventory.totalFiles++;
          inventory.totalSize += mediaFile.size;
        }
      }

      // Check for missing files referenced in code
      const referencedFiles = await this.findReferencedMediaFiles();
      for (const ref of referencedFiles) {
        const exists = await this.fileExists(path.join(this.publicPath, ref));
        if (!exists) {
          inventory.missing.push(ref);
        }
      }

      // Find duplicates
      inventory.duplicates = await this.findDuplicates(inventory);

      this.inventory = inventory;
      console.log(`✅ Audit complete: ${inventory.totalFiles} files, ${this.formatBytes(inventory.totalSize)}`);
      
      return inventory;
    } catch (error) {
      console.error('❌ Media audit failed:', error);
      throw error;
    }
  }

  /**
   * Fix missing media files by suggesting replacements or creating placeholders
   */
  async fixMissingMedia(): Promise<{ fixed: string[]; suggestions: Record<string, string[]> }> {
    if (!this.inventory) {
      await this.auditMedia();
    }

    const fixed: string[] = [];
    const suggestions: Record<string, string[]> = {};

    for (const missingPath of this.inventory!.missing) {
      console.log(`🔧 Fixing missing media: ${missingPath}`);
      
      // Try to find similar files
      const similar = await this.findSimilarFiles(missingPath);
      if (similar.length > 0) {
        suggestions[missingPath] = similar;
      }

      // Create placeholder if it's an image
      if (this.isImagePath(missingPath)) {
        await this.createPlaceholder(missingPath);
        fixed.push(missingPath);
      }
    }

    return { fixed, suggestions };
  }

  /**
   * Optimize all media files
   */
  async optimizeAllMedia(): Promise<{ optimized: number; skipped: number; errors: string[] }> {
    if (!this.inventory) {
      await this.auditMedia();
    }

    let optimized = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Optimize images
    for (const image of this.inventory!.images) {
      try {
        if (!image.optimized) {
          await this.optimizeImage(image.path);
          optimized++;
        } else {
          skipped++;
        }
      } catch (error) {
        errors.push(`${image.path}: ${error}`);
      }
    }

    console.log(`✅ Optimization complete: ${optimized} optimized, ${skipped} skipped, ${errors.length} errors`);
    return { optimized, skipped, errors };
  }

  /**
   * Add new media file with automatic optimization and integration
   */
  async addMediaFile(filePath: string, options: {
    category: string;
    project?: string;
    location?: string;
    tags?: string[];
    optimize?: boolean;
  }): Promise<MediaFile> {
    console.log(`📁 Adding new media file: ${filePath}`);

    const stat = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName);
    const type = this.getMediaType(fileExt);
    
    // Generate unique ID and paths
    const id = this.generateId();
    const targetDir = path.join(this.publicPath, 'images', options.category);
    const targetPath = path.join(targetDir, `${id}${fileExt}`);
    
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Copy file
    await fs.copyFile(filePath, targetPath);
    
    // Create media file record
    const mediaFile: MediaFile = {
      id,
      name: fileName,
      originalName: fileName,
      path: targetPath,
      publicPath: `/images/${options.category}/${id}${fileExt}`,
      type,
      format: fileExt.slice(1),
      size: stat.size,
      optimized: false,
      compressed: false,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: options.tags || [],
      project: options.project,
      location: options.location,
      category: options.category
    };

    // Analyze and optimize if requested
    if (type === 'image') {
      const dimensions = await this.getImageDimensions(targetPath);
      mediaFile.dimensions = dimensions;
      
      if (options.optimize !== false) {
        await this.optimizeImage(targetPath);
        mediaFile.optimized = true;
      }
    }

    console.log(`✅ Media file added: ${mediaFile.publicPath}`);
    return mediaFile;
  }

  /**
   * Batch import media files from a directory
   */
  async batchImportMedia(sourceDir: string, options: {
    category: string;
    project?: string;
    location?: string;
    optimize?: boolean;
  }): Promise<MediaFile[]> {
    console.log(`📂 Batch importing from: ${sourceDir}`);
    
    const files = await this.scanDirectory(sourceDir);
    const imported: MediaFile[] = [];

    for (const filePath of files) {
      try {
        const mediaFile = await this.addMediaFile(filePath, {
          ...options,
          tags: [options.category, options.location || ''].filter(Boolean)
        });
        imported.push(mediaFile);
      } catch (error) {
        console.error(`❌ Failed to import ${filePath}:`, error);
      }
    }

    console.log(`✅ Batch import complete: ${imported.length} files`);
    return imported;
  }

  /**
   * Generate responsive image sets
   */
  async generateResponsiveImages(imagePath: string): Promise<{
    webp: string;
    thumbnails: string[];
    srcSet: string;
  }> {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const baseName = path.parse(imagePath).name;
    const baseDir = path.dirname(imagePath);

    const results = {
      webp: '',
      thumbnails: [] as string[],
      srcSet: ''
    };

    // Generate WebP version
    const webpPath = path.join(baseDir, `${baseName}.webp`);
    await image.webp({ quality: this.settings.images.quality }).toFile(webpPath);
    results.webp = webpPath;

    // Generate thumbnails
    for (const size of this.settings.images.thumbnailSizes) {
      const thumbPath = path.join(baseDir, `${baseName}_${size}w.jpg`);
      await image
        .resize(size, null, { withoutEnlargement: true })
        .jpeg({ quality: this.settings.images.quality })
        .toFile(thumbPath);
      results.thumbnails.push(thumbPath);
    }

    // Generate srcSet string
    const srcSetItems = results.thumbnails.map(thumb => {
      const size = path.parse(thumb).name.split('_')[1];
      return `${this.getPublicPath(thumb)} ${size}`;
    });
    results.srcSet = srcSetItems.join(', ');

    return results;
  }

  /**
   * Validate media file integrity and compatibility
   */
  async validateMediaFile(filePath: string): Promise<{
    valid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      const stat = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      // Check file size
      if (stat.size > 10 * 1024 * 1024) { // 10MB
        issues.push('File size exceeds 10MB');
        recommendations.push('Consider compressing the file');
      }

      // Check file type
      if (this.isImagePath(filePath)) {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        if (!metadata.width || !metadata.height) {
          issues.push('Invalid image dimensions');
        }
        
        if (metadata.width && metadata.width > 2560) {
          recommendations.push('Consider resizing image to max 2560px width');
        }
        
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          issues.push('Unsupported image format');
          recommendations.push('Convert to JPG, PNG, or WebP');
        }
      }

      return {
        valid: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      return {
        valid: false,
        issues: [`File validation failed: ${error}`],
        recommendations: ['Check if file exists and is readable']
      };
    }
  }

  /**
   * Get media usage report - where files are being used
   */
  async getUsageReport(): Promise<Record<string, string[]>> {
    const usage: Record<string, string[]> = {};
    const codeFiles = await this.scanCodeFiles();

    for (const codeFile of codeFiles) {
      const content = await fs.readFile(codeFile, 'utf-8');
      const mediaRefs = this.extractMediaReferences(content);
      
      for (const ref of mediaRefs) {
        if (!usage[ref]) {
          usage[ref] = [];
        }
        usage[ref].push(codeFile);
      }
    }

    return usage;
  }

  // Private helper methods
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mp3', '.wav'];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (mediaExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
    }

    return files;
  }

  private async analyzeFile(filePath: string): Promise<MediaFile | null> {
    try {
      const stat = await fs.stat(filePath);
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const type = this.getMediaType(ext);
      
      const mediaFile: MediaFile = {
        id: this.generateId(),
        name: fileName,
        originalName: fileName,
        path: filePath,
        publicPath: this.getPublicPath(filePath),
        type,
        format: ext.slice(1),
        size: stat.size,
        optimized: false,
        compressed: false,
        metadata: {},
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        tags: [],
        category: this.getCategoryFromPath(filePath)
      };

      // Get image dimensions if it's an image
      if (type === 'image') {
        try {
          mediaFile.dimensions = await this.getImageDimensions(filePath);
        } catch (error) {
          console.warn(`Could not get dimensions for ${filePath}:`, error);
        }
      }

      return mediaFile;
    } catch (error) {
      console.error(`Failed to analyze file ${filePath}:`, error);
      return null;
    }
  }

  private async findReferencedMediaFiles(): Promise<string[]> {
    const refs: string[] = [];
    const codeFiles = await this.scanCodeFiles();

    for (const codeFile of codeFiles) {
      try {
        const content = await fs.readFile(codeFile, 'utf-8');
        const mediaRefs = this.extractMediaReferences(content);
        refs.push(...mediaRefs);
      } catch (error) {
        console.warn(`Could not read file ${codeFile}:`, error);
      }
    }

    return [...new Set(refs)];
  }

  private async scanCodeFiles(): Promise<string[]> {
    const codeExtensions = ['.tsx', '.ts', '.jsx', '.js', '.vue', '.svelte'];
    const srcPath = path.join(this.basePath, 'src');
    return this.scanDirectoryWithExtensions(srcPath, codeExtensions);
  }

  private async scanDirectoryWithExtensions(dirPath: string, extensions: string[]): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await this.scanDirectoryWithExtensions(fullPath, extensions);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
    }

    return files;
  }

  private extractMediaReferences(content: string): string[] {
    const refs: string[] = [];
    
    // Match various patterns for media references
    const patterns = [
      /src=["']([^"']*\.(?:jpg|jpeg|png|gif|webp|mp4|mov|avi|mp3|wav))["']/gi,
      /href=["']([^"']*\.(?:jpg|jpeg|png|gif|webp|mp4|mov|avi|mp3|wav))["']/gi,
      /url\(["']?([^)"']*\.(?:jpg|jpeg|png|gif|webp|mp4|mov|avi|mp3|wav))["']?\)/gi,
      /["']([/]?images[^"']*\.(?:jpg|jpeg|png|gif|webp))["']/gi
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let ref = match[1];
        // Normalize path
        if (ref.startsWith('/')) {
          ref = ref.slice(1);
        }
        refs.push(ref);
      }
    }

    return refs;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async findDuplicates(inventory: MediaInventory): Promise<string[]> {
    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const mediaArray of [inventory.images, inventory.videos, inventory.audio]) {
      for (const media of mediaArray) {
        const key = `${media.size}_${media.name}`;
        if (seen.has(key)) {
          duplicates.push(media.path);
        } else {
          seen.add(key);
        }
      }
    }

    return duplicates;
  }

  private async findSimilarFiles(missingPath: string): Promise<string[]> {
    if (!this.inventory) return [];
    
    const baseName = path.basename(missingPath, path.extname(missingPath)).toLowerCase();
    const similar: string[] = [];

    for (const mediaArray of [this.inventory.images, this.inventory.videos, this.inventory.audio]) {
      for (const media of mediaArray) {
        const mediaBaseName = path.basename(media.name, path.extname(media.name)).toLowerCase();
        if (this.calculateSimilarity(baseName, mediaBaseName) > 0.7) {
          similar.push(media.publicPath);
        }
      }
    }

    return similar;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private getEditDistance(str1: string, str2: string): number {
    const dp = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) dp[0][i] = i;
    for (let j = 0; j <= str2.length; j++) dp[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[j][i] = dp[j - 1][i - 1];
        } else {
          dp[j][i] = Math.min(dp[j - 1][i], dp[j][i - 1], dp[j - 1][i - 1]) + 1;
        }
      }
    }
    
    return dp[str2.length][str1.length];
  }

  private async createPlaceholder(imagePath: string): Promise<void> {
    const targetPath = path.join(this.publicPath, imagePath);
    const targetDir = path.dirname(targetPath);
    
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Create a simple placeholder image
    const placeholder = sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 64, g: 64, b: 64 }
      }
    }).jpeg();

    await placeholder.toFile(targetPath);
    console.log(`📷 Created placeholder: ${imagePath}`);
  }

  private async optimizeImage(imagePath: string): Promise<void> {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) return;

    const optimized = image
      .resize(
        Math.min(metadata.width, this.settings.images.maxWidth),
        Math.min(metadata.height, this.settings.images.maxHeight),
        { withoutEnlargement: true }
      )
      .jpeg({ quality: this.settings.images.quality });

    await optimized.toFile(imagePath.replace(path.extname(imagePath), '_optimized.jpg'));
  }

  private async getImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0
    };
  }

  private getMediaType(extension: string): 'image' | 'video' | 'audio' {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExts = ['.mp4', '.mov', '.avi', '.webm'];
    const audioExts = ['.mp3', '.wav', '.ogg'];

    if (imageExts.includes(extension.toLowerCase())) return 'image';
    if (videoExts.includes(extension.toLowerCase())) return 'video';
    if (audioExts.includes(extension.toLowerCase())) return 'audio';
    
    return 'image'; // default
  }

  private isImagePath(filePath: string): boolean {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExts.includes(path.extname(filePath).toLowerCase());
  }

  private getPublicPath(fullPath: string): string {
    return fullPath.replace(this.publicPath, '').replace(/\\/g, '/');
  }

  private getCategoryFromPath(filePath: string): string {
    const relativePath = path.relative(this.publicPath, filePath);
    const parts = relativePath.split(path.sep);
    
    if (parts.length > 2) {
      return parts[1]; // e.g., "images/equipment/file.jpg" -> "equipment"
    }
    
    return 'uncategorized';
  }

  private generateId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Public utility methods
  
  /**
   * Quick fix for common media issues
   */
  async quickFix(): Promise<{ fixed: string[]; report: string }> {
    console.log('🚀 Running Media Agent Quick Fix...');
    
    const fixed: string[] = [];
    const issues: string[] = [];

    // 1. Audit media
    const inventory = await this.auditMedia();
    console.log(`📊 Found ${inventory.totalFiles} media files, ${inventory.missing.length} missing`);

    // 2. Fix missing media
    const { fixed: fixedFiles, suggestions } = await this.fixMissingMedia();
    fixed.push(...fixedFiles);

    // 3. Generate report
    const report = `
🎯 MEDIA AGENT REPORT
=====================

📈 INVENTORY:
- Images: ${inventory.images.length}
- Videos: ${inventory.videos.length}
- Audio: ${inventory.audio.length}
- Total Size: ${this.formatBytes(inventory.totalSize)}

❌ ISSUES FOUND:
- Missing files: ${inventory.missing.length}
- Duplicates: ${inventory.duplicates.length}

✅ FIXES APPLIED:
- Created placeholders: ${fixedFiles.length}
- Files fixed: ${fixed.length}

💡 SUGGESTIONS:
${Object.entries(suggestions).map(([missing, alts]) => 
  `- Replace "${missing}" with: ${alts.slice(0, 3).join(', ')}`
).join('\n')}

🎯 NEXT STEPS:
1. Access site at: http://localhost:3001/treeshop
2. Review media usage report
3. Optimize media files for better performance
4. Consider implementing responsive images
`;

    console.log('✅ Quick fix complete!');
    return { fixed, report };
  }

  /**
   * Generate comprehensive media report
   */
  async generateReport(): Promise<string> {
    const inventory = await this.auditMedia();
    const usage = await this.getUsageReport();
    
    return `
# TreeAI Media Management Report
Generated: ${new Date().toISOString()}

## Inventory Summary
- **Total Files**: ${inventory.totalFiles}
- **Total Size**: ${this.formatBytes(inventory.totalSize)}
- **Images**: ${inventory.images.length}
- **Videos**: ${inventory.videos.length}
- **Audio**: ${inventory.audio.length}

## Issues
- **Missing Files**: ${inventory.missing.length}
- **Duplicates**: ${inventory.duplicates.length}

## Categories
${this.generateCategoryBreakdown(inventory)}

## Missing Files
${inventory.missing.map(file => `- ${file}`).join('\n')}

## Recommendations
${this.generateRecommendations(inventory)}
`;
  }

  private generateCategoryBreakdown(inventory: MediaInventory): string {
    const categories: Record<string, number> = {};
    
    for (const media of [...inventory.images, ...inventory.videos, ...inventory.audio]) {
      categories[media.category] = (categories[media.category] || 0) + 1;
    }
    
    return Object.entries(categories)
      .map(([cat, count]) => `- **${cat}**: ${count} files`)
      .join('\n');
  }

  private generateRecommendations(inventory: MediaInventory): string {
    const recs: string[] = [];
    
    if (inventory.missing.length > 0) {
      recs.push(`- Fix ${inventory.missing.length} missing media references`);
    }
    
    if (inventory.duplicates.length > 0) {
      recs.push(`- Remove ${inventory.duplicates.length} duplicate files`);
    }
    
    const largeFiles = [...inventory.images, ...inventory.videos].filter(f => f.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      recs.push(`- Optimize ${largeFiles.length} large files (>5MB)`);
    }
    
    return recs.join('\n');
  }
}

// Export singleton instance
export const mediaAgent = new MediaAgent();