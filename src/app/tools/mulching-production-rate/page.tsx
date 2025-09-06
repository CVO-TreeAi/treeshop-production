'use client';

import { useEffect } from 'react';

export default function MulchingProductionRatePage() {
  useEffect(() => {
    let currentMode = 'single'; // 'single', 'compare', or 'max'

    // Calculator functions
    function calculateProductionRate(gpm: number, fusionBonus = false) {
      let baseRate = (gpm / 30) * 1.0;
      if (fusionBonus) {
        baseRate *= 1.4;
      }
      return baseRate;
    }

    function calculateMachineResults(machineGpm: number, projectSize: number, maxDbh: number, hourlyRate: number, hourlyOperatingCost: number) {
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
      
      return {
        tuningTime,
        fusionTime,
        quotedRevenue,
        tuningOperatingCosts,
        tuningProfit,
        fusionOperatingCosts,
        fusionProfit,
        timeReduction,
        costSavings
      };
    }

    function updateResults() {
      if (currentMode === 'single') {
        updateSingleResults();
      } else if (currentMode === 'compare') {
        updateCompareResults();
      } else {
        updateMaxResults();
      }
    }

    function updateSingleResults() {
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
      
      const results = calculateMachineResults(machineGpm, projectSize, maxDbh, hourlyRate, hourlyOperatingCost);
      
      resultsGrid.innerHTML = `
        <div class="result-card">
          <div class="result-title">Standard Mulcher</div>
          <div class="result-value">${results.tuningTime.toFixed(1)}h</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> ${Math.ceil(results.tuningTime / 6).toFixed(0)} days</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $${results.quotedRevenue.toFixed(0)}</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${results.tuningOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $${results.tuningProfit.toFixed(0)}</div>
          </div>
        </div>
        <div class="result-card fusion">
          <div class="result-title">Plug-n-Play Technology</div>
          <div class="result-value">${results.fusionTime.toFixed(1)}h</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Days Needed:</strong> ${Math.ceil(results.fusionTime / 6).toFixed(0)} days</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $${results.quotedRevenue.toFixed(0)}</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${results.fusionOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Profit:</strong> $${results.fusionProfit.toFixed(0)}</div>
            <div style="font-size: 0.85rem; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,166,81,0.3); color: var(--tech-green);">
              ⚡ ${results.timeReduction.toFixed(1)}% faster<br>
              💰 $${results.costSavings.toFixed(0)} additional profit
            </div>
          </div>
        </div>
      `;
    }

    function updateCompareResults() {
      const machine1Sel = document.getElementById('compareMachine1') as HTMLSelectElement;
      const machine2Sel = document.getElementById('compareMachine2') as HTMLSelectElement;
      const machine3Sel = document.getElementById('compareMachine3') as HTMLSelectElement;
      const mode1 = (document.getElementById('compareMode1') as HTMLSelectElement)?.value || 'fusion';
      const mode2 = (document.getElementById('compareMode2') as HTMLSelectElement)?.value || 'fusion';
      const mode3 = (document.getElementById('compareMode3') as HTMLSelectElement)?.value || 'fusion';
      const sizeEl = document.getElementById('projectSizeCompare') as HTMLInputElement;
      const dbhEl = document.getElementById('maxDbhCompare') as HTMLInputElement;
      const rateEl = document.getElementById('hourlyRateCompare') as HTMLInputElement;
      const costEl = document.getElementById('hourlyOperatingCostCompare') as HTMLInputElement;
      const resultsGrid = document.getElementById('packageResults');
      
      if (!machine1Sel || !sizeEl || !dbhEl || !rateEl || !costEl || !resultsGrid) {
        setTimeout(updateResults, 100);
        return;
      }
      
      const projectSize = parseFloat(sizeEl.value) || 1;
      const maxDbh = parseFloat(dbhEl.value) || 6;
      const hourlyRate = parseFloat(rateEl.value) || 500;
      const hourlyOperatingCost = parseFloat(costEl.value) || 175;
      
      const machines = [
        { selector: machine1Sel, mode: mode1, name: 'Machine 1', color: 'var(--primary-red)' },
        { selector: machine2Sel, mode: mode2, name: 'Machine 2', color: 'var(--tech-green)' },
        { selector: machine3Sel, mode: mode3, name: 'Machine 3', color: 'var(--accent-blue)' }
      ].filter(machine => machine.selector?.value);
      
      if (machines.length === 0) {
        resultsGrid.innerHTML = '<div class="result-card">Select machines to compare...</div>';
        return;
      }
      
      // Calculate results for all machines
      const machineResults = machines.map(machine => {
        const gpm = parseFloat(machine.selector.value);
        const machineName = machine.selector.options[machine.selector.selectedIndex].text;
        const isPlugAndPlay = machine.mode === 'fusion';
        
        const tuningProductionRate = calculateProductionRate(gpm, false);
        const fusionProductionRate = calculateProductionRate(gpm, true);
        const productionRate = isPlugAndPlay ? fusionProductionRate : tuningProductionRate;
        
        const inchAcres = maxDbh * projectSize;
        const time = inchAcres / productionRate;
        const operatingCosts = time * hourlyOperatingCost;
        
        return {
          ...machine,
          gpm,
          machineName: machineName + (isPlugAndPlay ? ' (Plug-n-Play)' : ' (Standard)'),
          time,
          operatingCosts,
          isPlugAndPlay
        };
      });
      
      // Find the longest time (slowest machine) to set baseline revenue
      const maxTime = Math.max(...machineResults.map(m => m.time));
      const baselineRevenue = maxTime * hourlyRate;
      
      // Calculate final results with baseline revenue
      const finalResults = machineResults.map(machine => ({
        ...machine,
        revenue: baselineRevenue,
        profit: baselineRevenue - machine.operatingCosts
      }));
      
      // Sort by profit (highest first) for better display
      finalResults.sort((a, b) => b.profit - a.profit);
      
      let resultsHTML = '';
      
      // Add comparison header
      resultsHTML += `
        <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 20px; padding: 15px; background: #2A2A2A; border-radius: 8px;">
          <div style="color: #E0E0E0; font-size: 0.9rem; margin-bottom: 5px;">Baseline Revenue (Slowest Machine)</div>
          <div style="color: var(--tech-green); font-size: 1.2rem; font-weight: 700;">$${baselineRevenue.toFixed(0)}</div>
        </div>
      `;
      
      finalResults.forEach((machine, index) => {
        const timeDiff = index > 0 ? finalResults[0].time - machine.time : 0;
        const profitDiff = index > 0 ? machine.profit - finalResults[0].profit : 0;
        const isFirst = index === 0;
        
        resultsHTML += `
          <div class="result-card" style="border-left-color: ${machine.color}; ${isFirst ? 'border: 2px solid var(--tech-green);' : ''}">
            ${isFirst ? '<div style="position: absolute; top: -10px; right: 10px; background: var(--tech-green); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">BEST</div>' : ''}
            <div style="position: relative;">
              <div class="result-title">${machine.machineName}</div>
              <div class="result-value" style="color: ${machine.color};">${machine.time.toFixed(1)}h</div>
              <div class="result-details">
                <div style="margin-bottom: 8px; color: #E0E0E0;">
                  <strong>Days:</strong> ${Math.ceil(machine.time / 6)} | 
                  <strong>GPM:</strong> ${machine.gpm} | 
                  <strong>Mode:</strong> ${machine.isPlugAndPlay ? 'PnP' : 'Std'}
                </div>
                <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Revenue:</strong> $${machine.revenue.toFixed(0)}</div>
                <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${machine.operatingCosts.toFixed(0)}</div>
                <div style="color: ${machine.color}; font-weight: 600;"><strong>Profit:</strong> $${machine.profit.toFixed(0)}</div>
                ${!isFirst ? `
                  <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #2D2D2D; font-size: 0.85rem;">
                    <div style="color: ${timeDiff > 0 ? 'var(--tech-green)' : 'var(--primary-red)'};">
                      <strong>vs Best:</strong> ${timeDiff > 0 ? '+' : ''}${timeDiff.toFixed(1)}h ${timeDiff > 0 ? 'slower' : 'faster'}
                    </div>
                    <div style="color: ${profitDiff > 0 ? 'var(--tech-green)' : 'var(--primary-red)'};">
                      <strong>Profit:</strong> ${profitDiff > 0 ? '+' : ''}$${Math.abs(profitDiff).toFixed(0)} ${profitDiff > 0 ? 'more' : 'less'}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      });
      
      resultsGrid.innerHTML = resultsHTML;
    }

    function updateMaxResults() {
      const machineEl = document.getElementById('maxMachine') as HTMLSelectElement;
      const modeEl = document.getElementById('maxMode') as HTMLSelectElement;
      const daysEl = document.getElementById('availableDays') as HTMLInputElement;
      const hoursPerDayEl = document.getElementById('hoursPerDay') as HTMLInputElement;
      const dbhEl = document.getElementById('maxDbhMax') as HTMLInputElement;
      const rateEl = document.getElementById('hourlyRateMax') as HTMLInputElement;
      const costEl = document.getElementById('hourlyOperatingCostMax') as HTMLInputElement;
      const resultsGrid = document.getElementById('packageResults');
      
      if (!machineEl || !modeEl || !daysEl || !hoursPerDayEl || !dbhEl || !rateEl || !costEl || !resultsGrid) {
        console.log('Max mode elements missing:', {
          machineEl: !!machineEl,
          modeEl: !!modeEl,
          daysEl: !!daysEl,
          hoursPerDayEl: !!hoursPerDayEl,
          dbhEl: !!dbhEl,
          rateEl: !!rateEl,
          costEl: !!costEl,
          resultsGrid: !!resultsGrid
        });
        setTimeout(updateResults, 100);
        return;
      }
      
      const gpm = parseFloat(machineEl.value);
      const isPlugAndPlay = modeEl.value === 'fusion';
      const availableDays = parseFloat(daysEl.value) || 5;
      const hoursPerDay = parseFloat(hoursPerDayEl.value) || 8;
      const maxDbh = parseFloat(dbhEl.value) || 6;
      const hourlyRate = parseFloat(rateEl.value) || 500;
      const hourlyOperatingCost = parseFloat(costEl.value) || 175;
      
      // If no machine selected, show prompt
      if (!gpm || isNaN(gpm)) {
        resultsGrid.innerHTML = `
          <div class="result-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <div style="font-size: 1.2rem; color: #E0E0E0; margin-bottom: 10px;">🌲</div>
            <div style="font-size: 1rem; color: #B0B0B0;">Select your machine to see maximum capacity and profit projections</div>
          </div>
        `;
        return;
      }
      
      const productionRate = calculateProductionRate(gpm, isPlugAndPlay);
      const totalAvailableHours = availableDays * hoursPerDay;
      
      // Calculate max acres: Total Hours × Production Rate ÷ DBH
      const maxAcres = (totalAvailableHours * productionRate) / maxDbh;
      
      // Calculate financial projections
      const totalRevenue = totalAvailableHours * hourlyRate;
      const totalOperatingCosts = totalAvailableHours * hourlyOperatingCost;
      const totalProfit = totalRevenue - totalOperatingCosts;
      const profitPerAcre = totalProfit / maxAcres;
      const revenuePerAcre = totalRevenue / maxAcres;
      
      // Daily breakdown
      const dailyHours = hoursPerDay;
      const dailyAcres = (dailyHours * productionRate) / maxDbh;
      const dailyRevenue = dailyHours * hourlyRate;
      const dailyOperatingCosts = dailyHours * hourlyOperatingCost;
      const dailyProfit = dailyRevenue - dailyOperatingCosts;
      
      const machineName = machineEl.selectedIndex > 0 ? machineEl.options[machineEl.selectedIndex].text : 'Machine';
      const modeText = isPlugAndPlay ? 'Plug-n-Play' : 'Standard';
      
      resultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, var(--tech-green), #38A169); border-radius: 12px; color: white;">
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">Planning Summary</h3>
          <div style="font-size: 1rem; opacity: 0.9;">${machineName} (${modeText}) • ${availableDays} Days • ${hoursPerDay}h/day</div>
        </div>

        <div class="result-card" style="border-left-color: var(--tech-green); flex: 1;">
          <div class="result-title">Maximum Capacity</div>
          <div class="result-value" style="color: var(--tech-green);">${maxAcres.toFixed(1)} acres</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Total Hours:</strong> ${totalAvailableHours}h</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Production Rate:</strong> ${productionRate.toFixed(2)} I-A/h</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Max DBH:</strong> ${maxDbh}"</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Capacity:</strong> ${maxAcres.toFixed(1)} acres total</div>
          </div>
        </div>

        <div class="result-card" style="border-left-color: var(--primary-red); flex: 1;">
          <div class="result-title">Revenue Potential</div>
          <div class="result-value" style="color: var(--primary-red);">$${totalRevenue.toFixed(0)}</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Rate:</strong> $${hourlyRate}/hour</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Per Acre:</strong> $${revenuePerAcre.toFixed(0)}/acre</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Operating:</strong> $${totalOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Net Profit:</strong> $${totalProfit.toFixed(0)}</div>
          </div>
        </div>

        <div class="result-card" style="border-left-color: var(--accent-blue); flex: 1;">
          <div class="result-title">Daily Breakdown</div>
          <div class="result-value" style="color: var(--accent-blue);">${dailyAcres.toFixed(1)} acres/day</div>
          <div class="result-details">
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Daily Hours:</strong> ${dailyHours}h</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Daily Revenue:</strong> $${dailyRevenue.toFixed(0)}</div>
            <div style="margin-bottom: 8px; color: #E0E0E0;"><strong>Daily Operating:</strong> $${dailyOperatingCosts.toFixed(0)}</div>
            <div style="color: var(--tech-green); font-weight: 600;"><strong>Daily Profit:</strong> $${dailyProfit.toFixed(0)}</div>
          </div>
        </div>

        <div style="grid-column: 1 / -1; text-align: center; margin-top: 30px; padding: 20px; background: #2A2A2A; border-radius: 8px;">
          <div style="color: #E0E0E0; font-size: 0.9rem; margin-bottom: 10px;">🎯 <strong>Expectation Management</strong></div>
          <div style="color: #B0B0B0; font-size: 0.85rem; line-height: 1.5;">
            <strong>Max Capacity:</strong> ${maxAcres.toFixed(1)} acres in ${availableDays} days<br>
            <strong>Profit per Acre:</strong> $${profitPerAcre.toFixed(0)} • <strong>Total Profit:</strong> $${totalProfit.toFixed(0)}<br>
            <em>Based on ${maxDbh}" max DBH, ${hoursPerDay}h/day operation, ${modeText} mulcher</em>
          </div>
        </div>
      `;
    }

    function handleMachineSelection() {
      const selector = document.getElementById('machineSelector') as HTMLSelectElement;
      const gpmInput = document.getElementById('machineGpm') as HTMLInputElement;
      const gpmGroup = document.getElementById('gpmInputGroup');
      const selectedMachine = document.getElementById('selectedMachine');
      
      if (selector?.value && gpmInput) {
        // Set the GPM value
        gpmInput.value = selector.value;
        
        // Show selected machine, hide manual GPM input
        if (selectedMachine && gpmGroup) {
          const machineName = selector.options[selector.selectedIndex].text;
          selectedMachine.innerHTML = `
            <div style="padding: 12px 14px; background: #2A2A2A; border: 2px solid var(--tech-green); border-radius: 8px; color: var(--tech-green); font-weight: 600;">
              Selected: ${machineName}
            </div>
          `;
          selectedMachine.style.display = 'block';
          gpmGroup.style.display = 'none';
        }
        
        updateResults();
      } else {
        // Show manual GPM input when no machine selected
        if (selectedMachine && gpmGroup) {
          selectedMachine.style.display = 'none';
          gpmGroup.style.display = 'block';
        }
      }
    }

    function switchMode(mode: 'single' | 'compare' | 'max') {
      currentMode = mode;
      
      // Update tab appearances
      const singleTab = document.getElementById('singleTab');
      const compareTab = document.getElementById('compareTab');
      const maxTab = document.getElementById('maxTab');
      const singleInputs = document.getElementById('singleModeInputs');
      const compareInputs = document.getElementById('compareModeInputs');
      const maxInputs = document.getElementById('maxModeInputs');
      
      // Remove active from all tabs
      singleTab?.classList.remove('active');
      compareTab?.classList.remove('active');
      maxTab?.classList.remove('active');
      
      // Hide all inputs
      if (singleInputs) singleInputs.style.display = 'none';
      if (compareInputs) compareInputs.style.display = 'none';
      if (maxInputs) maxInputs.style.display = 'none';
      
      // Show active tab and inputs
      if (mode === 'single') {
        singleTab?.classList.add('active');
        if (singleInputs) singleInputs.style.display = 'block';
      } else if (mode === 'compare') {
        compareTab?.classList.add('active');
        if (compareInputs) compareInputs.style.display = 'block';
      } else {
        maxTab?.classList.add('active');
        if (maxInputs) maxInputs.style.display = 'block';
      }
      
      updateResults();
    }

    // Initialize
    const initTimer = setInterval(() => {
      const elements = ['machineSelector', 'machineGpm', 'projectSize', 'maxDbh', 'hourlyRate', 'hourlyOperatingCost'];
      const allReady = elements.every(id => document.getElementById(id));
      
      if (allReady) {
        clearInterval(initTimer);
        
        // Single mode event listeners
        document.getElementById('machineSelector')?.addEventListener('change', handleMachineSelection);
        document.getElementById('machineGpm')?.addEventListener('input', updateResults);
        document.getElementById('projectSize')?.addEventListener('input', updateResults);
        document.getElementById('maxDbh')?.addEventListener('input', updateResults);
        document.getElementById('hourlyRate')?.addEventListener('input', updateResults);
        document.getElementById('hourlyOperatingCost')?.addEventListener('input', updateResults);
        
        // Tab event listeners
        document.getElementById('singleTab')?.addEventListener('click', () => switchMode('single'));
        document.getElementById('compareTab')?.addEventListener('click', () => switchMode('compare'));
        document.getElementById('maxTab')?.addEventListener('click', () => switchMode('max'));
        
        // Compare mode event listeners
        document.getElementById('compareMachine1')?.addEventListener('change', updateResults);
        document.getElementById('compareMachine2')?.addEventListener('change', updateResults);
        document.getElementById('compareMachine3')?.addEventListener('change', updateResults);
        document.getElementById('compareMode1')?.addEventListener('change', updateResults);
        document.getElementById('compareMode2')?.addEventListener('change', updateResults);
        document.getElementById('compareMode3')?.addEventListener('change', updateResults);
        document.getElementById('projectSizeCompare')?.addEventListener('input', updateResults);
        document.getElementById('maxDbhCompare')?.addEventListener('input', updateResults);
        document.getElementById('hourlyRateCompare')?.addEventListener('input', updateResults);
        document.getElementById('hourlyOperatingCostCompare')?.addEventListener('input', updateResults);
        
        // Max mode event listeners
        document.getElementById('maxMachine')?.addEventListener('change', updateResults);
        document.getElementById('maxMode')?.addEventListener('change', updateResults);
        document.getElementById('availableDays')?.addEventListener('input', updateResults);
        document.getElementById('hoursPerDay')?.addEventListener('input', updateResults);
        document.getElementById('maxDbhMax')?.addEventListener('input', updateResults);
        document.getElementById('hourlyRateMax')?.addEventListener('input', updateResults);
        document.getElementById('hourlyOperatingCostMax')?.addEventListener('input', updateResults);
        
        // Initialize with single mode and trigger machine selection check
        switchMode('single');
        
        // Check if machine is already selected on page load
        setTimeout(() => {
          handleMachineSelection();
        }, 200);
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

        .tab-container {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 2px solid #2D2D2D;
        }

        .tab-button {
          background: transparent;
          border: none;
          padding: 12px 20px;
          color: #B0B0B0;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: #E0E0E0;
          background: rgba(255,255,255,0.05);
        }

        .tab-button.active {
          color: var(--primary-red);
          border-bottom-color: var(--primary-red);
        }

        .mode-inputs {
          margin-bottom: 20px;
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

              {/* Tab Navigation */}
              <div className="tab-container">
                <button id="singleTab" className="tab-button active">Single Machine</button>
                <button id="compareTab" className="tab-button">Compare Machines</button>
                <button id="maxTab" className="tab-button">Max Planning</button>
              </div>
            
              {/* Single Mode Inputs */}
              <div id="singleModeInputs" className="mode-inputs">
                <div className="input-group" style={{ marginBottom: '25px' }}>
                  <label htmlFor="machineSelector">Select Your Machine</label>
                  <select id="machineSelector" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
                    <option value="">Select Machine (or enter GPM manually below)</option>
                    <optgroup label="CATERPILLAR TRACK LOADERS">
                      <option value="34">CAT 265</option>
                      <option value="34">CAT 275</option>
                      <option value="34">CAT 285</option>
                      <option value="32">CAT 299D3</option>
                      <option value="40">CAT 275 XE</option>
                      <option value="40">CAT 285 XE</option>
                      <option value="40">CAT 299D3 XE</option>
                      <option value="40">CAT 299D3 XE Land Management</option>
                    </optgroup>
                    <optgroup label="BOBCAT TRACK LOADERS">
                      <option value="30.3">Bobcat T76</option>
                      <option value="30.5">Bobcat T740</option>
                      <option value="36.6">Bobcat T770</option>
                      <option value="36.6">Bobcat T86</option>
                      <option value="42">Bobcat T86 (Super Flow)</option>
                      <option value="36.6">Bobcat T870</option>
                    </optgroup>
                    <optgroup label="ASV TRACK LOADERS">
                      <option value="30.5">ASV VT-75</option>
                      <option value="34.3">ASV VT-80</option>
                      <option value="34.3">ASV VT-80 Forestry</option>
                      <option value="36.8">ASV VT-100</option>
                      <option value="36.8">ASV VT-100 Forestry</option>
                      <option value="50">ASV RT-135</option>
                      <option value="50">ASV RT-135 Forestry</option>
                    </optgroup>
                    <optgroup label="KUBOTA TRACK LOADERS">
                      <option value="29.3">Kubota SVL75-2</option>
                      <option value="40">Kubota SVL95-2</option>
                    </optgroup>
                    <optgroup label="FECON CARRIERS">
                      <option value="60">Fecon FTX150-2</option>
                      <option value="80">Fecon FTX200</option>
                      <option value="115">Fecon FTX300</option>
                      <option value="50">Fecon 135VRT</option>
                      <option value="80">Fecon 225VST</option>
                      <option value="115">Fecon 325VST</option>
                    </optgroup>
                  </select>
                </div>

                <div className="input-row-triple">
                  <div className="input-group">
                    <label htmlFor="machineGpm">Machine GPM (High Flow)</label>
                    <div id="selectedMachine" style={{ display: 'none' }}></div>
                    <div id="gpmInputGroup">
                      <input type="number" id="machineGpm" min="20" max="120" defaultValue="30" step="1" />
                    </div>
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

              {/* Compare Mode Inputs */}
              <div id="compareModeInputs" className="mode-inputs" style={{ display: 'none' }}>
                <div className="input-row-triple">
                  <div className="input-group">
                    <label htmlFor="compareMachine1">Machine 1 (Current)</label>
                    <select id="compareMachine1" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
                      <option value="">Select Current Machine</option>
                      <optgroup label="CATERPILLAR TRACK LOADERS">
                        <option value="34">CAT 265</option>
                        <option value="34">CAT 275</option>
                        <option value="34">CAT 285</option>
                        <option value="32">CAT 299D3</option>
                        <option value="40">CAT 275 XE</option>
                        <option value="40">CAT 285 XE</option>
                        <option value="40">CAT 299D3 XE</option>
                        <option value="40">CAT 299D3 XE Land Management</option>
                      </optgroup>
                      <optgroup label="BOBCAT TRACK LOADERS">
                        <option value="30.3">Bobcat T76</option>
                        <option value="30.5">Bobcat T740</option>
                        <option value="36.6">Bobcat T770</option>
                        <option value="36.6">Bobcat T86</option>
                        <option value="42">Bobcat T86 (Super Flow)</option>
                        <option value="36.6">Bobcat T870</option>
                      </optgroup>
                      <optgroup label="ASV TRACK LOADERS">
                        <option value="30.5">ASV VT-75</option>
                        <option value="34.3">ASV VT-80</option>
                        <option value="34.3">ASV VT-80 Forestry</option>
                        <option value="36.8">ASV VT-100</option>
                        <option value="36.8">ASV VT-100 Forestry</option>
                        <option value="50">ASV RT-135</option>
                        <option value="50">ASV RT-135 Forestry</option>
                      </optgroup>
                      <optgroup label="KUBOTA TRACK LOADERS">
                        <option value="29.3">Kubota SVL75-2</option>
                        <option value="40">Kubota SVL95-2</option>
                      </optgroup>
                      <optgroup label="FECON CARRIERS">
                        <option value="60">Fecon FTX150-2</option>
                        <option value="80">Fecon FTX200</option>
                        <option value="115">Fecon FTX300</option>
                        <option value="50">Fecon 135VRT</option>
                        <option value="80">Fecon 225VST</option>
                        <option value="115">Fecon 325VST</option>
                      </optgroup>
                    </select>
                    <select id="compareMode1" defaultValue="fusion" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D', marginTop: '8px' }}>
                      <option value="standard">Standard Mulcher</option>
                      <option value="fusion">Plug-n-Play</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="compareMachine2">Machine 2 (Upgrade Option)</label>
                    <select id="compareMachine2" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
                      <option value="">Select Upgrade Machine</option>
                      <optgroup label="CATERPILLAR TRACK LOADERS">
                        <option value="34">CAT 265</option>
                        <option value="34">CAT 275</option>
                        <option value="34">CAT 285</option>
                        <option value="32">CAT 299D3</option>
                        <option value="40">CAT 275 XE</option>
                        <option value="40">CAT 285 XE</option>
                        <option value="40">CAT 299D3 XE</option>
                        <option value="40">CAT 299D3 XE Land Management</option>
                      </optgroup>
                      <optgroup label="BOBCAT TRACK LOADERS">
                        <option value="30.3">Bobcat T76</option>
                        <option value="30.5">Bobcat T740</option>
                        <option value="36.6">Bobcat T770</option>
                        <option value="36.6">Bobcat T86</option>
                        <option value="42">Bobcat T86 (Super Flow)</option>
                        <option value="36.6">Bobcat T870</option>
                      </optgroup>
                      <optgroup label="ASV TRACK LOADERS">
                        <option value="30.5">ASV VT-75</option>
                        <option value="34.3">ASV VT-80</option>
                        <option value="34.3">ASV VT-80 Forestry</option>
                        <option value="36.8">ASV VT-100</option>
                        <option value="36.8">ASV VT-100 Forestry</option>
                        <option value="50">ASV RT-135</option>
                        <option value="50">ASV RT-135 Forestry</option>
                      </optgroup>
                      <optgroup label="KUBOTA TRACK LOADERS">
                        <option value="29.3">Kubota SVL75-2</option>
                        <option value="40">Kubota SVL95-2</option>
                      </optgroup>
                      <optgroup label="FECON CARRIERS">
                        <option value="60">Fecon FTX150-2</option>
                        <option value="80">Fecon FTX200</option>
                        <option value="115">Fecon FTX300</option>
                        <option value="50">Fecon 135VRT</option>
                        <option value="80">Fecon 225VST</option>
                        <option value="115">Fecon 325VST</option>
                      </optgroup>
                    </select>
                    <select id="compareMode2" defaultValue="fusion" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D', marginTop: '8px' }}>
                      <option value="standard">Standard Mulcher</option>
                      <option value="fusion">Plug-n-Play</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="compareMachine3">Machine 3 (Optional)</label>
                    <select id="compareMachine3" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
                      <option value="">Select Third Machine (Optional)</option>
                      <optgroup label="CATERPILLAR TRACK LOADERS">
                        <option value="34">CAT 265</option>
                        <option value="34">CAT 275</option>
                        <option value="34">CAT 285</option>
                        <option value="32">CAT 299D3</option>
                        <option value="40">CAT 275 XE</option>
                        <option value="40">CAT 285 XE</option>
                        <option value="40">CAT 299D3 XE</option>
                        <option value="40">CAT 299D3 XE Land Management</option>
                      </optgroup>
                      <optgroup label="BOBCAT TRACK LOADERS">
                        <option value="30.3">Bobcat T76</option>
                        <option value="30.5">Bobcat T740</option>
                        <option value="36.6">Bobcat T770</option>
                        <option value="36.6">Bobcat T86</option>
                        <option value="42">Bobcat T86 (Super Flow)</option>
                        <option value="36.6">Bobcat T870</option>
                      </optgroup>
                      <optgroup label="ASV TRACK LOADERS">
                        <option value="30.5">ASV VT-75</option>
                        <option value="34.3">ASV VT-80</option>
                        <option value="34.3">ASV VT-80 Forestry</option>
                        <option value="36.8">ASV VT-100</option>
                        <option value="36.8">ASV VT-100 Forestry</option>
                        <option value="50">ASV RT-135</option>
                        <option value="50">ASV RT-135 Forestry</option>
                      </optgroup>
                      <optgroup label="KUBOTA TRACK LOADERS">
                        <option value="29.3">Kubota SVL75-2</option>
                        <option value="40">Kubota SVL95-2</option>
                      </optgroup>
                      <optgroup label="FECON CARRIERS">
                        <option value="60">Fecon FTX150-2</option>
                        <option value="80">Fecon FTX200</option>
                        <option value="115">Fecon FTX300</option>
                        <option value="50">Fecon 135VRT</option>
                        <option value="80">Fecon 225VST</option>
                        <option value="115">Fecon 325VST</option>
                      </optgroup>
                    </select>
                    <select id="compareMode3" defaultValue="fusion" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D', marginTop: '8px' }}>
                      <option value="standard">Standard Mulcher</option>
                      <option value="fusion">Plug-n-Play</option>
                    </select>
                  </div>
                </div>

                {/* Shared project parameters for comparison */}
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="projectSize">Project Size (Acres)</label>
                    <input type="number" id="projectSizeCompare" min="0.1" max="100" defaultValue="1" step="0.1" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="maxDbh">Max DBH (inches)</label>
                    <input type="number" id="maxDbhCompare" min="1" max="30" defaultValue="6" step="0.5" />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="hourlyRate">Hourly Billing Rate ($)</label>
                    <input type="number" id="hourlyRateCompare" min="100" max="1000" defaultValue="500" step="25" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="hourlyOperatingCost">Operating Cost ($)</label>
                    <input type="number" id="hourlyOperatingCostCompare" min="50" max="500" defaultValue="175" step="25" />
                  </div>
                </div>
              </div>

              {/* Max Mode Inputs */}
              <div id="maxModeInputs" className="mode-inputs" style={{ display: 'none' }}>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="maxMachine">Your Machine</label>
                    <select id="maxMachine" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D' }}>
                      <option value="">Select Your Machine</option>
                      <optgroup label="CATERPILLAR TRACK LOADERS">
                        <option value="34">CAT 265</option>
                        <option value="34">CAT 275</option>
                        <option value="34">CAT 285</option>
                        <option value="32">CAT 299D3</option>
                        <option value="40">CAT 275 XE</option>
                        <option value="40">CAT 285 XE</option>
                        <option value="40">CAT 299D3 XE</option>
                        <option value="40">CAT 299D3 XE Land Management</option>
                      </optgroup>
                      <optgroup label="BOBCAT TRACK LOADERS">
                        <option value="30.3">Bobcat T76</option>
                        <option value="30.5">Bobcat T740</option>
                        <option value="36.6">Bobcat T770</option>
                        <option value="36.6">Bobcat T86</option>
                        <option value="42">Bobcat T86 (Super Flow)</option>
                        <option value="36.6">Bobcat T870</option>
                      </optgroup>
                      <optgroup label="ASV TRACK LOADERS">
                        <option value="30.5">ASV VT-75</option>
                        <option value="34.3">ASV VT-80</option>
                        <option value="34.3">ASV VT-80 Forestry</option>
                        <option value="36.8">ASV VT-100</option>
                        <option value="36.8">ASV VT-100 Forestry</option>
                        <option value="50">ASV RT-135</option>
                        <option value="50">ASV RT-135 Forestry</option>
                      </optgroup>
                      <optgroup label="KUBOTA TRACK LOADERS">
                        <option value="29.3">Kubota SVL75-2</option>
                        <option value="40">Kubota SVL95-2</option>
                      </optgroup>
                      <optgroup label="FECON CARRIERS">
                        <option value="60">Fecon FTX150-2</option>
                        <option value="80">Fecon FTX200</option>
                        <option value="115">Fecon FTX300</option>
                        <option value="50">Fecon 135VRT</option>
                        <option value="80">Fecon 225VST</option>
                        <option value="115">Fecon 325VST</option>
                      </optgroup>
                    </select>
                    <select id="maxMode" defaultValue="fusion" style={{ background: '#2A2A2A', color: '#FFFFFF', border: '2px solid #2D2D2D', marginTop: '8px' }}>
                      <option value="standard">Standard Mulcher</option>
                      <option value="fusion">Plug-n-Play</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="availableDays">Available Days</label>
                    <input type="number" id="availableDays" min="1" max="30" defaultValue="5" step="1" />
                    <label htmlFor="hoursPerDay" style={{ marginTop: '8px' }}>Hours per Day</label>
                    <input type="number" id="hoursPerDay" min="4" max="12" defaultValue="8" step="0.5" style={{ marginTop: '4px' }} />
                  </div>
                </div>

                <div className="input-row-triple">
                  <div className="input-group">
                    <label htmlFor="maxDbhMax">Max DBH (inches)</label>
                    <input type="number" id="maxDbhMax" min="1" max="30" defaultValue="6" step="0.5" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="hourlyRateMax">Hourly Billing Rate ($)</label>
                    <input type="number" id="hourlyRateMax" min="100" max="1000" defaultValue="500" step="25" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="hourlyOperatingCostMax">Operating Cost ($)</label>
                    <input type="number" id="hourlyOperatingCostMax" min="50" max="500" defaultValue="175" step="25" />
                  </div>
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