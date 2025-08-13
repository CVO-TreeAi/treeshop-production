'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type DBHPackage = 'small' | 'medium' | 'large' | 'xlarge' | 'clear';

type Props = {
  initialPackage?: DBHPackage;
  onPackageChange?: (pkg: DBHPackage) => void;
  className?: string;
  showPricing?: boolean;
  acreage?: number;
  mode?: 'top' | 'side';
  includeNoneStep?: boolean; // allow a far-left "no work" stage for education/demo
  startAtNone?: boolean; // if includeNoneStep, begin with no work
  allowClearStage?: boolean; // if false, cap at xlarge and never emit 'clear'
};

const DBH_PACKAGES: Record<DBHPackage, { 
  label: string; 
  dbh: string; 
  pricePerAcre: number;
  description: string;
  color: string;
}> = {
  small: {
    label: 'Small Package',
    dbh: '4" DBH & Under',
    pricePerAcre: 2150,
    description: 'Light clearing - keeps trees 4+ inches diameter',
    color: '#10b981', // green-500
  },
  medium: {
    label: 'Medium Package', 
    dbh: '6" DBH & Under',
    pricePerAcre: 2500,
    description: 'Moderate clearing - keeps trees 6+ inches diameter',
    color: '#f59e0b', // amber-500
  },
  large: {
    label: 'Large Package',
    dbh: '8" DBH & Under', 
    pricePerAcre: 3140,
    description: 'Heavy clearing - keeps trees 8+ inches diameter',
    color: '#ef4444', // red-500
  },
  xlarge: {
    label: 'Strip',
    dbh: '10" DBH & Under',
    pricePerAcre: Math.round(3140 * 1.326), // 32.6% higher than large
    description: 'Strip down to dominant trees — keeps trees 10+ inches diameter', 
    color: '#8b5cf6', // violet-500
  },
  clear: {
    label: 'Clear & Grub',
    dbh: 'All vegetation removed',
    pricePerAcre: 0,
    description: 'Complete clearing beyond X‑Large — ground ready for the next phase',
    color: '#22c55e',
  },
};

function packageFromSlider(value: number): DBHPackage {
  if (value <= 25) return 'small';
  if (value <= 50) return 'medium';
  if (value <= 75) return 'large';
  return value <= 90 ? 'xlarge' : 'clear';
}

function sliderFromPackage(pkg: DBHPackage): number {
  const packages = ['small', 'medium', 'large', 'xlarge'];
  const index = packages.indexOf(pkg);
  return (index / (packages.length - 1)) * 100;
}

