// Game State
let gameState = {
    // Player stats
    clicks: 0,
    cps: 0,
    clickPower: 1,
    totalBonuses: 0,
    
    // Shop stats
    totalSpent: 0,
    totalCps: 0,
    
    // Settings
    soundEnabled: true,
    darkMode: false,
    
    // Collections
    cart: [],
    achievements: [],
    
    // Game tracking
    lastClickTime: Date.now(),
    clicksInSecond: 0,
    currentCps: 0,
    autoClicks: 0,
    
    // Competition tracking
    rank: 5,
    competitors: [],
    defeatedCompetitors: 0,
    nextReward: 100
};

// Shop Items
const shopItems = [
    { id: 1, name: "Auto Clicker", price: 50, cps: 1, emoji: "🤖" },
    { id: 2, name: "Click Power", price: 100, power: 2, emoji: "⚡" },
    { id: 3, name: "Mega Clicker", price: 200, cps: 5, emoji: "🚀" },
    { id: 4, name: "Super Power", price: 500, power: 5, emoji: "💪" },
    { id: 5, name: "Ultra Booster", price: 1000, cps: 15, emoji: "🔥" },
    { id: 6, name: "Quantum Power", price: 2000, power: 10, emoji: "🌀" }
];

// Achievements
const achievementsList = [
    { id: 1, name: "First Victory", description: "Defeat your first competitor", reward: 100, unlocked: false },
    { id: 2, name: "Top 3", description: "Reach rank 3 or higher", reward: 250, unlocked: false },
    { id: 3, name: "Click Champion", description: "Reach 10,000 clicks", reward: 500, unlocked: false },
    { id: 4, name: "Speed Demon", description: "Achieve 50 CPS", reward: 1000, unlocked: false },
    { id: 5, name: "Dominator", description: "Defeat all competitors", reward: 5000, unlocked: false }
];

// Competitors (initial setup)
const competitorNames = ["Bot Alpha", "Click Master", "Auto King", "Speed Demon"];
const competitorColors = ["var(--bot1)", "var(--bot2)", "var(--bot3)", "var(--bot4)"];
const competitorEmojis = ["🤖", "👑", "🤴", "⚡"];

// DOM Elements
let clickButton, clickCountDisplay, cpsDisplay, rankDisplay;
let playerClicksDisplay, playerPowerDisplay, totalBonusesDisplay;
let shopItemsContainer, competitorsList, achievementsListContainer;
let currentTargetDisplay, clicksAheadDisplay, rewardAmountDisplay;
let progressBar, progressText, nextBonusDisplay;
let resetButton, themeButton, soundButton, newCompetitorsButton;
let clickEffectsContainer;

// Initialize Game
function initGame() {
    console.log("Initializing game...");
    
    // Load saved state
    loadGameState();
    
    // Initialize competitors
    initCompetitors();
    
    // Get DOM elements
    getDomElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    renderShop();
    renderCompetitors();
    renderAchievements();
    updateUI();
    
    // Start game loops
    startCpsCalculation();
    startAutoClicker();
    startCompetitorUpdates();
    
    console.log("Game initialized successfully!");
}

function getDomElements() {
    clickButton = document.getElementById('clickButton');
    clickCountDisplay = document.getElementById('clickCount');
    cpsDisplay = document.getElementById('cps');
    rankDisplay = document.getElementById('rank');
    playerClicksDisplay = document.getElementById('playerClicks');
    playerPowerDisplay = document.getElementById('playerPower');
    totalBonusesDisplay = document.getElementById('totalBonuses');
    shopItemsContainer = document.getElementById('shopItems');
    competitorsList = document.getElementById('competitorsList');
    achievementsListContainer = document.getElementById('achievementsList');
    currentTargetDisplay = document.getElementById('currentTarget');
    clicksAheadDisplay = document.getElementById('clicksAhead');
    rewardAmountDisplay = document.getElementById('rewardAmount');
    progressBar = document.getElementById('progressBar');
    progressText = document.querySelector('.progress-text');
    nextBonusDisplay = document.querySelector('#nextBonus span');
    resetButton = document.getElementById('resetButton');
    themeButton = document.getElementById('themeButton');
    soundButton = document.getElementById('soundButton');
    newCompetitorsButton = document.getElementById('newCompetitorsButton');
    clickEffectsContainer = document.getElementById('clickEffects');
}

