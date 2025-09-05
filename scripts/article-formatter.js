#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ArticleFormatterAgent {
    constructor() {
        this.contentDir = path.join(__dirname, '../src/content/blog');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Industry-relevant keywords for auto-tagging
        this.keywords = {
            'forestry mulching': ['forestry mulching', 'forestry', 'mulching'],
            'land clearing': ['land clearing', 'land development', 'site prep'],
            'tree removal': ['tree removal', 'tree cutting', 'tree service'],
            'equipment': ['skid steer', 'cat', 'caterpillar', 'fecon', 'blackhawk'],
            'florida': ['florida', 'central florida', 'orlando', 'tampa'],
            'property': ['property management', 'property maintenance', 'property development'],
            'safety': ['safety', 'fire prevention', 'hazard'],
            'residential': ['residential', 'homeowner', 'property owner'],
            'commercial': ['commercial', 'business', 'industrial'],
            'environmental': ['environmental', 'eco-friendly', 'sustainable']
        };

        this.commonTags = [
            'forestry mulching', 'land clearing', 'tree removal', 'property maintenance',
            'florida', 'central florida', 'safety', 'equipment', 'tips', 'residential',
            'commercial', 'environmental', 'fire prevention', 'property development'
        ];
    }

    // Create URL-friendly slug from title
    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    // Generate SEO-optimized title if none provided
    generateTitle(content) {
        const sentences = content.split(/[.!?]+/);
        const firstSentence = sentences[0]?.trim();
        
        if (firstSentence && firstSentence.length > 10 && firstSentence.length < 70) {
            return firstSentence;
        }

        // Fallback: Create title from first meaningful paragraph
        const paragraphs = content.split('\n').filter(p => p.trim().length > 20);
        if (paragraphs.length > 0) {
            const words = paragraphs[0].split(' ').slice(0, 10);
            return words.join(' ') + '...';
        }

        return 'TreeShop Florida Land Clearing Services';
    }

    // Auto-detect relevant tags from content
    detectTags(content) {
        const contentLower = content.toLowerCase();
        const detectedTags = new Set();

        // Check for keyword matches
        Object.entries(this.keywords).forEach(([category, terms]) => {
            terms.forEach(term => {
                if (contentLower.includes(term)) {
                    detectedTags.add(category);
                }
            });
        });

        // Add specific common terms found
        this.commonTags.forEach(tag => {
            if (contentLower.includes(tag.toLowerCase())) {
                detectedTags.add(tag);
            }
        });

        return Array.from(detectedTags).slice(0, 6); // Limit to 6 tags
    }

    // Generate meta description from content
    generateMetaDescription(content) {
        // Remove markdown syntax and get first meaningful content
        const cleanContent = content
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
            .replace(/\*([^*]+)\*/g, '$1') // Remove italic
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .trim();

        // Get first 150 characters for meta description
        let description = cleanContent.substring(0, 150);
        
        // Cut at last complete word
        const lastSpace = description.lastIndexOf(' ');
        if (lastSpace > 100) {
            description = description.substring(0, lastSpace);
        }

        return description + '...';
    }

    // Format content into proper markdown structure
    formatContent(content) {
        let formatted = content.trim();

        // Ensure proper heading hierarchy
        formatted = formatted.replace(/^#+\s/gm, (match) => {
            const level = match.trim().length - 1;
            return '#'.repeat(Math.min(level, 6)) + ' ';
        });

        // Add call-to-action at end if not present
        if (!formatted.toLowerCase().includes('treeshop') || !formatted.toLowerCase().includes('call') || !formatted.toLowerCase().includes('contact')) {
            formatted += `\n\n## Ready to Transform Your Property?\n\nDon't let overgrown vegetation compromise your property's safety, value, or usability. TreeShop's professional land clearing and forestry mulching services provide the expertise and equipment needed to tackle any Florida property challenge.\n\n**Get started today:**\n- Free property assessment and consultation\n- Licensed, insured, and experienced team\n- State-of-the-art equipment and eco-friendly methods\n- Competitive pricing with transparent estimates\n\n[Contact TreeShop today](https://treeshop.app/contact) for your free property assessment, or call us at (407) XXX-XXXX to discuss your land clearing needs.`;
        }

        return formatted;
    }

    // Get current date in YYYY-MM-DD format
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Extract title from content if it exists
    extractExistingTitle(content) {
        const lines = content.split('\n');
        
        // Check first few lines for title patterns
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            
            // Check for markdown header
            if (line.match(/^#{1,2}\s+(.+)/)) {
                const title = line.replace(/^#+\s+/, '');
                // Remove this title from content
                const remainingContent = lines.slice(i + 1).join('\n').trim();
                return { title, content: remainingContent };
            }
        }

        return { title: null, content };
    }

    // Create the formatted MDX file
    async createFormattedArticle(rawContent) {
        // Extract or generate title
        const { title: existingTitle, content: contentWithoutTitle } = this.extractExistingTitle(rawContent);
        const title = existingTitle || this.generateTitle(rawContent);
        const slug = this.createSlug(title);
        const tags = this.detectTags(rawContent);
        const excerpt = this.generateMetaDescription(rawContent);
        const formattedContent = this.formatContent(contentWithoutTitle);
        const date = this.getCurrentDate();

        // Create front matter
        const frontMatter = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
author: "TreeShop Team"
category: "Land Clearing"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
published: true
---

${formattedContent}`;

        // Ensure content directory exists
        if (!fs.existsSync(this.contentDir)) {
            fs.mkdirSync(this.contentDir, { recursive: true });
        }

        // Create filename
        const filename = `${slug}.mdx`;
        const filepath = path.join(this.contentDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
            const timestamp = Date.now();
            const newFilename = `${slug}-${timestamp}.mdx`;
            const newFilepath = path.join(this.contentDir, newFilename);
            fs.writeFileSync(newFilepath, frontMatter);
            return { filepath: newFilepath, filename: newFilename };
        } else {
            fs.writeFileSync(filepath, frontMatter);
            return { filepath, filename };
        }
    }

    // Main interactive interface
    async getInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    async run() {
        console.log('🌲 TreeShop Article Formatter Agent');
        console.log('=====================================\n');
        console.log('This agent will format your raw text into a blog-ready MDX file.\n');

        try {
            // Get input method preference
            console.log('How would you like to provide your article content?');
            console.log('1. Paste text directly');
            console.log('2. Read from file');
            const method = await this.getInput('\nEnter choice (1 or 2): ');

            let rawContent = '';

            if (method === '2') {
                const filePath = await this.getInput('Enter file path: ');
                if (fs.existsSync(filePath)) {
                    rawContent = fs.readFileSync(filePath, 'utf8');
                } else {
                    console.log('❌ File not found. Exiting...');
                    this.rl.close();
                    return;
                }
            } else {
                console.log('\nPaste your article content below (press Ctrl+D when done):');
                console.log('---');
                
                // Read multiline input
                const chunks = [];
                process.stdin.on('data', chunk => {
                    chunks.push(chunk);
                });

                await new Promise(resolve => {
                    process.stdin.on('end', () => {
                        rawContent = Buffer.concat(chunks).toString();
                        resolve();
                    });
                });
            }

            if (!rawContent.trim()) {
                console.log('❌ No content provided. Exiting...');
                this.rl.close();
                return;
            }

            console.log('\n🔄 Processing article...\n');

            // Format the article
            const result = await this.createFormattedArticle(rawContent);

            console.log('✅ Article formatted successfully!');
            console.log(`📁 File created: ${result.filename}`);
            console.log(`📍 Location: ${result.filepath}`);

            // Ask about git operations
            const shouldCommit = await this.getInput('\nCommit and push to git? (y/n): ');
            
            if (shouldCommit.toLowerCase() === 'y') {
                const { spawn } = require('child_process');
                
                console.log('\n🔄 Adding to git...');
                const gitAdd = spawn('git', ['add', result.filepath]);
                
                gitAdd.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ File added to git');
                        
                        const commitMessage = `Add new article: ${path.basename(result.filename, '.mdx')}`;
                        const gitCommit = spawn('git', ['commit', '-m', commitMessage]);
                        
                        gitCommit.on('close', (commitCode) => {
                            if (commitCode === 0) {
                                console.log('✅ Changes committed');
                                
                                const gitPush = spawn('git', ['push']);
                                gitPush.on('close', (pushCode) => {
                                    if (pushCode === 0) {
                                        console.log('✅ Changes pushed to remote');
                                    } else {
                                        console.log('⚠️  Failed to push to remote');
                                    }
                                    this.rl.close();
                                });
                            } else {
                                console.log('⚠️  Failed to commit changes');
                                this.rl.close();
                            }
                        });
                    } else {
                        console.log('⚠️  Failed to add file to git');
                        this.rl.close();
                    }
                });
            } else {
                this.rl.close();
            }

            console.log('\n🎉 Article formatting complete!');
            console.log('\nNext steps:');
            console.log('1. Review the generated file');
            console.log('2. Make any manual adjustments needed');
            console.log('3. Test in your development environment');
            console.log('4. Deploy when ready');

        } catch (error) {
            console.error('❌ Error:', error.message);
            this.rl.close();
        }
    }
}

// Run the agent if called directly
if (require.main === module) {
    const agent = new ArticleFormatterAgent();
    agent.run().catch(console.error);
}

module.exports = ArticleFormatterAgent;