export default function VegetationDensitySimulator({ 
  initialPackage = 'medium', 
  onPackageChange, 
  className, 
  showPricing = true,
  acreage = 0,
  mode = 'top',
  includeNoneStep = false,
  startAtNone = false,
  allowClearStage = true
}: Props) {
  const [sliderValue, setSliderValue] = useState<number>(includeNoneStep && startAtNone ? 0 : sliderFromPackage(initialPackage));
  const [selectedView, setSelectedView] = useState<'before' | DBHPackage>('before');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stage mapping with optional "none" step or explicit compare view
  const stage: 'none' | DBHPackage = useMemo(() => {
    if (selectedView === 'before') return 'none';
    if (selectedView) return selectedView;
    if (!includeNoneStep) return packageFromSlider(sliderValue);
    if (sliderValue <= 10) return 'none';
    if (sliderValue <= 30) return 'small';
    if (sliderValue <= 50) return 'medium';
    if (sliderValue <= 70) return 'large';
    if (sliderValue <= 90) return 'xlarge';
    return allowClearStage ? 'clear' : 'xlarge';
  }, [sliderValue, includeNoneStep, allowClearStage, selectedView]);

  const selectedPackage: DBHPackage = useMemo(() => {
    return stage === 'none' ? initialPackage : stage;
  }, [stage, initialPackage]);

  // Generate different sized trees for visualization
  const treePositions = useMemo(() => {
    const positions: Array<{ x: number; y: number; diameter: number; keep: boolean; species: 'oak'|'pine'|'palm'|'scrub' } > = [];
    const total = 90; // quarter-acre viewport composition

    // Base distribution (2–12") with more smalls than giants
    for (let i = 0; i < total; i += 1) {
      const r = Math.random();
      const diameter = r < 0.55 ? 2 + Math.random() * 4 // 2–6"
                      : r < 0.85 ? 6 + Math.random() * 2 // 6–8"
                      : r < 0.95 ? 8 + Math.random() * 2 // 8–10"
                      : 10 + Math.random() * 4;         // 10–14" giants
      const speciesRoll = Math.random();
      const species: 'oak'|'pine'|'palm'|'scrub' = speciesRoll < 0.45 ? 'oak' : speciesRoll < 0.7 ? 'pine' : speciesRoll < 0.85 ? 'palm' : 'scrub';
      positions.push({
        x: Math.random(),
        y: Math.random(),
        diameter,
        keep: false,
        species,
      });
    }
    // Ensure at least 2 giants > 10"
    const giants = positions.filter(p => p.diameter > 10);
    while (giants.length < 2) {
      positions.push({ x: Math.random(), y: Math.random(), diameter: 11 + Math.random() * 3, keep: false, species: 'oak' });
      giants.push({} as any);
    }
    return positions;
  }, []);

  // Generate underbrush (palmettos/brush up to ~5 ft that blocks view)
  const underbrushPositions = useMemo(() => {
    const clusters: Array<{ x: number; width: number; height: number; diameter: number }> = [];
    const total = 160; // heavier ground vegetation
    for (let i = 0; i < total; i += 1) {
      clusters.push({
        x: Math.random(),
        width: 14 + Math.random() * 24, // visual width in px (scaled later)
        height: 12 + Math.random() * 28, // 1–5 ft look
        diameter: 1 + Math.random() * 2.2, // 1–3.2" stems
      });
    }
    return clusters;
  }, []);

  // Determine which trees to keep/clear based on selected package
  const treesToShow = useMemo(() => {
    const packageInfo = DBH_PACKAGES[selectedPackage];
    const dbhLimit = parseInt(packageInfo.dbh.split('"')[0]);
    
    return treePositions.map(tree => ({
      ...tree,
      keep: tree.diameter > dbhLimit,
      willClear: tree.diameter <= dbhLimit
    }));
  }, [treePositions, selectedPackage]);

  useEffect(() => {
    if (stage !== 'none' && stage !== 'clear') onPackageChange?.(selectedPackage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage, stage]);

  // Calculate total cost
  const totalCost = useMemo(() => {
    if (!acreage || acreage <= 0) return 0;
    return Math.round(acreage * DBH_PACKAGES[selectedPackage].pricePerAcre);
  }, [acreage, selectedPackage]);

  // Build SVG scene (eye-level side view only)
  const svgScene = (() => {
    const width = 800;
    const height = 260;
    const groundBand = Math.max(18, Math.round(height * 0.10));
    const groundY = height - groundBand;
    const packageInfo = DBH_PACKAGES[selectedPackage];
    const showLegend = true;

    // Underbrush scaling by stage
    // 4" removes 95% ground cover; 6" removes the rest
    const ubScale = stage === 'none' ? 1 : stage === 'small' ? 0.05 : 0;

    // Layer thresholds by stage (diameter in inches)
    // none: show all; small: keep >4; medium: keep >6; large: keep >8; xlarge: keep >10; clear: keep none
    const keepThreshold = stage === 'none' ? 0 : stage === 'small' ? 4 : stage === 'medium' ? 6 : stage === 'large' ? 8 : stage === 'xlarge' ? 10 : Infinity;
    let filteredTrees = treesToShow
      .filter((t) => t.diameter > keepThreshold)
      .sort((a, b) => a.diameter - b.diameter);

    // Thin remaining layers by 35% each jump to mirror visible green loss (drone-style)
    const stepIndex = stage === 'none' ? 0 : stage === 'small' ? 1 : stage === 'medium' ? 2 : stage === 'large' ? 3 : stage === 'xlarge' ? 4 : 5;
    const retention = Math.pow(0.65, Math.max(0, stepIndex - 1)); // start thinning after small
    if (stepIndex > 1) {
      filteredTrees = filteredTrees.filter(() => Math.random() < retention);
    }

    // After X-Large, keep only 1–2 giants > 10"
    if (stage === 'xlarge') {
      const giants = filteredTrees.filter(t => t.diameter > 10);
      filteredTrees = giants.slice(0, Math.max(1, Math.min(2, giants.length)));
    }

    // Visual size scale per stage (35% increments from Medium)
    const scale = stage === 'none' ? 1 : stage === 'small' ? 1 : stage === 'medium' ? 1.35 : stage === 'large' ? 1.35 ** 2 : stage === 'xlarge' ? 1.35 ** 3 : 1;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 block">
        {/* Sky */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1a12" />
            <stop offset="100%" stopColor="#0a140e" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#sky)" />
        {/* Ground band (flat) */}
        <rect x="0" y={groundY} width={width} height={groundBand} fill="url(#ground)" />

        {/* Trees */}
        {filteredTrees.map((tree, i) => {
          const x = Math.round(tree.x * width);
          const trunkHeight = Math.max(22, tree.diameter * 9 * scale);
          const trunkTopY = groundY - trunkHeight;
          const canopyRx = Math.max(12, tree.diameter * 3.2 * scale);
          const canopyRy = Math.max(8, tree.diameter * 2.4 * scale);
          const canopyColor = tree.species === 'pine' ? '#34d399' : tree.species === 'palm' ? '#10b981' : '#059669';
          return (
            <g key={`tree-${i}`}>
              <line x1={x} y1={groundY} x2={x} y2={trunkTopY} stroke="#8b5a2b" strokeWidth={Math.max(2, tree.diameter * 0.55)} />
              {tree.species === 'palm' ? (
                <g>
                  {Array.from({ length: 6 }).map((_, fi) => {
                    const ang = (fi / 6) * Math.PI;
                    const x2 = x + Math.cos(ang) * canopyRx;
                    const y2 = trunkTopY - Math.sin(ang) * canopyRy;
                    return <line key={`fan-${fi}`} x1={x} y1={trunkTopY} x2={x2} y2={y2} stroke="#10b981" strokeWidth={2} />;
                  })}
                  <circle cx={x} cy={trunkTopY} r={4} fill={canopyColor} />
                </g>
              ) : (
                <ellipse cx={x} cy={trunkTopY - canopyRy * 0.4} rx={canopyRx} ry={canopyRy} fill={canopyColor} />
              )}
            </g>
          );
        })}

        {/* Underbrush drawn last so it sits in front (closest to viewer) */}
        {ubScale > 0 && underbrushPositions.map((ub, i) => {
          if (Math.random() > ubScale) return null;
          const x = Math.round(ub.x * width);
          const w = ub.width;
          const h = ub.height;
          return (
            <g key={`ub-${i}`}>
              <ellipse cx={x} cy={groundY - h * 0.35} rx={w * 0.6} ry={h * 0.6} fill="#0f5132" />
              {Array.from({ length: 6 + Math.floor(Math.random() * 5) }).map((_, bi) => {
                const angle = (bi / 6) * Math.PI;
                const len = h * (0.4 + Math.random() * 0.3);
                const x2 = x + Math.cos(angle) * len;
                const y2 = groundY - h * 0.3 - Math.sin(angle) * len;
                return <line key={`blade-${bi}`} x1={x} y1={groundY - h * 0.3} x2={x2} y2={y2} stroke="#16a34a" strokeWidth={2} />;
              })}
            </g>
          );
        })}

        {/* Legend overlay */}
        {showLegend && (
          <g>
            <rect x={10} y={10} width={300} height={54} fill="rgba(0,0,0,0.6)" />
            <text x={18} y={28} fontSize={12} fill="#ffffff" fontFamily="ui-sans-serif, system-ui">
              {stage === 'none' ? 'No clearing (demo start)' : stage === 'clear' ? 'Clear & Grub' : packageInfo.label}
            </text>
            <text x={18} y={44} fontSize={12} fill="#ffffff" fontFamily="ui-sans-serif, system-ui">
              {stage === 'none' ? 'Slide right to see clearing levels' : stage === 'clear' ? 'All vegetation removed' : `Clears up to ${packageInfo.dbh}`}
            </text>
          </g>
        )}
      </svg>
    );
  })();

  const packageInfo = DBH_PACKAGES[selectedPackage];
  const packageClasses = useMemo(() => {
    switch (selectedPackage) {
      case 'small':
        return { accent: 'accent-green-500', text: 'text-green-500' };
      case 'medium':
        return { accent: 'accent-amber-500', text: 'text-amber-500' };
      case 'large':
        return { accent: 'accent-red-500', text: 'text-red-500' };
      case 'xlarge':
      default:
        return { accent: 'accent-violet-500', text: 'text-violet-500' };
    }
  }, [selectedPackage]);
  
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">DBH Package Selector</h4>
        <span className="text-xs text-gray-400">Tap to compare layers</span>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={`px-3 py-1.5 rounded border text-sm ${selectedView==='before' ? 'border-green-600 bg-green-600/10 text-green-400' : 'border-gray-700 text-gray-300 hover:border-green-600'}`}
              onClick={() => setSelectedView('before')}
            >Before</button>
            {(['small','medium','large','xlarge'] as DBHPackage[]).map(p => (
              <button
                key={p}
                type="button"
                className={`px-3 py-1.5 rounded border text-sm ${selectedView===p ? 'border-green-600 bg-green-600/10 text-green-400' : 'border-gray-700 text-gray-300 hover:border-green-600'}`}
                onClick={() => setSelectedView(p)}
              >{DBH_PACKAGES[p].label.replace(' Package','')}</button>
            ))}
          </div>

          <div className="bg-black/30 rounded p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-white">{selectedView==='before' ? 'Before' : packageInfo.label}</h5>
              {selectedView!=='before' && (
                <span className={["text-sm font-mono", packageClasses.text].join(' ')}>
                  {packageInfo.dbh}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 mb-3">
              {selectedView==='before' ? 'Baseline reference (blank scene).' : packageInfo.description}
            </p>
            
            {showPricing && (
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-green-400">
                  ${packageInfo.pricePerAcre.toLocaleString()}/acre
                </div>
                {totalCost > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{acreage} acres</div>
                    <div className="text-lg font-bold text-white">
                      ${totalCost.toLocaleString()} total
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          {svgScene}
        </div>
        
        <div className="p-3 bg-gray-800/50 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Trees kept (larger than {packageInfo.dbh.split(' ')[0]})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Vegetation cleared</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-2">
        Choose your clearing level based on what size trees you want to preserve. 
        All vegetation under the selected diameter will be mulched.
      </p>
    </div>
  );
}