function initCompetitors() {
    if (!gameState.competitors.length) {
        gameState.competitors = competitorNames.map((name, index) => ({
            id: index + 1,
            name: name,
            emoji: competitorEmojis[index],
            color: competitorColors[index],
            clicks: Math.floor(Math.random() * 5000) + 1000,
            cps: Math.floor(Math.random() * 10) + 1,
            growthRate: 0.5 + Math.random() * 2,
            defeated: false
        }));
    }
}

// Setup Event Listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Click button with multiple event types
    clickButton.addEventListener('click', handleClick);
    clickButton.addEventListener('mousedown', () => clickButton.style.transform = 'scale(0.95)');
    clickButton.addEventListener('mouseup', () => clickButton.style.transform = '');
    clickButton.addEventListener('mouseleave', () => clickButton.style.transform = '');
    // Add to setupEventListeners():
    githubButton.addEventListener('click', handleGitHubAppreciation);
    
    // Touch events for mobile
    clickButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        clickButton.style.transform = 'scale(0.95)';
        handleClick(e);
    }, { passive: false });
    
    clickButton.addEventListener('touchend', () => clickButton.style.transform = '');
    
    // Control buttons
    resetButton.addEventListener('click', handleReset);
    themeButton.addEventListener('click', toggleTheme);
    soundButton.addEventListener('click', toggleSound);
    newCompetitorsButton.addEventListener('click', generateNewCompetitors);
    
    console.log("Event listeners set up");
}

// Click Handler
function handleClick(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log("Click detected!");
    
    // Add clicks based on power
    const clicksToAdd = gameState.clickPower;
    gameState.clicks += clicksToAdd;
    gameState.clicksInSecond += clicksToAdd;
    
    // Create click effect with power display
    createClickEffect(clicksToAdd);
    
    // Play sound if enabled
    if (gameState.soundEnabled) {
        playClickSound();
    }
    
    // Check for competition updates
    checkCompetition();
    
    // Update UI
    updateUI();
    
    // Save game state
    saveGameState();
}

