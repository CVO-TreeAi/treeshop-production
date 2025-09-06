'use client';

import { useEffect } from 'react';

export default function MulchingProductionRatePage() {
  useEffect(() => {
    // Calculator functions
    function calculateProductionRate(gpm: number, fusionBonus = false) {
      let baseRate = (gpm / 30) * 1.0;
      if (fusionBonus) {
        baseRate *= 1.4;
      }
      return baseRate;
    }

    function updateResults() {
      const gpmEl = document.getElementById('machineGpm') as HTMLInputElement;
      const sizeEl = document.getElementById('projectSize') as HTMLInputElement;
      const dbhEl = document.getElementById('maxDbh') as HTMLInputElement;
      const rateEl = document.getElementById('hourlyRate') as HTMLInputElement;
      const costEl = document.getElementById('hourlyOperatingCost') as HTMLInputElement;
      const resultsGrid = document.getElementById('packageResults');
      
      if (!gpmEl || !sizeEl || !dbhEl || !rateEl || !costEl || !resultsGrid) {
        setTimeout(updateResults, 100);
        return;
      }
      
      const machineGpm = parseFloat(gpmEl.value) || 30;
      const projectSize = parseFloat(sizeEl.value) || 1;
      const maxDbh = parseFloat(dbhEl.value) || 6;
      const hourlyRate = parseFloat(rateEl.value) || 500;
      const hourlyOperatingCost = parseFloat(costEl.value) || 175;
      
      const tuningProductionRate = calculateProductionRate(machineGpm, false);
      const fusionProductionRate = calculateProductionRate(machineGpm, true);
      
      const inchAcres = maxDbh * projectSize;
      const tuningTime = inchAcres / tuningProductionRate;
      const fusionTime = inchAcres / fusionProductionRate;
      
      const quotedRevenue = tuningTime * hourlyRate;
      const tuningOperatingCosts = tuningTime * hourlyOperatingCost;
      const tuningProfit = quotedRevenue - tuningOperatingCosts;
      const fusionOperatingCosts = fusionTime * hourlyOperatingCost;
      const fusionProfit = quotedRevenue - fusionOperatingCosts;
      
      const timeReduction = ((tuningTime - fusionTime) / tuningTime * 100);
      const costSavings = tuningOperatingCosts - fusionOperatingCosts;
      
      resultsGrid.innerHTML = `
        <div class="result-card">
          <div class="result-title">Standard Mulcher</div>
          <div class="result-value">${tuningTime.toFixed(1)}h</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> ${Math.ceil(tuningTime / 6).toFixed(0)} days</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $${quotedRevenue.toFixed(0)}</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${tuningOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $${tuningProfit.toFixed(0)}</div>
          </div>
        </div>
        <div class="result-card fusion">
          <div class="result-title">Plug-n-Play Technology</div>
          <div class="result-value">${fusionTime.toFixed(1)}h</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> ${Math.ceil(fusionTime / 6).toFixed(0)} days</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $${quotedRevenue.toFixed(0)}</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${fusionOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $${fusionProfit.toFixed(0)}</div>
            <div style="font-size: 0.85rem; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,166,81,0.3); color: var(--tech-green);">
              ⚡ ${timeReduction.toFixed(1)}% faster<br>
              💰 $${costSavings.toFixed(0)} additional profit
            </div>
          </div>
        </div>
      `;
      
    }

    function handleMachineSelection() {
      const selector = document.getElementById('machineSelector') as HTMLSelectElement;
      const gpmInput = document.getElementById('machineGpm') as HTMLInputElement;
      
      if (selector?.value && gpmInput) {
        gpmInput.value = selector.value;
        updateResults();
      }
    }

    // Initialize
    const initTimer = setInterval(() => {
      const elements = ['machineSelector', 'machineGpm', 'projectSize', 'maxDbh', 'hourlyRate', 'hourlyOperatingCost'];
      const allReady = elements.every(id => document.getElementById(id));
      
      if (allReady) {
        clearInterval(initTimer);
        
        document.getElementById('machineSelector')?.addEventListener('change', handleMachineSelection);
        document.getElementById('machineGpm')?.addEventListener('input', updateResults);
        document.getElementById('projectSize')?.addEventListener('input', updateResults);
        document.getElementById('maxDbh')?.addEventListener('input', updateResults);
        document.getElementById('hourlyRate')?.addEventListener('input', updateResults);
        document.getElementById('hourlyOperatingCost')?.addEventListener('input', updateResults);
        
        updateResults();
      }
    }, 100);
    
    return () => clearInterval(initTimer);
  }, []);

  return (
    <div style={{ 
      background: '#121212',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#FFFFFF',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>
      <style jsx global>{`
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
      `}</style>

      {/* Calculator Section */}
      <div className="calculator-section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="panel" style={{ marginBottom: '30px' }}>
              <div className="panel-header">
                <h2 className="panel-title">Forestry Mulching Calculator</h2>
                <div className="panel-icon">🌲</div>
              </div>
            
              {/* Machine Selector */}
              <div className="input-group" style={{ marginBottom: '25px' }}>
                <label htmlFor="machineSelector">Quick Machine Selector (Auto-fills GPM)</label>
                <select id="machineSelector" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
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

              <div className="input-row-triple">
                <div className="input-group">
                  <label htmlFor="machineGpm">Machine GPM (High Flow)</label>
                  <input type="number" id="machineGpm" min="20" max="120" defaultValue="30" step="1" />
                </div>
                <div className="input-group">
                  <label htmlFor="projectSize">Project Size (Acres)</label>
                  <input type="number" id="projectSize" min="0.1" max="100" defaultValue="1" step="0.1" />
                </div>
                <div className="input-group">
                  <label htmlFor="maxDbh">Max DBH (inches)</label>
                  <input type="number" id="maxDbh" min="1" max="30" defaultValue="6" step="0.5" />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="hourlyRate">Hourly Billing Rate ($)</label>
                  <input type="number" id="hourlyRate" min="100" max="1000" defaultValue="500" step="25" />
                </div>
                <div className="input-group">
                  <label htmlFor="hourlyOperatingCost">Operating Cost ($)</label>
                  <input type="number" id="hourlyOperatingCost" min="50" max="500" defaultValue="175" step="25" />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Production Results</h2>
                <div className="panel-icon">📊</div>
              </div>
            
              <div className="results-grid" id="packageResults">
                <div className="result-card">Loading Standard Mulcher...</div>
                <div className="result-card fusion">Loading Plug-n-Play Technology...</div>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* Professional Footer */}
      <footer style={{ background: 'var(--primary-black)', color: 'var(--primary-white)', padding: '40px 0', textAlign: 'center', marginTop: '60px' }}>
        <div className="container">
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.9rem', opacity: '0.8', marginBottom: '15px' }}>Powered by TreeAI Business Intelligence</p>
          </div>
          
          <div style={{ borderTop: '1px solid #2D2D2D', paddingTop: '20px', fontSize: '0.85rem', opacity: '0.7' }}>
            © 2025 TreeShop Operations. TreeAI™ powered calculator technology.<br />
            Sample calculator for demonstration purposes.
          </div>
        </div>
      </footer>
    </div>
  );
}