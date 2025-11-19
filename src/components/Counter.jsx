import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './Counter.css';

export default function Counter() {
    // Initialize from localStorage
    const [count, setCount] = useState(() => {
        const saved = localStorage.getItem('counter-count');
        return saved ? parseInt(saved) : 0;
    });
    
    const [isRunning, setIsRunning] = useState(() => {
        const saved = localStorage.getItem('counter-running');
        return saved === 'true';
    });
    
    const intervalRef = useRef(null);

    // Save to localStorage whenever count or isRunning changes
    useEffect(() => {
        localStorage.setItem('counter-count', count.toString());
        localStorage.setItem('counter-running', isRunning.toString());
    }, [count, isRunning]);

    // Auto-counting timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCount(prev => prev + 1);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handlePlay = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setCount(0);
    };

    // Format count
    const displaySeconds = String(Math.floor(count / 100)).padStart(2, '0');
    const displayCentiseconds = String(count % 100).padStart(2, '0');

    return (
        <div className="counter-container">
            <div className="background-glow"></div>

            <div className="counter-content">
                <div className="watch-wrapper">
                    <div className="outer-glow"></div>

                    <div className="watch-body">
                        <div className="watch-inner">
                            <div className="inner-glow"></div>

                            <div className="counter-display">
                                <div className="counter-seconds">{displaySeconds}</div>
                                <div className="counter-centiseconds">{displayCentiseconds}</div>
                            </div>

                            <div className="center-glow-wrapper">
                                <div className="center-glow"></div>
                            </div>
                        </div>

                        <div className="side-button side-button-left"></div>
                        <div className="side-button side-button-right"></div>
                    </div>

                    <div className="top-button"></div>
                    <div className="bottom-button"></div>
                </div>

                <div className="title-section">
                    <h1 className="main-title">COUNTER</h1>
                    <p className="subtitle">Ultimate Timer</p>
                </div>

                <div className="control-panel">
                    <div className="status-display">
                        {isRunning ? '● Timer Running' : '○ Timer Stopped'}
                    </div>

                    <div className="button-group">
                        <button 
                            onClick={handlePlay} 
                            disabled={isRunning} 
                            className={`control-button play-button ${isRunning ? 'disabled' : ''}`}
                        >
                            <Play className="button-icon" /> PLAY
                        </button>

                        <button 
                            onClick={handlePause} 
                            disabled={!isRunning} 
                            className={`control-button pause-button ${!isRunning ? 'disabled' : ''}`}
                        >
                            <Pause className="button-icon" /> PAUSE
                        </button>

                        <button 
                            onClick={handleReset} 
                            className="control-button reset-button"
                        >
                            <RotateCcw className="button-icon" /> RESET
                        </button>
                    </div>
                </div>

                <div className="info-section">
                    <div className="info-highlight"> PRECISION TIMING! </div>
                    <div className="info-text">Centiseconds Precision • Auto-Save Enabled</div>
                </div>
            </div>
        </div>
    );
}