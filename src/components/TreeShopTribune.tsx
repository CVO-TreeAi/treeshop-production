'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

// Static articles data - no file system dependencies
const TRIBUNE_ARTICLES = [
  {
    id: 'moneyball-rules-data-tree-industry',
    title: 'The MoneyBall Rules: How Data Transformed an Industry That Grows on Trees',
    date: '2025-09-05',
    author: 'Jeremiah Anderson, CEO TreeShop',
    category: 'Industry Insights',
    tags: ['MoneyBall', 'data analytics', 'tree care industry', 'TreeAI', 'business operations'],
    readingTime: '8 min read',
    excerpt: 'Like baseball before Billy Beane, the tree care industry has traditionally relied on gut feelings and generational wisdom. But it\'s an industry ripe for a data revolution.',
    content: `# The MoneyBall Rules: How Data Transformed an Industry That Grows on Trees

"It's unbelievable how much you don't know about the game you've been playing all your life."

The quote is attributed to Mickey Mantle, the legendary Yankees slugger. There's just one problem—he never said it. It's completely made up, a Hollywood invention for dramatic effect. But here's what's funny about this fake quote: it's more true than most real ones.

I spend my days in an industry that literally grows on trees—forestry mulching and tree care. Like baseball before Billy Beane, it's an industry where success has traditionally been measured by gut feelings, generational wisdom, and the kind of intuitive knowledge that comes from decades of looking up at canopies and calculating risk. But also like baseball, it's an industry ripe for a data revolution.

## From Sales to Systems

When I was hired to rebuild the sales department for a tree service company, I thought I understood the game. I was the tree guy—the expert who could handle any project from the ground up. Sales seemed like an easy fix: stabilize revenue so we could focus on operations without the weekly financial rollercoaster.

My wife and I had built a system that was lean and lethal. She would schedule 20-30 in-person sales appointments for me per day—not per week, per day. The marketing campaigns produced phone calls, she documented everything in our systems, and then scheduled my visits based on efficient routing. We had the week pre-planned with zip codes mapped for optimal efficiency.

But here's where it gets interesting: because I was selling the jobs and had an almost photographic memory for addresses, I could follow up and watch the work get completed. I saw the hurdles the crews faced, how those impacted the profit and time predictions I'd made, and most importantly—I saw patterns emerge.

## The Data Revolution Begins

It was amazing to watch it evolve from nothing to small consistencies to being able to predict job duration down to the minute. The numbers started telling me a story that I could run ahead of, job after job. Sure, I struck out plenty, but I was getting on base more and more frequently.

Every job became a data point. Every address held memories of specific tree conditions, crew challenges, and profit outcomes. The patterns revealed mathematical relationships as consistent as gravity—relationships that had been governing our industry for generations, invisible to operators who relied solely on experience.

The fake Mickey Mantle quote became my reality check: I was learning how much I didn't know about the game I'd been playing my entire professional life.

## The MoneyBall Rules for Tree Care

After years of gathering, processing, studying, and deploying data from the tree care industry, I've identified what I call the MoneyBall Rules—nine universal principles that govern profitable tree care operations, whether you're running a single crew or managing a fleet.

**Rule #1 - The Pitcher Rule (Leadership)**: Data sets the pace, intuition follows the count. Every successful tree care operation starts with measuring what actually happens, not what you think happens. Track your true production rates, actual costs, and real profit margins before making strategic decisions.

**Rule #2 - The Catcher Rule (Operations Management)**: See the whole field, call the right play. Document everything systematically—job conditions, crew performance, equipment issues, weather impacts. The patterns in your records become tomorrow's competitive advantage.

**Rule #3 - The First Base Rule (Fundamentals)**: Master the basics before swinging for home runs. Get your core processes right—accurate estimating, consistent safety protocols, reliable equipment maintenance. Flashy techniques don't matter if you can't consistently deliver profitable work.

**Rule #4 - The Second Base Rule (Efficiency)**: Speed comes from eliminating wasted motion, not moving faster. Study your workflows to identify bottlenecks. The time saved between cuts, between sites, and between setups often exceeds time saved during actual work.

**Rule #5 - The Third Base Rule (Precision)**: The closer you get to home, the more details matter. Small variations in technique, equipment settings, and crew coordination compound into major differences in profitability. Measure and optimize the details others ignore.

**Rule #6 - The Shortstop Rule (Adaptability)**: Position yourself where the data says the work will be, not where tradition says to stand. Use your performance metrics to identify your most profitable job types, optimal crew sizes, and ideal market segments. Let the numbers guide your positioning.

**Rule #7 - The Left Field Rule (Hidden Value)**: Find profit in the work others avoid or undervalue. Every market has underserved niches where your specialized knowledge creates pricing power. Use data to identify and dominate these opportunities.

**Rule #8 - The Center Field Rule (Strategic Vision)**: See the entire field, anticipate where the industry is heading. Track macro trends—environmental regulations, insurance requirements, technology adoption. Position your business where the industry will be, not where it is.

**Rule #9 - The Right Field Rule (Execution)**: Consistency wins more games than spectacular plays. Build systems that deliver predictable results regardless of which crew is working. Your worst day should still be profitable, and your best practices should be teachable.

## The Bottom Line

At the end of the day, this industry—like every industry—comes down to money in versus money out. That's the only scoreboard that matters. I track everything to increase money in and decrease money out simultaneously, building ecosystem-wide solutions designed to stabilize the industry.

The beauty of these principles isn't that they require advanced technology or massive capital investment. They require something more fundamental: the willingness to measure, analyze, and improve systematically. The professionals who embrace this approach don't just work harder—they work smarter, and they consistently outperform competitors who rely solely on experience and intuition.

## The Future is Here

**TreeAI beta** - coming down soon - out now on iOS  
**TreeShop Maps** - coming soon - AppStore Review is a waiting game sometimes  
**TreeShopOps** - is next on the list - from customer website straight to your phone - Live updating system, sales, automation, and an ecosystem of business operations tools specific to the TreeCare Industry

Whether Mickey Mantle said it or not, every data point collected in our industry proves the truth of that quote. The game we've been playing our entire professional lives contains layers of complexity and opportunity that most operators never discover.

The MoneyBall revolution in tree care isn't coming—it's here. The question isn't whether data-driven operations will dominate the industry; it's whether you'll be leading the charge or trying to catch up.

Ready to transform your tree care operations? [Get your data-driven estimate](/estimate)`
  },
  {
    id: 'iphone-professional-site-planning',
    title: 'This App Turns Your iPhone Into a Professional Site Planning Tool',
    date: '2025-09-04',
    author: 'TreeShop Editorial',
    category: 'Equipment & Technology',
    tags: ['TreeShop Maps', 'site planning', 'professional tools', 'GPS technology'],
    readingTime: '4 min read',
    excerpt: 'TreeShop Maps transforms your iPhone into a precision site planning tool that eliminates scope disputes and ensures you execute exactly what was planned.',
    content: `# This App Turns Your iPhone Into a Professional Site Planning Tool

Forget hand-drawn sketches and rough estimates. TreeShop Maps transforms your iPhone into a precision site planning tool that bridges the gap between what you plan and what you execute.

## Professional Planning Made Simple

The app creates satellite-accurate work zone maps using your phone's capabilities. Quick measurements between any points. Easy polygon drawing that automatically calculates area and perimeter. Each work zone gets assigned to your service packages with automatic color coding that makes scope crystal clear.

**No more "I thought we were clearing that section too."**

These aren't just planning documents. When you arrive at the job site, the app shows your exact location on your pre-drawn site plan. Execute precisely what was planned, with visual guidance that eliminates scope confusion.

## Why Professional Presentation Matters

Instead of sketched boundaries on property printouts, you're showing clients precise, satellite-accurate plans with exact measurements. The visual impact elevates your professional image, but the real value comes during execution when there's zero ambiguity about work scope.

The color-coded system works with any service tier you offer. Maybe your "small" package is light brush clearing, while "large" means full land preparation. The app adapts to your business model while ensuring everyone understands exactly what's included.

## Results That Matter

Professional contractors using TreeShop Maps report:
- Faster project planning and client presentations
- Reduced scope disputes and change orders  
- More accurate estimates and better profit margins
- Enhanced professional credibility with visual planning

## The TreeShop Difference

TreeShop Maps turns site planning from an administrative task into a competitive advantage. When clients can see exactly what they're getting and you can execute precisely what was planned, trust builds and referrals follow.

Ready to plan like a pro? [Contact TreeShop about Maps access](/estimate)`
  },
  {
    id: 'gps-measurement-revolution',
    title: 'Why Your Next Land Clearing Contract Should Include GPS-Accurate Measurements',
    date: '2025-09-03',
    author: 'TreeShop Editorial',
    category: 'Industry Insights',
    tags: ['GPS measurement', 'accurate pricing', 'professional standards', 'contract clarity'],
    readingTime: '3 min read',
    excerpt: 'Modern tree care professionals use GPS technology to provide exact measurements and visual site plans. Here\'s why this matters for your next project.',
    content: `# Why Your Next Land Clearing Contract Should Include GPS-Accurate Measurements

Modern tree care professionals can measure your property with professional-grade precision using GPS technology. This capability fundamentally changes what you should expect from land clearing and forestry mulching projects.

## Exact Measurements, Accurate Pricing

GPS measurement accuracy means exact area calculations rather than rough estimates. When contractors quote per-acre pricing, GPS tools ensure you're paying for precisely measured acreage, not approximated footage that might include significant estimation errors.

Professional contractors now create visual site plans with exact measurements and color-coded service zones. You see exactly what work happens where before signing any contracts.

## Clear Scope, No Disputes

The biggest benefit isn't just accuracy - it's clarity. Color-coded site plans show precisely what work happens where. Different service levels get distinct colors, eliminating confusion about what's included in your contract.

When work begins, GPS-enabled contractors can execute exactly what was planned. No interpretation gaps, no scope creep, no "I thought you meant that area" conversations.

## What to Expect from Modern Contractors

Professional tree care companies using GPS planning technology provide:

- **Exact measurements** for accurate pricing
- **Visual site plans** showing precise work zones  
- **Clear scope definitions** with color-coded service levels
- **GPS-guided execution** ensuring work matches the plan
- **Professional documentation** suitable for permits and development planning

## TreeShop Maps Standard

TreeShop sets the industry standard with GPS-accurate site planning and field execution guidance. Every project begins with precise measurement and visual planning that eliminates scope ambiguity.

Our GPS-guided approach ensures you get exactly what you contract for - no over-clearing, no missed sections, no scope disputes.

When evaluating contractors, ask about their measurement and planning technology. GPS tools demonstrate professional standards and operational efficiency that protect your investment.

Ready for GPS-accurate planning? [Get your TreeShop estimate](/estimate)`
  },
  {
    id: 'fort-mccoy-transformation',
    title: 'Transforming Land in Fort McCoy with Forestry Mulching',
    date: '2025-09-02',
    author: 'TreeShop Editorial',
    category: 'Field Reports',
    tags: ['Fort McCoy', 'property sale', '6 inch DBH', 'day rate'],
    readingTime: '3 min read',
    excerpt: 'How TreeShop helped a Fort McCoy property owner prepare her 8.06-acre land for sale using strategic forestry mulching, increasing marketability and showcasing true potential to buyers.',
    content: `# Fort McCoy Project: 8.06 Acres Transformed for Real Estate Success

We recently had the opportunity to work with a returning client in Fort McCoy who wanted to prepare her land for sale. When she first reached out, her 8.06-acre property was heavily overgrown and difficult to navigate. We mulched 3.57 acres, opening up the land and giving it a fresh, usable look. She was thrilled with the results and knew it would help showcase the property's true potential.

## Phase Two: Going Further

A few months later, she reached back out ready to take things even further. Her goal was to transform more of the property so that potential buyers could easily see the possibilities—not just raw, untouched land.

While the scope of work was larger than her budget at first, we worked with her to create a **day rate solution** that allowed us to:

- Re-mulch the original area
- Handle new growth  
- Clear trash and debris
- Open the rest of the land up to a **6" DBH package**

## The Transformation Results

The transformation was dramatic. Now, when you drive onto the property, you can clearly see the full layout and possibilities of the land. The client was incredibly appreciative that we helped her refresh the original mulched area and connect the newly cleared spaces into one cohesive, open property.

**She now has the land listed for sale with open houses scheduled.**

## Why Forestry Mulching Adds Real Value

This project is a great example of how forestry mulching can be a cost-effective solution when preparing property for sale. By clearing underbrush and opening space—without removing dominant trees unnecessarily—buyers can see the land's true potential.

**Key Benefits for Property Sales:**
- **Immediate visual impact**: Buyers see usable space, not jungle
- **Preserves mature trees**: Maintains property character and value  
- **Cost-effective**: Less expensive than full land clearing
- **Quick turnaround**: Ready for showings in days, not weeks

Ready to prepare your property for sale? [Get your Fort McCoy area estimate](/estimate)`
  }
];

