"use client";

import { useRef, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/animation";

export function GameSection() {
  // Use shared animation hook for performance
  useScrollAnimation();
  
  const gameRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Game physics constants - adjusted for even better jump height
  const baseGameSpeed = 0.9; // Slightly faster base speed
  const maxGameSpeed = 2.7; // Higher maximum speed
  const cloudSpeed = 0.5; // Clouds move slower than platforms
  const gravity = 0.22; // Further reduced gravity for higher jumps (was 0.25)
  const jumpForce = -8.3; // Increased jump force for higher jumps (was -7.8)
  // Forward momentum variables
  const forwardBoostBase = 160; // Base forward boost
  const forwardMomentumDuration = 320; // Slightly increased duration (was 300ms)
  
  useEffect(() => {
    // Initialize game once the component is mounted
    let gameActive = false;
    let platforms: HTMLDivElement[] = [];
    let clouds: HTMLDivElement[] = [];
    let currentGameSpeed = baseGameSpeed;
    let maxGameSpeed = 3.0; // Maximum speed cap
    let currentScore = 0;
    let forwardBoost = 175; // Base forward boost
    let maxJumpDistance = 280;
    let playerVelocityY = 0;
    let isJumping = false;
    let playerY = 150;
    let currentHighScore = localStorage.getItem('islandHopperHighScore') ? 
      parseInt(localStorage.getItem('islandHopperHighScore') || '0') : 0;
    let animationFrameId: number;
    let lastJumpTime = 0;
    let justLanded = false;
    
    // Set initial high score from localStorage
    setHighScore(currentHighScore);
    
    // Create a platform
    const createPlatform = (x: number, y: number, width: number) => {
      if (!platformsRef.current) return null;
      
      const platform = document.createElement('div');
      platform.className = 'absolute bg-primary rounded-sm shadow-md game-platform';
      platform.style.left = `${x}px`;
      platform.style.top = `${y}px`;
      platform.style.width = `${width}px`;
      platform.style.height = '20px';
      
      const platformTop = document.createElement('div');
      platformTop.className = 'absolute top-0 left-0 right-0 h-2 bg-primary-foreground/20 rounded-t-sm';
      platform.appendChild(platformTop);
      
      platformsRef.current.appendChild(platform);
      return platform;
    };
    
    // Create a cloud
    const createCloud = (x: number, y: number, size: number, opacity: number) => {
      if (!cloudsRef.current) return null;
      
      const cloud = document.createElement('div');
      cloud.className = 'absolute bg-white rounded-full blur-sm game-cloud';
      cloud.style.left = `${x}px`;
      cloud.style.top = `${y}px`;
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size * 0.6}px`;
      cloud.style.opacity = opacity.toString();
      
      cloudsRef.current.appendChild(cloud);
      return cloud;
    };
    
    // Initialize clouds
    const initClouds = () => {
      if (!cloudsRef.current) return;
      
      // Clear existing clouds
      while (cloudsRef.current.firstChild) {
        cloudsRef.current.removeChild(cloudsRef.current.firstChild);
      }
      
      clouds = [];
      
      // Create initial clouds randomly positioned
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * 800; // Within game width
        const y = Math.random() * 150; // Top half of the game
        const size = Math.random() * 60 + 40; // 40-100px
        const opacity = Math.random() * 0.4 + 0.2; // 0.2-0.6 opacity
        
        const cloud = createCloud(x, y, size, opacity);
        if (cloud) clouds.push(cloud);
      }
    };
    
    // Initialize platforms with score-based difficulty
    const initPlatforms = () => {
      if (!platformsRef.current) return;
      
      // Clear existing platforms
      while (platformsRef.current.firstChild) {
        platformsRef.current.removeChild(platformsRef.current.firstChild);
      }
      
      platforms = [];
      
      // Starting platform - make it wider and position closer to character
      const startingPlatform = createPlatform(0, 200, 250);
      if (startingPlatform) platforms.push(startingPlatform);
      
      // Generate more platforms - with more varied gaps and distances
      let lastX = 250; // Slightly further for first gap
      for (let i = 0; i < 10; i++) {
        const width = Math.random() * 60 + 90; // Platforms (90-150px)
        
        // More varied gap sizes while ensuring they're still reachable
        const speedFactor = Math.max(0.4, 1.2 - (currentGameSpeed / baseGameSpeed) * 0.3);
        
        // Randomize gap size more significantly but keep within jump range
        // Higher variance for more unpredictable gameplay
        const minGap = 50; // Minimum gap size
        const maxGap = 110; // Maximum gap size
        const randomFactor = Math.random(); // 0-1 random value
        
        // Apply a curve to random factor to favor middle values
        // This creates a bell curve distribution where extreme values (very small or very large) are less common
        const curvedRandom = Math.pow(Math.sin(randomFactor * Math.PI), 2); // Creates a bell curve effect
        
        // Calculate base gap using this curved distribution
        const baseGap = minGap + curvedRandom * (maxGap - minGap);
        const gap = baseGap * speedFactor; // Gap decreases as speed increases
        
        // Height varies more for more interesting jumps
        const heightVariation = 25;
        const y = Math.max(175, Math.min(225, 200 + (Math.random() * heightVariation * 2 - heightVariation)));
        
        const platform = createPlatform(lastX + gap, y, width);
        if (platform) platforms.push(platform);
        
        lastX += width + gap;
      }
    };
    
    // Update game state with faster speed scaling
    const updateGame = () => {
      if (!gameActive) return;
      
      // IMPROVED: More aggressive speed increase based on score
      // Speed now increases 75% faster than before
      currentGameSpeed = Math.min(maxGameSpeed, baseGameSpeed + (currentScore / 60) * 0.5);
      
      // Update current forward boost based on score
      forwardBoost = forwardBoostBase + (currentScore / 10);
      
      // FIXED: More consistent platform movement during jumps
      // Keep higher minimum speed during jumps with a consistent ratio
      const platformSpeed = isJumping 
        ? currentGameSpeed * 0.85 // Only slight slowdown during jumps
        : currentGameSpeed;
      
      // Apply momentum to platforms using requestAnimationFrame for smooth animation
      // Update platforms position (move left)
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        const currentX = parseFloat(platform.style.left);
        platform.style.left = `${currentX - platformSpeed}px`;
        
        // Remove platforms that are off-screen
        if (currentX + parseFloat(platform.style.width) < -50) {
          if (platformsRef.current) {
            platformsRef.current.removeChild(platform);
            platforms = platforms.filter(p => p !== platform);
          }
        }
      }
      
      // Update clouds position (move left slower)
      clouds.forEach(cloud => {
        const currentX = parseFloat(cloud.style.left);
        cloud.style.left = `${currentX - cloudSpeed}px`;
        
        // Remove clouds that are off-screen
        if (currentX + parseFloat(cloud.style.width) < -50) {
          if (cloudsRef.current) {
            cloudsRef.current.removeChild(cloud);
            clouds = clouds.filter(c => c !== cloud);
          }
        }
      });
      
      // Add new clouds if needed
      if (clouds.length < 8 && cloudsRef.current && Math.random() < 0.01) {
        const y = Math.random() * 150; // Top half of the game
        const size = Math.random() * 60 + 40; // 40-100px
        const opacity = Math.random() * 0.4 + 0.2; // 0.2-0.6 opacity
        
        const newCloud = createCloud(800, y, size, opacity);
        if (newCloud) clouds.push(newCloud);
      }
      
      // Update dynamically added platforms with score-based difficulty
      if (platforms.length < 5 && platformsRef.current) {
        let rightmostX = -Infinity;
        
        platforms.forEach(platform => {
          const platformRight = parseFloat(platform.style.left) + parseFloat(platform.style.width);
          if (platformRight > rightmostX) {
            rightmostX = platformRight;
          }
        });
        
        // Platform width gets narrower as score increases
        const sizeReduction = Math.min(30, currentScore / 5);
        const width = Math.random() * 60 + Math.max(60, 90 - sizeReduction); // Gets narrower with score
        
        // Apply same varied gap algorithm for dynamically added platforms
        const speedFactor = Math.max(0.4, 1.2 - (currentGameSpeed / baseGameSpeed) * 0.3);
        
        // Gap increases with score - making platforms further apart as game progresses
        const scoreMultiplier = 1 + Math.min(0.8, currentScore / 100);
        const minGap = 50 * scoreMultiplier;
        const maxGap = 110 * scoreMultiplier;
        
        // Unpredictability increases with score
        const unpredictability = Math.min(0.8, 0.1 + (currentScore / 200));
        const randomFactor = Math.random();
        
        // As score increases, gaps become more unpredictable
        // At low scores, the curve creates a bell distribution favoring medium gaps
        // At high scores, the curve flattens making all gap sizes more equally likely
        const curvedRandom = Math.pow(Math.sin(randomFactor * Math.PI), 2 * (1 - unpredictability));
        const baseGap = minGap + curvedRandom * (maxGap - minGap);
        const gap = baseGap * speedFactor; // Gap decreases as speed increases
        
        // Height variation increases with score for more challenge
        const heightVariation = Math.min(50, 20 + currentScore / 10);
        const y = Math.max(175, Math.min(225, 200 + (Math.random() * heightVariation * 2 - heightVariation)));
        
        const newPlatform = createPlatform(rightmostX + gap, y, width);
        if (newPlatform) platforms.push(newPlatform);
      }
      
      // Apply gravity
      playerVelocityY += gravity;
      playerY += playerVelocityY;
      
      // Check collision with platforms
      let onPlatform = false;
      
      platforms.forEach(platform => {
        const platformX = parseFloat(platform.style.left);
        const platformWidth = parseFloat(platform.style.width);
        const platformY = parseFloat(platform.style.top);
        
        const playerBottom = playerY + 32;
        const playerLeft = 50; // Fixed x position
        const playerRight = playerLeft + 32;
        
        // Check if landing on a platform
        if (
          playerBottom >= platformY && 
          playerBottom - playerVelocityY <= platformY &&
          playerRight > platformX && 
          playerLeft < platformX + platformWidth
        ) {
          onPlatform = true;
          playerY = platformY - 32;
          playerVelocityY = 0;
          
          // Create splash effect when landing
          if (isJumping) {
            isJumping = false;
            justLanded = true;
            
            // Add splash animation
            if (characterRef.current) {
              characterRef.current.classList.remove('jumping', 'falling');
              characterRef.current.classList.add('landing');
              
              // Remove landing animation after it completes
              setTimeout(() => {
                if (characterRef.current) {
                  characterRef.current.classList.remove('landing');
                  characterRef.current.classList.add('running');
                }
              }, 300);
            }
          }
        }
      });
      
      // Update character position and animation
      if (characterRef.current) {
        // Add enhanced horizontal movement to the character during jump
        if (isJumping) {
          // Visual horizontal motion during jump using CSS transform
          const jumpProgress = Math.min(1, (Date.now() - lastJumpTime) / forwardMomentumDuration);
          const xOffset = Math.sin(jumpProgress * Math.PI) * 12; // Increased from 8 to 12
          
          // Update character position with both Y position and X offset
          characterRef.current.style.transform = `translateY(${playerY}px) translateX(${xOffset}px)`;
        } else {
          // Reset transform when not jumping
          characterRef.current.style.transform = `translateY(${playerY}px)`;
          // Ensure top property is also set for consistent positioning
          characterRef.current.style.top = '0px';
        }
        
        // Update character state
        if (!onPlatform && !isJumping && !justLanded) {
          characterRef.current.classList.remove('running', 'jumping', 'landing');
          characterRef.current.classList.add('falling');
        }
      }
      
      // Reset justLanded flag
      if (justLanded) {
        justLanded = false;
      }
      
      // Check game over
      if (playerY > 300) {
        endGame();
        return;
      }
      
      // Update score - slower score accumulation
      currentScore += 0.03; // Further reduced from 0.05
      setScore(Math.floor(currentScore));
      if (scoreRef.current) {
        scoreRef.current.textContent = `Score: ${Math.floor(currentScore)}`;
      }
      
      // Continue game loop
      animationFrameId = requestAnimationFrame(updateGame);
    };
    
    // Game over function with high score update
    const endGame = () => {
      gameActive = false;
      
      // Update high score if needed
      if (Math.floor(currentScore) > currentHighScore) {
        currentHighScore = Math.floor(currentScore);
        localStorage.setItem('islandHopperHighScore', currentHighScore.toString());
        setHighScore(currentHighScore);
      }
      
      setGameOver(true);
    };
    
    // Handle jump - adjusted for lower height
    const handleJump = () => {
      console.log("Jump function called, game active:", gameActive, "isJumping:", isJumping);
      
      if (!gameActive) return;
      if (isJumping) return;
      
      // Add a slight cooldown between jumps to prevent accidental double jumps
      const now = Date.now();
      if (now - lastJumpTime < 300) return; // 300ms cooldown
      lastJumpTime = now;
      
      console.log("Jump conditions passed - executing jump!");
      isJumping = true;
      
      // ADJUSTED: Enhanced jump with better height
      const jumpMultiplier = 0.85 + (currentGameSpeed / 10); // Increased from 0.8 + speed/10
      playerVelocityY = jumpForce * jumpMultiplier;
      
      // ADDED: Small initial horizontal boost to help clear gaps
      platforms.forEach(platform => {
        const currentX = parseFloat(platform.style.left);
        platform.style.left = `${currentX - 5}px`; // Initial push to help clear gaps
      });
      
      // Add visual feedback for jumping
      const character = characterRef.current;
      if (character) {
        character.classList.remove('running', 'falling', 'landing');
        character.classList.add('jumping');
        
        // Flash effect to show jump was triggered
        character.classList.add('jump-flash');
        setTimeout(() => {
          if (character && character.classList.contains('jump-flash')) {
            character.classList.remove('jump-flash');
          }
        }, 200);
      }
    };
    
    // Improved, more direct click handler
    const setupGameControls = () => {
      if (!gameRef.current) return;
      
      // Create a direct function reference we can use for both adding and removing
      function clickHandler(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Game area clicked", { gameActive, isJumping, gameOver, gameStarted });
        
        if (gameOver || !gameStarted) {
          startGame();
        } else {
          // Force jump directly
          handleJump();
        }
      }
      
      // Type assertion for TypeScript
      const handler = clickHandler as EventListener;
      
      // Clean up any possible existing listeners
      if (gameRef.current) {
        gameRef.current.removeEventListener('click', handler);
        gameRef.current.removeEventListener('touchstart', handler);
        
        // Add fresh listeners with a direct reference
        console.log("Adding event listeners to game element");
        gameRef.current.addEventListener('click', handler);
        gameRef.current.addEventListener('touchstart', handler);
      }
      
      // Direct button for debugging/testing
      const jumpBtn = document.createElement('button');
      jumpBtn.textContent = "JUMP";
      jumpBtn.style.position = 'absolute';
      jumpBtn.style.bottom = '10px';
      jumpBtn.style.right = '10px';
      jumpBtn.style.zIndex = '100';
      jumpBtn.style.padding = '5px 10px';
      jumpBtn.style.background = 'rgba(0,0,0,0.5)';
      jumpBtn.style.color = 'white';
      jumpBtn.style.border = 'none';
      jumpBtn.style.borderRadius = '4px';
      jumpBtn.style.cursor = 'pointer';
      jumpBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Jump button clicked");
        handleJump();
      };
      
      if (gameRef.current) {
        gameRef.current.appendChild(jumpBtn);
      }
      
      // Return cleanup function
      return () => {
        if (gameRef.current) {
          console.log("Removing event listeners");
          gameRef.current.removeEventListener('click', handler);
          gameRef.current.removeEventListener('touchstart', handler);
          
          // Remove jump button
          if (jumpBtn.parentNode === gameRef.current) {
            gameRef.current.removeChild(jumpBtn);
          }
        }
      };
    };
    
    // Start game function with slightly higher initial speed
    const startGame = () => {
      if (gameActive) return;
      
      console.log("Starting game");
      
      // Reset game state with slightly higher initial speed
      gameActive = true;
      currentGameSpeed = baseGameSpeed * 1.1; // Start with 10% more speed
      playerY = 150;
      playerVelocityY = 0;
      isJumping = false;
      justLanded = false;
      currentScore = 0;
      
      // Initialize character
      if (characterRef.current) {
        characterRef.current.style.top = '0px';
        characterRef.current.style.transform = `translateY(${playerY}px)`;
        characterRef.current.classList.remove('jumping', 'falling', 'landing');
        characterRef.current.classList.add('running');
      }
      
      // Initialize platforms and clouds
      initPlatforms();
      initClouds();
      
      // Start game loop with requestAnimationFrame
      lastJumpTime = Date.now();
      console.log("Game active set to:", gameActive);
      animationFrameId = requestAnimationFrame(updateGame);
      
      // Update UI state
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
    };
    
    // Set up game controls with a slight delay
    const cleanupControls = setupGameControls();
    
    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        console.log("Space key pressed");
        handleJump();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Intersection observer to start/pause game
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!gameActive && !gameOver) {
            startGame();
          }
        } else {
          gameActive = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        }
      },
      { threshold: 0.5 }
    );
    
    if (gameRef.current) {
      observer.observe(gameRef.current);
    }
    
    // Cleanup
    return () => {
      gameActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (cleanupControls) {
        cleanupControls();
      }
      
      // Remove keyboard listener
      window.removeEventListener('keydown', handleKeyDown);
      
      observer.disconnect();
    };
  }, []);
  
  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills Break</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a short break and play this mini-game! Click the jump button in the game area or press SPACE to jump between islands.
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-primary/20" />
        </div>
        
        <div 
          ref={gameRef}
          className="mx-auto relative overflow-hidden rounded-lg border-2 border-primary/20 shadow-xl cursor-pointer" 
          style={{ width: '800px', height: '300px', maxWidth: '100%' }}
        >
          {/* Game canvas */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-500/20">
            {/* Clouds container */}
            <div ref={cloudsRef} className="absolute inset-0 z-10"></div>
            
            {/* Platforms container */}
            <div ref={platformsRef} className="absolute inset-0 z-20"></div>
            
            {/* Character */}
            <div 
              ref={characterRef}
              className="absolute game-character running z-30" 
              style={{ 
                left: '50px', 
                top: '150px',
                width: '32px',
                height: '32px'
              }}
            >
              {/* 8-bit style character */}
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary rounded-md character-body"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-1 left-2 right-2 h-1 bg-white rounded-full character-mouth"></div>
              </div>
            </div>
            
            {/* Game UI - Score and High Score */}
            <div className="absolute top-4 left-0 right-0 flex justify-between px-4 z-40">
              <div 
                ref={scoreRef}
                className="bg-black/50 px-3 py-1 rounded-full text-white text-sm"
              >
                Score: 0
              </div>
              <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                High Score: {highScore}
              </div>
            </div>
            
            {/* Game over overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
                <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-white mb-2">Your score: {score}</p>
                {score >= highScore && (
                  <p className="text-yellow-400 font-bold mb-4">New High Score!</p>
                )}
                {score < highScore && (
                  <p className="text-white mb-4">High Score: {highScore}</p>
                )}
                <Button onClick={() => gameRef.current?.click()}>Try Again</Button>
                <p className="text-white/70 text-xs mt-4">Click to restart</p>
              </div>
            )}
            
            {/* Start game overlay */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
                <h3 className="text-2xl font-bold text-white mb-2">Island Hopper</h3>
                <p className="text-white mb-2">Jump between islands as far as you can!</p>
                {highScore > 0 && (
                  <p className="text-yellow-400 font-bold mb-4">High Score: {highScore}</p>
                )}
                <Button onClick={() => gameRef.current?.click()}>Start Game</Button>
                <p className="text-white/70 text-xs mt-4">Click to jump</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Game gets faster as your score increases. Keep scrolling to continue through the portfolio.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .game-character.running .character-body {
          animation: characterRun 0.4s infinite;
        }
        
        .game-character.jumping .character-body {
          animation: characterJump 0.4s;
          border-radius: 0.5rem 0.5rem 0.25rem 0.25rem;
        }
        
        .game-character.jumping .character-mouth {
          transform: scale(0.75);
        }
        
        .game-character.falling .character-body {
          border-radius: 0.25rem 0.25rem 0.5rem 0.5rem;
        }
        
        .game-character.landing .character-body {
          animation: characterSplash 0.3s;
          transform-origin: bottom center;
        }
        
        .jump-flash {
          animation: flash 0.2s;
        }
        
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes characterRun {
          0% { transform: translateY(0); }
          50% { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes characterJump {
          0% { transform: translateY(0) translateX(0) rotate(0); }
          25% { transform: translateY(-9px) translateX(2px) rotate(3deg); }
          50% { transform: translateY(-13px) translateX(4px) rotate(5deg); }
          75% { transform: translateY(-7px) translateX(3px) rotate(3deg); }
          100% { transform: translateY(0) translateX(0) rotate(0); }
        }
        
        @keyframes characterSplash {
          0% { transform: scaleY(1) scaleX(1); }
          30% { transform: scaleY(0.6) scaleX(1.4); }
          60% { transform: scaleY(1.1) scaleX(0.9); }
          100% { transform: scaleY(1) scaleX(1); }
        }
        
        .game-cloud {
          pointer-events: none;
        }
      `}</style>
    </section>
  );
} 