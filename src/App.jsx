import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Trophy, Target } from 'lucide-react';

const App = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState([]);
  const [particles, setParticles] = useState([]);
  const [theme, setTheme] = useState('neon');
  const intervalRef = useRef(null);
  const particleId = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
        if (Math.random() < 0.1) {
          addParticle();
        }
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const addParticle = () => {
    const newParticle = {
      id: particleId.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      life: 1,
    };
    setParticles(prev => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    for(let i = 0; i < 5; i++) {
      setTimeout(() => addParticle(), i * 100);
    }
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLapTimes([]);
    setParticles([]);
  };

  const handleLap = () => {
    if (isRunning && time > 0) {
      setLapTimes(prev => [...prev, time]);
      for(let i = 0; i < 8; i++) {
        setTimeout(() => addParticle(), i * 50);
      }
    }
  };

  const needleRotation = ((time % 60000) / 60000) * 360;
  const secondsRotation = ((time % 1000) / 1000) * 360;

  const themes = {
    neon: {
      bg: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
      primary: '#22d3ee',
      secondary: '#a855f7',
      accent: '#10b981',
      glow: '#06b6d4'
    },
    electric: {
      bg: 'linear-gradient(135deg, #064e3b, #047857, #0d9488)',
      primary: '#22c55e',
      secondary: '#84cc16',
      accent: '#a3e635',
      glow: '#22c55e'
    },
    ice: {
      bg: 'linear-gradient(135deg, #1e3a8a, #0891b2, #0d9488)',
      primary: '#06b6d4',
      secondary: '#3b82f6',
      accent: '#22d3ee',
      glow: '#3b82f6'
    },
    cosmic: {
      bg: 'linear-gradient(135deg, #312e81, #7c3aed, #be185d)',
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#c084fc',
      glow: '#a855f7'
    }
  };

  const currentTheme = themes[theme];

  // Get fastest and slowest lap
  const fastestLap = lapTimes.length > 1 ? Math.min(...lapTimes.slice(1).map((lap, i) => lap - lapTimes[i])) : null;
  const slowestLap = lapTimes.length > 1 ? Math.max(...lapTimes.slice(1).map((lap, i) => lap - lapTimes[i])) : null;

  const styles = {
    container: {
      minHeight: '100vh',
      background: currentTheme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    },
    particle: {
      position: 'absolute',
      width: '8px',
      height: '8px',
      backgroundColor: currentTheme.glow,
      borderRadius: '50%',
      animation: 'float 2s ease-out forwards',
      opacity: 0.7
    },
    backgroundBlob: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'pulse 2s infinite'
    },
    themeSelector: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '8px'
    },
    themeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '2px solid #9ca3af',
      cursor: 'pointer',
      transition: 'all 0.3s',
      transform: 'scale(1)'
    },
    themeButtonActive: {
      border: '2px solid white',
      transform: 'scale(1.1)'
    },
    mainCard: {
      position: 'relative',
      zIndex: 10,
      background: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(24px)',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '512px',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    headerIcon: {
      padding: '8px',
      borderRadius: '50%',
      background: `linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
      animation: 'spin 3s linear infinite'
    },
    title: {
  fontSize: '2.25rem',
  fontWeight: 'bold',
  color: currentTheme.accent,   // sirf ek color use hoga
  textShadow: `0 0 20px ${currentTheme.glow}, 0 0 40px ${currentTheme.glow}`,
  margin: 0,
  animation: 'pulse 2s infinite'
},


    subtitle: {
      color: '#d1d5db',
      fontSize: '14px',
      animation: 'fadeIn 1s ease-out'
    },
    stopwatchContainer: {
      position: 'relative',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'center'
    },
    stopwatchOuter: {
      width: '288px',
      height: '288px',
      margin: '0 auto',
      borderRadius: '50%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      border: '4px solid transparent',
      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
      padding: '4px',
      position: 'relative'
    },
    stopwatchInner: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '50%',
      boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3)',
      position: 'relative'
    },
    marker: {
      position: 'absolute',
      backgroundColor: currentTheme.accent,
      borderRadius: '2px',
      transformOrigin: '50% 130px'
    },
    number: {
      position: 'absolute',
      color: currentTheme.accent,
      fontWeight: 'bold',
      fontSize: '20px',
      top: '25px',
      left: '50%',
      transformOrigin: '50% 125px'
    },
    digitalDisplay: {
  position: 'absolute',
  bottom: '48px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.95)',
  borderRadius: '8px',
  padding: '8px 12px',  // reduced padding
  minWidth: '120px',    // fixed min width so text fits nicely
  textAlign: 'center',
  border: `2px solid ${currentTheme.accent}`,
  boxShadow: `0 0 30px ${currentTheme.glow}, 0 25px 50px rgba(0,0,0,0.5)`,
  backdropFilter: 'blur(4px)'
},

    digitalTime: {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: currentTheme.accent,
      fontWeight: 'bold',
      textShadow: `0 0 20px ${currentTheme.glow}`,
      letterSpacing: '2px',
      filter: isRunning ? `drop-shadow(0 0 8px ${currentTheme.accent})` : 'none'
    },
    secondaryNeedle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: 'bottom',
      background: `linear-gradient(to top, ${currentTheme.primary}, ${currentTheme.secondary})`,
      borderRadius: '2px',
      width: '2px',
      height: '60px',
      transform: `translate(-50%, -100%) rotate(${secondsRotation}deg)`,
      transition: 'transform 0.075s ease-out',
      opacity: 0.6
    },
    mainNeedle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: 'bottom',
      background: `linear-gradient(to top, ${currentTheme.primary}, ${currentTheme.secondary})`,
      borderRadius: '2px',
      width: '4px',
      height: '90px',
      transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
      transition: 'transform 0.075s ease-out',
      boxShadow: `0 0 20px ${currentTheme.glow}`
    },
    needleTip: {
      position: 'absolute',
      top: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '12px',
      height: '12px',
      backgroundColor: currentTheme.accent,
      borderRadius: '50%',
      boxShadow: `0 0 10px ${currentTheme.glow}`
    },
    centerHub: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '24px',
      height: '24px',
      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: `0 0 15px ${currentTheme.glow}`
    },
    runningIndicator: {
      position: 'absolute',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: currentTheme.glow + '20',
      padding: '4px 12px',
      borderRadius: '20px'
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '24px'
    },
    button: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      borderRadius: '50px',
      fontWeight: 'bold',
      fontSize: '18px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      transform: 'scale(1)'
    },
    buttonHover: {
      transform: 'scale(1.05)'
    },
    startButton: {
      background: isRunning ? 'linear-gradient(45deg, #ef4444, #dc2626)' : `linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
      color: 'white',
      boxShadow: isRunning ? '0 10px 30px rgba(239, 68, 68, 0.5)' : `0 10px 30px ${currentTheme.glow}80`
    },
    resetButton: {
      background: 'linear-gradient(45deg, #6b7280, #4b5563)',
      color: 'white',
      boxShadow: '0 10px 30px rgba(107, 114, 128, 0.3)'
    },
    lapButton: {
      padding: '12px 40px',
      borderRadius: '50px',
      fontWeight: 'bold',
      background: `linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      transform: 'scale(1)',
      boxShadow: `0 10px 30px ${currentTheme.glow}40`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: '0 auto 24px'
    },
    lapButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    },
    lapContainer: {
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    lapHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    lapTitle: {
      color: currentTheme.accent,
      fontWeight: 'bold',
      fontSize: '18px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    statCard: {
      borderRadius: '8px',
      padding: '8px',
      textAlign: 'center'
    },
    fastestStat: {
      background: 'rgba(34, 197, 94, 0.2)'
    },
    slowestStat: {
      background: 'rgba(239, 68, 68, 0.2)'
    },
    statLabel: {
      fontSize: '12px',
      fontWeight: '600'
    },
    statValue: {
      fontSize: '14px',
      fontFamily: 'monospace'
    },
    lapList: {
      maxHeight: '160px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    lapItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.05)',
      transition: 'all 0.3s'
    },
    lapItemFastest: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.5)'
    },
    lapItemSlowest: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.5)'
    },
    lapNumber: {
      color: currentTheme.accent,
      fontWeight: 'bold'
    },
    lapTime: {
      color: currentTheme.accent,
      fontFamily: 'monospace',
      fontSize: '14px'
    },
    lapDuration: {
      fontSize: '12px',
      fontFamily: 'monospace'
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `scale(${particle.size})`
          }}
        />
      ))}

      {/* Background Elements */}
      <div style={{...styles.backgroundBlob, top: '10%', left: '10%', width: '128px', height: '128px', backgroundColor: currentTheme.glow + '20'}} />
      <div style={{...styles.backgroundBlob, bottom: '20%', right: '15%', width: '96px', height: '96px', backgroundColor: currentTheme.accent + '20'}} />
      <div style={{...styles.backgroundBlob, top: '50%', left: '5%', width: '64px', height: '64px', backgroundColor: currentTheme.glow + '20'}} />
      <div style={{...styles.backgroundBlob, top: '10%', right: '20%', width: '80px', height: '80px', backgroundColor: currentTheme.accent + '20'}} />

      {/* Theme Selector */}
      <div style={styles.themeSelector}>
        {Object.entries(themes).map(([themeName, themeData]) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            style={{
              ...styles.themeButton,
              background: `linear-gradient(45deg, ${themeData.primary}, ${themeData.secondary})`,
              ...(theme === themeName ? styles.themeButtonActive : {})
            }}
            title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          />
        ))}
      </div>

      {/* Main Container */}
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px'}}>
            <div style={styles.headerIcon}>
              <Clock style={{width: '24px', height: '24px', color: 'white'}} />
            </div>
            <h1 style={styles.title}>QUANTUM TIMER</h1>
          </div>
          <p style={styles.subtitle}></p>
        </div>

        {/* Stopwatch Face */}
        <div style={styles.stopwatchContainer}>
          <div style={styles.stopwatchOuter}>
            <div style={styles.stopwatchInner}>
              
              {/* Hour Markers */}
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.marker,
                    width: i % 5 === 0 ? '3px' : '1px',
                    height: i % 5 === 0 ? '20px' : '10px',
                    top: i % 5 === 0 ? '8px' : '13px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 6}deg)`,
                    opacity: i % 5 === 0 ? 1 : 0.6,
                  }}
                />
              ))}

              {/* Numbers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.number,
                    transform: `translateX(-50%) rotate(${i * 30}deg)`
                  }}
                >
                  <span style={{transform: `rotate(${-i * 30}deg)`, display: 'block'}}>
                    {i === 0 ? 12 : i}
                  </span>
                </div>
              ))}
              
              {/* Digital Display */}
              <div style={styles.digitalDisplay}>
                <div style={styles.digitalTime}>
                  {formatTime(time)}
                </div>
              </div>

              {/* Secondary Needle (Seconds) */}
              <div style={styles.secondaryNeedle} />

              {/* Main Needle (Minutes) */}
              <div style={styles.mainNeedle}>
                <div style={styles.needleTip} />
              </div>

              {/* Center Hub */}
              <div style={styles.centerHub} />
              
              {/* Running Indicator */}
              {isRunning && (
                <div style={styles.runningIndicator}>
                  <Zap style={{width: '16px', height: '16px', color: currentTheme.accent, animation: 'bounce 1s infinite'}} />
                  <span style={{fontSize: '12px', color: currentTheme.accent, fontWeight: '600'}}>ACTIVE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={styles.controlsContainer}>
          <button
            onClick={handleStartPause}
            style={{...styles.button, ...styles.startButton}}
          >
            {isRunning ? <Pause style={{width: '24px', height: '24px'}} /> : <Play style={{width: '24px', height: '24px'}} />}
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          
          <button
            onClick={handleReset}
            style={{...styles.button, ...styles.resetButton}}
          >
            <RotateCcw style={{width: '24px', height: '24px'}} />
            RESET
          </button>
        </div>

        {/* Lap Button */}
        <div style={{textAlign: 'center'}}>
          <button
            onClick={handleLap}
            disabled={!isRunning || time === 0}
            style={{
              ...styles.lapButton,
              ...(!isRunning || time === 0 ? styles.lapButtonDisabled : {})
            }}
          >
            <Target style={{width: '20px', height: '20px'}} />
            LAP TIME
          </button>
        </div>

        {/* Lap Times */}
        {lapTimes.length > 0 && (
          <div style={styles.lapContainer}>
            <div style={styles.lapHeader}>
              <Trophy style={{width: '20px', height: '20px', color: currentTheme.accent}} />
              <h3 style={styles.lapTitle}>LAP RECORDS</h3>
            </div>
            
            {/* Stats */}
            {lapTimes.length > 1 && (
              <div style={styles.statsGrid}>
                <div style={{...styles.statCard, ...styles.fastestStat}}>
                  <div style={{...styles.statLabel, color: '#22c55e'}}>FASTEST</div>
                  <div style={{...styles.statValue, color: '#86efac'}}>{formatTime(fastestLap)}</div>
                </div>
                <div style={{...styles.statCard, ...styles.slowestStat}}>
                  <div style={{...styles.statLabel, color: '#ef4444'}}>SLOWEST</div>
                  <div style={{...styles.statValue, color: '#fca5a5'}}>{formatTime(slowestLap)}</div>
                </div>
              </div>
            )}

            <div style={styles.lapList}>
              {lapTimes.map((lapTime, index) => {
                const lapDuration = index === 0 ? lapTime : lapTime - lapTimes[index - 1];
                const isFastest = lapTimes.length > 1 && index > 0 && lapDuration === fastestLap;
                const isSlowest = lapTimes.length > 1 && index > 0 && lapDuration === slowestLap;
                
                return (
                  <div key={index} 
                       style={{
                         ...styles.lapItem,
                         ...(isFastest ? styles.lapItemFastest : {}),
                         ...(isSlowest ? styles.lapItemSlowest : {})
                       }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={styles.lapNumber}>#{index + 1}</span>
                      {isFastest && <span style={{color: '#22c55e', fontSize: '12px'}}>🏆 BEST</span>}
                      {isSlowest && <span style={{color: '#ef4444', fontSize: '12px'}}>🐌 SLOW</span>}
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={styles.lapTime}>{formatTime(lapTime)}</div>
                      {index > 0 && (
                        <div style={{
                          ...styles.lapDuration,
                          color: isFastest ? '#22c55e' : isSlowest ? '#ef4444' : '#9ca3af'
                        }}>
                          +{formatTime(lapDuration)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p></p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Custom scrollbar */
        *::-webkit-scrollbar {
          width: 6px;
        }
        *::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        *::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 3px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
      `}</style>
    </div>
  );
};

export default App;