export default function TreeShopTribune() {
  const [selectedArticle, setSelectedArticle] = useState(TRIBUNE_ARTICLES[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
      {/* Tribune Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight border-b-4 border-green-600 pb-4">
          The TreeShop <span style={{ color: '#00FF41' }}>Tribune</span>
        </h1>
        <div className="text-lg text-gray-400 mb-2 italic">Florida's Premier Tree Industry Newspaper</div>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Real stories from the field. Industry insights you won't find anywhere else. 
          Written by the people who actually do the work.
        </p>
      </div>

      {/* Two Panel Layout */}
      <div className="grid lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Left Panel: Article List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-600 pl-4">
            Latest from the Field
          </h2>
          
          <div className="space-y-4">
            {TRIBUNE_ARTICLES.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedArticle.id === article.id
                    ? 'border-green-600 bg-gray-900 shadow-lg shadow-green-600/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                  <span className="px-2 py-1 treeai-green-button rounded text-xs font-medium">{article.category}</span>
                  <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
                  <span>{article.readingTime}</span>
                </div>
                
                <h3 className={`font-bold mb-2 leading-tight transition-colors ${
                  selectedArticle.id === article.id ? 'text-green-400' : 'text-white'
                }`} style={{ color: selectedArticle.id === article.id ? '#00FF41' : '#ffffff' }}>
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Article Content */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 sm:p-8 min-h-[600px]">
            {/* Article Header */}
            <div className="border-b border-gray-700 pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mb-4">
                <span className="px-3 py-1 treeai-green-button rounded font-medium">{selectedArticle.category}</span>
                <span>{format(new Date(selectedArticle.date), 'MMMM d, yyyy')}</span>
                <span>{selectedArticle.readingTime}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight" style={{ color: '#00FF41' }}>
                {selectedArticle.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>By {selectedArticle.author}</span>
                <div className="flex gap-2">
                  {selectedArticle.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-green-400">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg sm:text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="text-gray-300 mb-4 space-y-1 pl-6">{children}</ul>,
                  li: ({ children }) => <li className="list-disc text-gray-300">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-green-400 hover:text-green-300 underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {selectedArticle.content}
              </ReactMarkdown>
            </div>

            {/* Article Footer CTA */}
            <div className="border-t border-gray-700 pt-6 mt-8 text-center">
              <h3 className="text-lg font-bold text-white mb-3">Ready for Professional Forestry Mulching?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Get a professional estimate tailored to your property's specific needs.
              </p>
              <a 
                href="/estimate"
                className="treeai-green-button font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Get Free Estimate
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}