function createClickEffect(power) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${power}`;
    effect.style.color = gameState.clickPower > 1 ? '#ffcc00' : '#4ecdc4';
    effect.style.fontSize = `${1 + gameState.clickPower * 0.2}rem`;
    effect.style.fontWeight = '800';
    
    // Random position around the click button
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    effect.style.left = `calc(50% + ${x}px)`;
    effect.style.top = `calc(50% + ${y}px)`;
    
    clickEffectsContainer.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1000);
}

// Competition System
function checkCompetition() {
    // Sort competitors by clicks (descending)
    const allPlayers = [
        { id: 0, name: "YOU", clicks: gameState.clicks, cps: gameState.currentCps, isPlayer: true },
        ...gameState.competitors
    ].sort((a, b) => b.clicks - a.clicks);
    
    // Find player rank
    const playerRank = allPlayers.findIndex(p => p.isPlayer) + 1;
    gameState.rank = playerRank;
    
    // Check if player has overtaken any competitors
    gameState.competitors.forEach(competitor => {
        if (!competitor.defeated && gameState.clicks > competitor.clicks) {
            competitor.defeated = true;
            gameState.defeatedCompetitors++;
            
            // Award bonus
            const reward = Math.floor(competitor.clicks * 0.1) + 100;
            gameState.clicks += reward;
            gameState.totalBonuses += reward;
            
            // Show victory notification
            showNotification(`🎉 You defeated ${competitor.name}! +${reward} clicks!`, 'success');
            playVictorySound();
            
            // Check achievements
            checkAchievements();
        }
    });
    
    // Update next reward target
    updateNextReward();
}

function updateNextReward() {
    // Find next undefeated competitor
    const undefeatedCompetitors = gameState.competitors.filter(c => !c.defeated);
    
    if (undefeatedCompetitors.length > 0) {
        const nextCompetitor = undefeatedCompetitors.reduce((closest, current) => {
            return (current.clicks < closest.clicks) ? current : closest;
        });
        
        currentTargetDisplay.textContent = nextCompetitor.name;
        
        const clicksNeeded = nextCompetitor.clicks - gameState.clicks;
        const clicksAhead = Math.max(0, -clicksNeeded);
        const progressPercentage = clicksAhead > 0 ? 100 : Math.max(0, (gameState.clicks / nextCompetitor.clicks) * 100);
        
        clicksAheadDisplay.textContent = clicksAhead.toLocaleString();
        rewardAmountDisplay.textContent = Math.floor(nextCompetitor.clicks * 0.1 + 100).toLocaleString();
        progressBar.style.width = `${Math.min(100, progressPercentage)}%`;
        progressText.textContent = `${Math.min(100, Math.round(progressPercentage))}% to overtake`;
        
        // Update next bonus display
        if (undefeatedCompetitors.length > 1) {
            const secondCompetitor = [...undefeatedCompetitors]
                .sort((a, b) => a.clicks - b.clicks)[1];
            nextBonusDisplay.textContent = `${(secondCompetitor.clicks - gameState.clicks).toLocaleString()} clicks ahead`;
        } else {
            nextBonusDisplay.textContent = "Final boss!";
        }
    } else {
        // All competitors defeated
        currentTargetDisplay.textContent = "No more competitors!";
        clicksAheadDisplay.textContent = "∞";
        rewardAmountDisplay.textContent = "0";
        progressBar.style.width = "100%";
        progressText.textContent = "100% - You win!";
        nextBonusDisplay.textContent = "You're #1!";
    }
}

function updateCompetitors() {
    // Make competitors progress
    gameState.competitors.forEach(competitor => {
        if (!competitor.defeated) {
            competitor.clicks += competitor.cps;
            competitor.cps += competitor.growthRate * 0.01;
        }
    });
    
    // Check competition
    checkCompetition();
    
    // Update display
    renderCompetitors();
}

function generateNewCompetitors() {
    if (gameState.competitors.every(c => c.defeated)) {
        gameState.competitors = competitorNames.map((name, index) => ({
            id: index + 1,
            name: `New ${name}`,
            emoji: competitorEmojis[index],
            color: competitorColors[index],
            clicks: Math.floor(gameState.clicks * 0.5) + Math.random() * 10000,
            cps: Math.floor(gameState.currentCps * 0.5) + Math.random() * 20 + 5,
            growthRate: 1 + Math.random() * 3,
            defeated: false
        }));
        
        gameState.defeatedCompetitors = 0;
        renderCompetitors();
        showNotification("New competitors have appeared!", 'success');
    } else {
        showNotification("Defeat current competitors first!", 'error');
    }
}

// Shop Functions
function buyItem(item) {
    if (gameState.clicks >= item.price) {
        gameState.clicks -= item.price;
        gameState.totalSpent += item.price;
        
        if (item.cps) {
            gameState.totalCps += item.cps;
            gameState.cart.push(item.id);
            showNotification(`Purchased ${item.name}! +${item.cps} CPS`, 'success');
        }
        
        if (item.power) {
            gameState.clickPower *= item.power;
            showNotification(`Purchased ${item.name}! Click power x${item.power}`, 'success');
        }
        
        // Play purchase sound
        if (gameState.soundEnabled) {
            playPurchaseSound();
        }
        
        // Update UI
        updateUI();
        renderShop();
        
        // Check achievements
        checkAchievements();
        
        // Save game state
        saveGameState();
    } else {
        showNotification("Not enough clicks!", 'error');
    }
}

function updateUI() {
    // Update displays
    clickCountDisplay.textContent = gameState.clicks.toLocaleString();
    cpsDisplay.textContent = gameState.currentCps.toFixed(1);
    rankDisplay.textContent = `#${gameState.rank}`;
    playerClicksDisplay.textContent = gameState.clicks.toLocaleString();
    playerPowerDisplay.textContent = `${gameState.clickPower}x`;
    totalBonusesDisplay.textContent = gameState.totalBonuses.toLocaleString();
    
    // Update button states
    updateShopButtons();
}

function updateShopButtons() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach((button, index) => {
        const item = shopItems[index];
        if (item) {
            button.disabled = gameState.clicks < item.price;
            button.style.opacity = gameState.clicks < item.price ? '0.5' : '1';
            button.style.cursor = gameState.clicks < item.price ? 'not-allowed' : 'pointer';
        }
    });
}

