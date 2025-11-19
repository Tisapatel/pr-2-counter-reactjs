import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './Counter.css';

export default function Counter() {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    // Load saved data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const countResult = await window.storage.get('counter-count');
                if (countResult && countResult.value) {
                    setCount(parseInt(countResult.value));
                }

                const runningResult = await window.storage.get('counter-running');
                if (runningResult && runningResult.value === 'true') {
                    setIsRunning(true);
                }
            } catch (error) {
                console.log('Starting fresh', error);
            }
        };
        loadData();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        const saveData = async () => {
            try {
                await window.storage.set('counter-count', count.toString());
                await window.storage.set('counter-running', isRunning.toString());
            } catch (error) {
                console.error('Failed to save:', error);
            }
        };
        saveData();
    }, [count, isRunning]);

    // Auto-counting timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCount(prev => prev + 1);
            }, 10); // 10ms = centiseconds
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

    // Format count for display (seconds.centiseconds)
    const displaySeconds = String(Math.floor(count / 100)).padStart(2, '0');
    const displayCentiseconds = String(count % 100).padStart(2, '0');

    return (
        <div className="counter-container">
            {/* Background glow */}
            <div className="background-glow"></div>

            <div className="counter-content">
                {/* Main Watch */}
                <div className="watch-wrapper">
                    {/* Outer glow effect */}
                    <div className="outer-glow"></div>

                    {/* Watch body */}
                    <div className="watch-body">

                        {/* Inner circle */}
                        <div className="watch-inner">

                            {/* Green glow background */}
                            <div className="inner-glow"></div>

                            {/* Counter Display */}
                            <div className="counter-display">
                                <div className="counter-seconds">{displaySeconds}</div>
                                <div className="counter-centiseconds">{displayCentiseconds}</div>
                            </div>

                            {/* Pulsing center glow */}
                            <div className="center-glow-wrapper">
                                <div className="center-glow"></div>
                            </div>
                        </div>

                        {/* Side buttons */}
                        <div className="side-button side-button-left"></div>
                        <div className="side-button side-button-right"></div>
                    </div>

                    {/* Top crown button */}
                    <div className="top-button"></div>

                    {/* Bottom button */}
                    <div className="bottom-button"></div>
                </div>

                {/* Title Text */}
                <div className="title-section">
                    <h1 className="main-title">COUNTER</h1>
                    <p className="subtitle">Ultimate Timer</p>
                </div>

                {/* Control Panel */}
                <div className="control-panel">

                    {/* Status Display */}
                    <div className="status-display">
                        {isRunning ? '● Timer Running' : '○ Timer Stopped'}
                    </div>

                    {/* Control Buttons */}
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

                {/* Info */}
                <div className="info-section">
                    <div className="info-highlight">⚡ PRECISION TIMING! ⚡</div>
                    <div className="info-text">Centiseconds Precision • Auto-Save Enabled</div>
                </div>
            </div>
        </div>
    );
}