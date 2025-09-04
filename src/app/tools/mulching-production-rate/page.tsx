import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plug-n-Play Production Calculator | TreeShop Tools',
  description: 'Advanced forestry mulching production rate calculator powered by TreeAI business intelligence.',
  robots: 'noindex, nofollow', // Keep this hidden from search engines
};

export default function MulchingProductionRatePage() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        
        :root {
            --primary-red: #C8102E;
            --primary-black: #1A1A1A;
            --primary-white: #FFFFFF;
            --tech-green: #00A651;
            --light-gray: #F8F9FA;
            --medium-gray: #E9ECEF;
            --dark-gray: #343A40;
            --accent-blue: #0066CC;
            --shadow-light: 0 2px 8px rgba(0,0,0,0.08);
            --shadow-medium: 0 4px 20px rgba(0,0,0,0.12);
            --shadow-heavy: 0 8px 32px rgba(0,0,0,0.16);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #121212;
            color: #FFFFFF;
            min-height: 100vh;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .calculator-section {
            background: #121212;
            padding: 40px 0 60px;
        }

        .panel {
            background: #1E1E1E;
            border-radius: 12px;
            padding: 35px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            border: 1px solid #2D2D2D;
        }

        .panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2D2D2D;
        }

        .panel-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0;
        }

        .panel-icon {
            width: 40px;
            height: 40px;
            background: var(--primary-red);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-white);
            font-size: 1.2rem;
        }

        .input-group {
            margin-bottom: 18px;
        }

        .input-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 18px;
        }

        .input-row-triple {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 18px;
        }

        @media (max-width: 768px) {
            .input-row, .input-row-triple {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #E0E0E0;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        select, input[type="number"] {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #2D2D2D;
            border-radius: 8px;
            background: #2A2A2A;
            color: #FFFFFF;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
        }

        select:focus, input:focus {
            outline: none;
            border-color: var(--primary-red);
            box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.1);
            transform: translateY(-1px);
        }

        select:hover, input:hover {
            border-color: #E0E0E0;
        }

        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 35px;
        }

        .result-card {
            background: #1E1E1E;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            border-left: 4px solid var(--primary-red);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }

        .result-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
        }

        .result-card.fusion {
            border-left-color: var(--tech-green);
            background: linear-gradient(135deg, #0f2f0f, #1E1E1E);
            border: 1px solid rgba(0, 166, 81, 0.3);
        }

        .result-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: #E0E0E0;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .result-value {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--primary-red);
            margin-bottom: 15px;
        }

        .result-card.fusion .result-value {
            color: var(--tech-green);
        }

        .result-details {
            font-size: 0.9rem;
            color: #E0E0E0;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #2D2D2D;
        }

        .savings-highlight {
            background: linear-gradient(135deg, var(--tech-green), #38A169);
            color: var(--primary-white);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin-top: 25px;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .savings-highlight::before {
            content: '💰';
            display: block;
            font-size: 2rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <!-- Calculator Section -->
    <div class="calculator-section" style="padding: 20px 0 60px;">
        <div class="container">
            <div style="max-width: 800px; margin: 0 auto;">
                <div class="panel" style="margin-bottom: 30px;">
                    <div class="panel-header">
                        <h2 class="panel-title">Forestry Mulching Calculator</h2>
                        <div class="panel-icon">🌲</div>
                    </div>
                
                <!-- Machine Selector Cheat Sheet -->
                <div class="input-group" style="margin-bottom: 25px;">
                    <label for="machineSelector">Quick Machine Selector (Auto-fills GPM)</label>
                    <select id="machineSelector" style="background: #2A2A2A; color: #FFFFFF; border: 2px solid #2D2D2D;">
                        <option value="">Select Machine (or enter GPM manually below)</option>
                        <optgroup label="CATERPILLAR TRACK LOADERS">
                            <option value="30">CAT 265 - 30 GPM High Flow</option>
                            <option value="34">CAT 265 - 34 GPM Max High Flow</option>
                            <option value="40">CAT 285 XE - 40 GPM High Flow XE</option>
                        </optgroup>
                        <optgroup label="BOBCAT TRACK LOADERS">
                            <option value="24">Bobcat T770 - 24 GPM Standard</option>
                            <option value="37">Bobcat T770 - 37 GPM High Flow</option>
                            <option value="24">Bobcat T870 - 24 GPM Standard</option>
                            <option value="42">Bobcat T870 - 42 GPM High Flow</option>
                        </optgroup>
                        <optgroup label="JOHN DEERE TRACK LOADERS">
                            <option value="41">John Deere 333G - 41.1 GPM</option>
                        </optgroup>
                        <optgroup label="KUBOTA TRACK LOADERS">
                            <option value="30">Kubota SVL95-2s - 30 GPM</option>
                        </optgroup>
                        <optgroup label="FECON CARRIERS">
                            <option value="60">Fecon FTX150-2 - 60 GPM</option>
                            <option value="80">Fecon FTX200 - 80 GPM</option>
                            <option value="115">Fecon FTX300 - 115 GPM</option>
                            <option value="50">Fecon 135VRT - 50 GPM</option>
                            <option value="80">Fecon 225VST - 80 GPM</option>
                            <option value="115">Fecon 325VST - 115 GPM</option>
                        </optgroup>
                    </select>
                </div>

                <div class="input-row-triple">
                    <div class="input-group">
                        <label for="machineGpm">Machine GPM (High Flow)</label>
                        <input type="number" id="machineGpm" min="20" max="120" value="30" step="1">
                    </div>
                    <div class="input-group">
                        <label for="projectSize">Project Size (Acres)</label>
                        <input type="number" id="projectSize" min="0.1" max="100" value="1" step="0.1">
                    </div>
                    <div class="input-group">
                        <label for="maxDbh">Max DBH (inches)</label>
                        <input type="number" id="maxDbh" min="1" max="30" value="6" step="0.5">
                    </div>
                </div>

                <div class="input-row">
                    <div class="input-group">
                        <label for="hourlyRate">Hourly Billing Rate ($)</label>
                        <input type="number" id="hourlyRate" min="100" max="1000" value="500" step="25">
                    </div>
                    <div class="input-group">
                        <label for="hourlyOperatingCost">Operating Cost ($)</label>
                        <input type="number" id="hourlyOperatingCost" min="50" max="500" value="175" step="25">
                    </div>
                </div>

                </div>

                <!-- Results Section -->
                <div class="panel">
                    <div class="panel-header">
                        <h2 class="panel-title">Production Results</h2>
                        <div class="panel-icon">📊</div>
                    </div>
                
                    <div class="results-grid" id="packageResults">
                        <div class="result-card">Loading Standard Mulcher...</div>
                        <div class="result-card fusion">Loading Plug-n-Play Technology...</div>
                    </div>

                    <div id="savingsHighlight" class="savings-highlight">
                        🎉 Plug-n-Play ROI: Loading...
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ROI Analysis Section -->
    <div style="background: #1A1A1A; padding: 60px 0; border-top: 1px solid #2D2D2D;">
        <div class="container">
            <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-red); margin-bottom: 20px;">
                    Plug-n-Play Investment Analysis
                </h2>
                <p style="font-size: 1.2rem; color: #B0B0B0; margin-bottom: 50px;">
                    The numbers don't lie. Plug-n-Play technology delivers the fastest ROI in the forestry industry.
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 50px;">
                    
                    <!-- Investment Cost -->
                    <div style="background: #1E1E1E; padding: 30px; border-radius: 12px; border-left: 4px solid var(--primary-red);">
                        <div style="font-size: 3rem; font-weight: 800; color: var(--primary-red); margin-bottom: 10px;">$4,100</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: #E0E0E0; margin-bottom: 10px;">Plug-n-Play Upgrade Cost</div>
                        <div style="font-size: 0.9rem; color: #B0B0B0;">One-time investment for lifetime productivity gains</div>
                    </div>
                    
                    <!-- Break-Even -->
                    <div style="background: #1E1E1E; padding: 30px; border-radius: 12px; border-left: 4px solid var(--tech-green);">
                        <div style="font-size: 3rem; font-weight: 800; color: var(--tech-green); margin-bottom: 10px;" id="breakEvenAcres">14</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: #E0E0E0; margin-bottom: 10px;">Acres to Break Even</div>
                        <div style="font-size: 0.9rem; color: #B0B0B0;">Typically achieved in first month of operation</div>
                    </div>
                    
                    <!-- Annual Profit -->
                    <div style="background: #1E1E1E; padding: 30px; border-radius: 12px; border-left: 4px solid var(--tech-green);">
                        <div style="font-size: 3rem; font-weight: 800; color: var(--tech-green); margin-bottom: 10px;" id="annualProfit">$55,800</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: #E0E0E0; margin-bottom: 10px;">Extra Profit/Year</div>
                        <div style="font-size: 0.9rem; color: #B0B0B0;">Based on 200 acres annually</div>
                    </div>
                    
                </div>
                
                <!-- ROI Timeline -->
                <div style="background: linear-gradient(135deg, var(--tech-green), #38A169); padding: 40px; border-radius: 15px; color: white;">
                    <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 25px;">5-Year ROI Timeline</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
                        
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">Month 1</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">Break Even</div>
                        </div>
                        
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">Year 1</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;" id="year1Profit">+$55,800</div>
                        </div>
                        
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;">Year 5</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;" id="year5Profit">+$279,000</div>
                        </div>
                        
                        <div>
                            <div style="font-size: 1.5rem; font-weight: 700;" id="totalROI">6,700%</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">Total ROI</div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <!-- Professional Footer -->
    <footer style="background: var(--primary-black); color: var(--primary-white); padding: 40px 0; text-align: center; margin-top: 60px;">
        <div class="container">
            <div style="margin-bottom: 20px;">
                <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 15px;">Powered by TreeAI Business Intelligence</p>
            </div>
            
            <div style="border-top: 1px solid #2D2D2D; padding-top: 20px; font-size: 0.85rem; opacity: 0.7;">
                © 2025 TreeShop Operations. TreeAI™ powered calculator technology.<br>
                Sample calculator for demonstration purposes.
            </div>
        </div>
    </footer>

    <script>
        let fusionActive = false;

        function calculateProductionRate(gpm, fusionBonus = false) {
            let baseRate = (gpm / 30) * 1.0; // Base formula: GPM/30 * 1.0 I-A/h
            if (fusionBonus) {
                baseRate *= 1.4; // 40% Fusion bonus
            }
            console.log('Production Rate:', baseRate, 'GPM:', gpm, 'Fusion:', fusionBonus);
            return baseRate;
        }

        function updateResults() {
            console.log('UpdateResults called');
            const machineGpm = parseFloat(document.getElementById('machineGpm').value);
            const projectSize = parseFloat(document.getElementById('projectSize').value);
            const maxDbh = parseFloat(document.getElementById('maxDbh').value);
            const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
            const hourlyOperatingCost = parseFloat(document.getElementById('hourlyOperatingCost').value);
            
            console.log('Input values:', { machineGpm, projectSize, maxDbh, hourlyRate, hourlyOperatingCost });
            
            const tuningProductionRate = calculateProductionRate(machineGpm, false);
            const fusionProductionRate = calculateProductionRate(machineGpm, true);
            const resultsGrid = document.getElementById('packageResults');
            
            console.log('Results grid element:', resultsGrid);
            
            // Direct I-A/h calculation: Time = (DBH × Acres) ÷ Production Rate
            const inchAcres = maxDbh * projectSize;
            const tuningTime = inchAcres / tuningProductionRate;
            const fusionTime = inchAcres / fusionProductionRate;
            
            // Revenue calculated based on tuning time (what you quote)
            const quotedRevenue = tuningTime * hourlyRate;
            
            // But with Fusion, you finish faster while keeping same revenue
            
            // Operating costs change based on actual time worked
            const tuningOperatingCosts = tuningTime * hourlyOperatingCost;
            const tuningProfit = quotedRevenue - tuningOperatingCosts;
            
            const fusionOperatingCosts = fusionTime * hourlyOperatingCost;
            const fusionProfit = quotedRevenue - fusionOperatingCosts;
            
            let resultsHTML = '';
            
            // Standard Results Card
            resultsHTML += \`
                <div class="result-card">
                    <div class="result-title">Standard Mulcher</div>
                    <div class="result-value">\${tuningTime.toFixed(1)}h</div>
                    <div class="result-details">
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> \${Math.ceil(tuningTime / 6).toFixed(0)} days</div>
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $\${quotedRevenue.toFixed(0)}</div>
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $\${tuningOperatingCosts.toFixed(0)}</div>
                        <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $\${tuningProfit.toFixed(0)}</div>
                    </div>
                </div>
            \`;
            
            // Plug-n-Play Results Card (always show)
            const timeReduction = ((tuningTime - fusionTime) / tuningTime * 100);
            const costSavings = tuningOperatingCosts - fusionOperatingCosts;
            const profitIncrease = fusionProfit - tuningProfit;
            
            resultsHTML += \`
                <div class="result-card fusion">
                    <div class="result-title">Plug-n-Play Technology</div>
                    <div class="result-value">\${fusionTime.toFixed(1)}h</div>
                    <div class="result-details">
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> \${Math.ceil(fusionTime / 6).toFixed(0)} days</div>
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $\${quotedRevenue.toFixed(0)}</div>
                        <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $\${fusionOperatingCosts.toFixed(0)}</div>
                        <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $\${fusionProfit.toFixed(0)}</div>
                        <div style="font-size: 0.85rem; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,166,81,0.3); color: var(--tech-green);">
                            ⚡ \${timeReduction.toFixed(1)}% faster<br>
                            💰 $\${costSavings.toFixed(0)} additional profit
                        </div>
                    </div>
                </div>
            \`;
            
            // Add technology disclaimer
            resultsHTML += \`
                <div style="grid-column: 1 / -1; text-align: center; margin-top: 15px; padding: 12px; background: #2A2A2A; border-radius: 8px; font-size: 0.85rem; color: #B0B0B0;">
                    *Performance comparison based on advanced mulching technology vs standard equipment
                </div>
            \`;
            
            console.log('Results HTML:', resultsHTML);
            resultsGrid.innerHTML = resultsHTML;
            
            // Show summary savings
            const savingsHighlight = document.getElementById('savingsHighlight');
            const totalTimeSavings = tuningTime - fusionTime;
            const totalCostSavings = tuningOperatingCosts - fusionOperatingCosts;
            const totalProfitIncrease = fusionProfit - tuningProfit;
            const profitPerAcre = totalCostSavings / projectSize;
            savingsHighlight.innerHTML = \`
                🎉 Plug-n-Play ROI: Same revenue, \${totalTimeSavings.toFixed(1)} hours less work!<br>
                💰 $\${totalCostSavings.toFixed(0)} additional profit ($\${profitPerAcre.toFixed(0)}/acre)
            \`;
            savingsHighlight.style.display = 'block';
            console.log('UpdateResults completed');
        }

        // Machine selector auto-fill functionality
        function handleMachineSelection() {
            const selector = document.getElementById('machineSelector');
            const gpmInput = document.getElementById('machineGpm');
            
            if (selector.value) {
                gpmInput.value = selector.value;
                updateResults();
            }
        }

        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM ready, setting up event listeners');
            
            // Event listeners
            document.getElementById('machineSelector').addEventListener('change', handleMachineSelection);
            document.getElementById('machineGpm').addEventListener('input', updateResults);
            document.getElementById('projectSize').addEventListener('input', updateResults);
            document.getElementById('maxDbh').addEventListener('input', updateResults);
            document.getElementById('hourlyRate').addEventListener('input', updateResults);
            document.getElementById('hourlyOperatingCost').addEventListener('input', updateResults);

            // Initial calculation
            console.log('Calling initial updateResults');
            updateResults();
        });
    </script>
</body>
</html>
      `
    }} />
  );
}