function renderShop() {
    shopItemsContainer.innerHTML = '';
    
    shopItems.forEach(item => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        
        shopItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.emoji} ${item.name}</div>
                <div class="item-details">
                    <span class="item-price">$${item.price.toLocaleString()}</span>
                    ${item.cps ? `<span class="item-cps">+${item.cps} CPS</span>` : ''}
                    ${item.power ? `<span class="item-power">x${item.power} Power</span>` : ''}
                </div>
            </div>
            <button class="buy-btn" data-id="${item.id}">
                <i class="fas fa-shopping-cart"></i> Buy
            </button>
        `;
        
        shopItemsContainer.appendChild(shopItem);
        
        // Add event listener to buy button
        const buyButton = shopItem.querySelector('.buy-btn');
        buyButton.addEventListener('click', () => buyItem(item));
    });
    
    updateShopButtons();
}

function renderCompetitors() {
    competitorsList.innerHTML = '';
    
    // Combine player and competitors
    const allPlayers = [
        {
            id: 0,
            name: "YOU",
            emoji: "👤",
            color: "var(--player)",
            clicks: gameState.clicks,
            cps: gameState.currentCps,
            isPlayer: true
        },
        ...gameState.competitors
    ].sort((a, b) => b.clicks - a.clicks);
    
    // Render each player/competitor
    allPlayers.forEach((player, index) => {
        const competitorElement = document.createElement('div');
        competitorElement.className = `competitor ${player.isPlayer ? 'you' : `bot-${player.id}`}`;
        
        competitorElement.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="competitor-info">
                <div class="competitor-avatar" style="background: ${player.color}">
                    ${player.emoji}
                </div>
                <div>
                    <div class="competitor-name">${player.name}</div>
                    <small>${player.defeated ? '☠️ Defeated' : '⚔️ Active'}</small>
                </div>
            </div>
            <div class="competitor-clicks">${Math.floor(player.clicks).toLocaleString()}</div>
            <div class="competitor-cps">${player.cps.toFixed(1)}</div>
        `;
        
        competitorsList.appendChild(competitorElement);
    });
}

function renderAchievements() {
    achievementsListContainer.innerHTML = '';
    
    achievementsList.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
        
        achievementElement.innerHTML = `
            <div class="achievement-icon">
                ${achievement.unlocked ? '🏆' : '🔒'}
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
            <div class="achievement-reward">+${achievement.reward}</div>
        `;
        
        achievementsListContainer.appendChild(achievementElement);
    });
}

function checkAchievements() {
    let needsUpdate = false;
    
    // Check each achievement
    if (!achievementsList[0].unlocked && gameState.defeatedCompetitors >= 1) {
        achievementsList[0].unlocked = true;
        gameState.clicks += achievementsList[0].reward;
        showNotification(`Achievement unlocked: ${achievementsList[0].name}! +${achievementsList[0].reward} clicks`);
        needsUpdate = true;
    }
    
    if (!achievementsList[1].unlocked && gameState.rank <= 3) {
        achievementsList[1].unlocked = true;
        gameState.clicks += achievementsList[1].reward;
        showNotification(`Achievement unlocked: ${achievementsList[1].name}! +${achievementsList[1].reward} clicks`);
        needsUpdate = true;
    }
    
    if (!achievementsList[2].unlocked && gameState.clicks >= 10000) {
        achievementsList[2].unlocked = true;
        gameState.clicks += achievementsList[2].reward;
        showNotification(`Achievement unlocked: ${achievementsList[2].name}! +${achievementsList[2].reward} clicks`);
        needsUpdate = true;
    }
    
    if (!achievementsList[3].unlocked && gameState.currentCps >= 50) {
        achievementsList[3].unlocked = true;
        gameState.clicks += achievementsList[3].reward;
        showNotification(`Achievement unlocked: ${achievementsList[3].name}! +${achievementsList[3].reward} clicks`);
        needsUpdate = true;
    }
    
    if (!achievementsList[4].unlocked && gameState.competitors.every(c => c.defeated)) {
        achievementsList[4].unlocked = true;
        gameState.clicks += achievementsList[4].reward;
        showNotification(`Achievement unlocked: ${achievementsList[4].name}! +${achievementsList[4].reward} clicks`);
        needsUpdate = true;
    }
    
    if (needsUpdate) {
        renderAchievements();
        updateUI();
    }
}

// Game Loops
function startCpsCalculation() {
    setInterval(() => {
        const now = Date.now();
        const timeDiff = now - gameState.lastClickTime;
        
        if (timeDiff >= 1000) {
            // Manual CPS
            const manualCps = gameState.clicksInSecond;
            
            // Total CPS = manual + auto
            gameState.currentCps = manualCps + gameState.totalCps;
            gameState.clicksInSecond = 0;
            gameState.lastClickTime = now;
            
            // Update UI
            cpsDisplay.textContent = gameState.currentCps.toFixed(1);
        }
    }, 100);
}

function startAutoClicker() {
    setInterval(() => {
        if (gameState.totalCps > 0) {
            const autoClicks = Math.floor(gameState.totalCps);
            if (autoClicks > 0) {
                gameState.clicks += autoClicks;
                gameState.autoClicks += autoClicks;
                
                // Show auto click effect occasionally
                if (Math.random() < 0.3) {
                    createAutoClickEffect(autoClicks);
                }
                
                // Check competition with auto clicks
                checkCompetition();
                
                updateUI();
                saveGameState();
            }
        }
    }, 1000);
}

function startCompetitorUpdates() {
    setInterval(() => {
        updateCompetitors();
    }, 3000); // Update every 3 seconds
}

function createAutoClickEffect(amount) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${amount} (auto)`;
    effect.style.color = '#9b59b6';
    effect.style.fontSize = '1.2rem';
    
    // Random position
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    
    effect.style.left = `calc(50% + ${x}px)`;
    effect.style.top = `calc(50% + ${y}px)`;
    
    clickEffectsContainer.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1000);
}

// Control Functions
function handleReset() {
    if (confirm("Are you sure you want to reset the game? All progress will be lost!")) {
        gameState = {
            clicks: 0,
            cps: 0,
            clickPower: 1,
            totalBonuses: 0,
            totalSpent: 0,
            totalCps: 0,
            soundEnabled: gameState.soundEnabled,
            darkMode: gameState.darkMode,
            cart: [],
            achievements: [],
            lastClickTime: Date.now(),
            clicksInSecond: 0,
            currentCps: 0,
            autoClicks: 0,
            rank: 5,
            competitors: [],
            defeatedCompetitors: 0,
            nextReward: 100
        };
        
        // Reset achievements
        achievementsList.forEach(achievement => achievement.unlocked = false);
        
        // Initialize new competitors
        initCompetitors();
        
        localStorage.removeItem('clickerGameSave');
        
        updateUI();
        renderShop();
        renderCompetitors();
        renderAchievements();
        
        showNotification("Game reset successfully!", 'success');
    }
}

function toggleTheme() {
    gameState.darkMode = !gameState.darkMode;
    
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
        themeButton.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    
    saveGameState();
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    
    if (gameState.soundEnabled) {
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
        // Test sound
        playClickSound();
    } else {
        soundButton.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
    }
    
    saveGameState();
}

// Sound Functions
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600 + Math.random() * 200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

function playPurchaseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play multiple tones for purchase sound
        [800, 1200, 1000].forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            }, index * 50);
        });
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

function playVictorySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Victory fanfare
        [800, 1000, 1200, 1500, 1200, 1000, 800].forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 100);
        });
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function saveGameState() {
    try {
        const saveData = {
            clicks: gameState.clicks,
            clickPower: gameState.clickPower,
            totalBonuses: gameState.totalBonuses,
            totalSpent: gameState.totalSpent,
            totalCps: gameState.totalCps,
            soundEnabled: gameState.soundEnabled,
            darkMode: gameState.darkMode,
            cart: gameState.cart,
            achievements: achievementsList.map(a => a.unlocked),
            competitors: gameState.competitors,
            defeatedCompetitors: gameState.defeatedCompetitors,
            rank: gameState.rank
        };
        localStorage.setItem('clickerGameSave', JSON.stringify(saveData));
    } catch (error) {
        console.log("Error saving game state:", error);
    }
}
// GitHub Appreciation Function
function handleGitHubAppreciation() {
    // Check if power is already boosted
    if (gameState.clickPower >= 67000) {
        showNotification("greed.", 'success');
        playGitHubSound();
        return;
    }
    
    // Show confirmation dialog
    const confirmMessage = "only click this, If you're the teacher playing this";
    
    if (confirm(confirmMessage)) {
        // Save old power for comparison
        const oldPower = gameState.clickPower;
        
        // Set power to 67000
        gameState.clickPower = 670000;
        
        // Add bonus clicks
        const bonusClicks = 10000;
        gameState.clicks += bonusClicks;
        
        // Update button style
        githubButton.classList.add('unlocked');
        githubButton.innerHTML = '<i class="fab fa-github"></i> POWER UNLOCKED!';
        githubButton.disabled = true;
        
        // Show epic notification
        showNotification(
            `🚀 GITHUB POWER ACTIVATED!<br>` +
            `Click Power: ${oldPower.toLocaleString()}x → ${gameState.clickPower.toLocaleString()}x<br>` +
            `+${bonusClicks.toLocaleString()} bonus clicks!<br>` +
            `Thank you for playing! ⭐`,
            'github'
        );
        
        // Play epic sound
        playGitHubSound();
        
        // Save to localStorage so it persists
        localStorage.setItem('githubPowerUnlocked', 'true');
        
        // Update UI
        updateUI();
        saveGameState();
        
        // Add visual effects
        createGitHubEffect();
        
        // Check achievements
        checkAchievements();
    }
}

// Create special GitHub effect
function createGitHubEffect() {
    // Create multiple particles
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'click-effect';
            particle.textContent = ['⭐', '🚀', '⚡', '💥', '🔥'][Math.floor(Math.random() * 5)];
            particle.style.color = ['#6e5494', '#4078c0', '#c9510c', '#fafbfc'][Math.floor(Math.random() * 4)];
            particle.style.fontSize = `${1.5 + Math.random() * 2}rem`;
            particle.style.zIndex = '1000';
            
            // Random position around the button
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.left = `calc(50% + ${x}px)`;
            particle.style.top = `calc(50% + ${y}px)`;
            
            // Random animation
            particle.style.animation = `floatUp ${1 + Math.random()}s ease-out forwards`;
            
            clickEffectsContainer.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }, i * 50);
    }
    
    // Add CSS for the effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, -200px) rotate(${Math.random() * 360}deg) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// GitHub appreciation sound
function playGitHubSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Epic GitHub unlock sound
        const frequencies = [400, 600, 800, 1000, 1200, 1400, 1200, 1000, 800, 600, 400];
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = index % 2 === 0 ? 'sine' : 'square';
                
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, index * 80);
        });
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

// Load GitHub power state on game load


function loadGameState() {
    try {
        const saved = localStorage.getItem('clickerGameSave');
        if (saved) {
            const loadedState = JSON.parse(saved);
            
            // Restore basic state
            gameState.clicks = loadedState.clicks || 0;
            gameState.clickPower = loadedState.clickPower || 1;
            gameState.totalBonuses = loadedState.totalBonuses || 0;
            gameState.totalSpent = loadedState.totalSpent || 0;
            gameState.totalCps = loadedState.totalCps || 0;
            gameState.soundEnabled = loadedState.soundEnabled !== false;
            gameState.darkMode = loadedState.darkMode || false;
            gameState.cart = loadedState.cart || [];
            gameState.competitors = loadedState.competitors || [];
            gameState.defeatedCompetitors = loadedState.defeatedCompetitors || 0;
            gameState.rank = loadedState.rank || 5;
            
            // Restore achievements
            if (loadedState.achievements) {
                achievementsList.forEach((achievement, index) => {
                    achievement.unlocked = loadedState.achievements[index] || false;
                });
            }
            
            console.log("Game state loaded successfully");
        }
    } catch (error) {
        console.log("Error loading game state:", error);
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, starting game...");
    
    // Apply saved theme immediately
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    initGame();
    
    // Test click functionality
    console.log("Game ready! Click the big button to start!");
});

// Debug function
window.debugAddClicks = function(amount = 1000) {
    gameState.clicks += amount;
    updateUI();
    showNotification(`Debug: Added ${amount} clicks`);
};

window.debugDefeatAll = function() {
    gameState.competitors.forEach(competitor => {
        competitor.defeated = true;
    });
    checkCompetition();
    showNotification("Debug: Defeated all competitors");
};
