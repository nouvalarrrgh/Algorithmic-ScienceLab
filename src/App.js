import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Settings, BarChart3, Info, Edit3, Shuffle } from 'lucide-react';

// --- DATA TEORI ---
const ALGO_INFO = {
  bubble: {
    name: "Bubble Sort",
    desc: "Membandingkan dua elemen bersebelahan dan menukarnya jika urutannya salah.",
    best: "O(n)",
    worst: "O(n²)",
    avg: "O(n²)",
    color: "from-pink-500 to-rose-500"
  },
  selection: {
    name: "Selection Sort",
    desc: "Mencari nilai terkecil dari bagian yang belum urut, lalu menukarnya ke posisi depan.",
    best: "O(n²)",
    worst: "O(n²)",
    avg: "O(n²)",
    color: "from-blue-500 to-cyan-500"
  },
  insertion: {
    name: "Insertion Sort",
    desc: "Membangun array yang diurutkan satu per satu dengan menggeser elemen yang lebih besar.",
    best: "O(n)",
    worst: "O(n²)",
    avg: "O(n²)",
    color: "from-purple-500 to-indigo-500"
  }
};

const App = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(25); 
  const [inputMode, setInputMode] = useState('random'); 
  const [manualInputStr, setManualInputStr] = useState("");
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [logText, setLogText] = useState("Siap memulai simulasi...");

  const sortingRef = useRef(false); 

  useEffect(() => {
    document.title = "Algorithmic Science Lab";
    const updateFavicon = () => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="%232563eb" />
          <path d="M7 7v18h18 M22 22V12 M17 22V8 M12 22v-4" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      link.href = `data:image/svg+xml,${svgIcon}`;
    };
    updateFavicon();
  }, []);

  useEffect(() => {
    if(inputMode === 'random') generateRandomArray();
    // eslint-disable-next-line
  }, [arraySize, inputMode]);

  const generateRandomArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 5);
    setArray(newArray);
    resetVisuals(`Mode Random: ${arraySize} data baru.`);
  };

  const handleManualInput = (e) => {
    const val = e.target.value;
    setManualInputStr(val);
    const numbers = val.split(',').map(str => parseInt(str.trim())).filter(num => !isNaN(num) && num >= 0 && num <= 100);
    if (numbers.length > 0) {
      setArray(numbers);
      resetVisuals(`Mode Manual: ${numbers.length} data.`);
    }
  };

  const resetVisuals = (msg) => {
    setSortedIndices([]);
    setComparing([]);
    setSwapping([]);
    setLogText(msg || "Siap.");
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const getDelay = () => Math.max(10, 450 - (speed * 4));

  const bubbleSort = async () => {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) return; 
        setComparing([j, j + 1]);
        setLogText(`Comparing: ${arr[j]} vs ${arr[j+1]}`);
        await sleep(getDelay());

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          setLogText(`SWAP! ${arr[j]} > ${arr[j+1]}`);
          await sleep(getDelay());
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setSwapping([]);
        }
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
    finishSorting(n);
  };

  const selectionSort = async () => {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      setLogText(`Scan minimum dari index ${i}...`);
      for (let j = i + 1; j < n; j++) {
        if (!sortingRef.current) return;
        setComparing([minIdx, j]);
        await sleep(getDelay());
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        setLogText(`Min Found: ${arr[minIdx]}. Swap ke depan.`);
        await sleep(getDelay());
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        setSwapping([]);
      }
      setSortedIndices(prev => [...prev, i]);
    }
    finishSorting(n);
  };

  const insertionSort = async () => {
    let arr = [...array];
    let n = arr.length;
    setSortedIndices([0]);
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setLogText(`Insert ${key} ke kiri...`);
      setSwapping([i]); 
      await sleep(getDelay());
      while (j >= 0 && arr[j] > key) {
        if (!sortingRef.current) return;
        setComparing([j, j + 1]);
        await sleep(getDelay());
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j = j - 1;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(Array.from({length: i + 1}, (_, k) => k));
    }
    finishSorting(n);
  };

  const finishSorting = (n) => {
    setComparing([]);
    setSwapping([]);
    setLogText("PROSES SELESAI. Data terurut sempurna.");
    setSortedIndices(Array.from({length: n}, (_, i) => i));
    setIsSorting(false);
    sortingRef.current = false;
  };

  const handleStart = () => {
    if(array.length < 2) return alert("Data minimal 2 angka.");
    setIsSorting(true);
    sortingRef.current = true;
    if (algorithm === 'bubble') bubbleSort();
    if (algorithm === 'selection') selectionSort();
    if (algorithm === 'insertion') insertionSort();
  };

  const handleReset = () => {
    sortingRef.current = false;
    setIsSorting(false);
    setTimeout(() => {
      if(inputMode === 'random') generateRandomArray();
      else setArray([]);
      resetVisuals("Reset berhasil.");
    }, 100);
  };

  const getBarColor = (index) => {
    if (swapping.includes(index)) return 'bg-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]';
    if (comparing.includes(index)) return 'bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.8)]';
    if (sortedIndices.includes(index)) return 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]';
    return 'bg-slate-300/90';
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* --- HEADER (Lebih Tipis di Desktop) --- */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-2xl transition-all">
        {/* Ubah md:h-28 menjadi md:h-24 */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform">
                <BarChart3 className="text-white w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Algorithmic<span className="text-blue-400">Science</span>Lab
                </h1>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-[0.2em] uppercase mt-0.5 md:mt-1 hidden sm:block">
                  Enterprise Visualization Tool
                </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-right bg-slate-800/50 py-2 px-6 rounded-full border border-slate-700/50">
             <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-0.5">System Status</span>
                 <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSorting ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'}`}></span>
                    <span className={`text-sm font-mono font-bold ${isSorting ? 'text-blue-400' : 'text-slate-300'}`}>
                        {isSorting ? 'PROCESSING' : 'IDLE'}
                    </span>
                 </div>
             </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENT (Padding Desktop Dikurangi) --- */}
      {/* Ubah md:py-10 menjadi md:py-8 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8 w-full">
        
        {/* Stage Grafik (Lebih Pendek di Desktop) */}
        {/* Ubah md:h-[500px] menjadi md:h-[420px] dan md:pt-12 menjadi md:pt-10 */}
        <section className="relative w-full h-[300px] md:h-[420px] bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col p-2 pt-12 md:pt-10">
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 bg-slate-900/90 backdrop-blur px-4 py-2 md:px-6 md:py-3 rounded-xl border border-slate-600 shadow-xl max-w-[200px] md:min-w-[350px]">
            <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Real-time System Log</span>
            <div className="text-xs md:text-lg font-mono text-cyan-300 truncate font-medium"> {'>'} {logText} </div>
          </div>
          
          <div className="flex-1 flex items-end justify-center px-2 md:px-10 pb-4 gap-[2px] md:gap-[4px]">
             {array.map((value, idx) => (
              <div 
                key={idx} 
                className={`rounded-t-sm md:rounded-t-md transition-all duration-100 relative group ${getBarColor(idx)}`} 
                style={{ height: `${value * 0.85}%`, width: `${100 / array.length}%` }}
              >
                <span className={`
                    absolute left-1/2 -translate-x-1/2 
                    font-bold text-white transition-all duration-200 pointer-events-none z-20
                    ${array.length <= 20 
                        ? '-top-6 text-xs md:-top-10 md:text-xl opacity-100' 
                        : '-top-8 text-sm bg-slate-900/90 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 hidden md:block' 
                    }
                `}>
                    {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Grid Kontrol */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          
          {/* Data Config */}
          <div className="xl:col-span-4 bg-slate-800/60 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-4 md:gap-6">
             <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <Edit3 className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Data Config</h2>
             </div>
             <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1.5 rounded-xl">
                <button onClick={() => { setInputMode('random'); if(!isSorting) generateRandomArray(); }} disabled={isSorting} className={`py-3 text-xs md:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${inputMode === 'random' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}> <Shuffle size={16}/> Random </button>
                <button onClick={() => { setInputMode('manual'); setArray([]); resetVisuals("Menunggu input manual..."); }} disabled={isSorting} className={`py-3 text-xs md:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${inputMode === 'manual' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}> <Edit3 size={16}/> Manual </button>
            </div>
            {inputMode === 'random' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs md:text-sm font-semibold text-slate-400"> <span>Total Items</span> <span className="text-lg md:text-xl font-mono text-white bg-slate-700 px-3 py-1 rounded-lg">{arraySize}</span> </div>
                    <input type="range" min="5" max="50" step="5" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} disabled={isSorting} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
            ) : (
                <div className="space-y-2">
                    <textarea placeholder="Contoh: 10, 50, 90..." value={manualInputStr} onChange={handleManualInput} disabled={isSorting} className="w-full h-24 md:h-32 bg-slate-900 border-2 border-slate-700 rounded-xl p-4 text-sm md:text-lg text-white focus:outline-none focus:border-blue-500 font-mono resize-none" />
                </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-4 bg-slate-800/60 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-4 md:gap-6 order-first xl:order-none">
             <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <Settings className="text-pink-400 w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Control Panel</h2>
             </div>
             <div className="grid grid-cols-3 gap-2">
              {Object.keys(ALGO_INFO).map((key) => (
                <button key={key} onClick={() => !isSorting && setAlgorithm(key)} className={`py-2 md:py-3 text-[10px] md:text-sm font-bold rounded-lg border-2 transition-all ${algorithm === key ? `bg-slate-700 border-slate-500 text-white shadow-lg` : 'border-transparent bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`} disabled={isSorting}> {ALGO_INFO[key].name} </button>
              ))}
            </div>
            <div className="space-y-4 mt-2">
                 <div className="flex justify-between items-center text-xs md:text-sm font-semibold text-slate-400"> <span>Simulation Speed</span> <span className="text-lg md:text-xl font-mono text-pink-400 bg-slate-900 px-3 py-1 rounded-lg">{speed}%</span> </div>
                <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div className="flex gap-4 mt-auto">
                 <button onClick={handleReset} className="px-4 md:px-6 py-3 md:py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all active:scale-95 shadow-lg"> <RotateCcw size={20} className="md:w-6 md:h-6"/> </button>
                <button onClick={handleStart} disabled={isSorting || array.length < 2} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-lg font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"> <Play fill="currentColor" size={18} className="md:w-5 md:h-5"/> {isSorting ? 'RUNNING...' : 'START SIMULATION'} </button>
            </div>
          </div>

          {/* Analysis */}
          <div className="xl:col-span-4 bg-slate-800/60 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col">
             <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-4">
                <Info className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Algorithm Analysis</h2>
             </div>
             <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{ALGO_INFO[algorithm].name}</h3>
             <p className="text-sm md:text-lg text-slate-400 leading-relaxed mb-6 md:mb-8">{ALGO_INFO[algorithm].desc}</p>
             <div className="grid grid-cols-1 gap-3 md:gap-4 mt-auto">
                 <div className="flex items-center justify-between bg-slate-900 p-3 md:p-4 rounded-xl border-l-4 border-green-500 shadow-lg"> <span className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-wider">Best Case</span> <span className="text-lg md:text-2xl font-mono text-green-400 font-bold">{ALGO_INFO[algorithm].best}</span> </div>
                 <div className="flex items-center justify-between bg-slate-900 p-3 md:p-4 rounded-xl border-l-4 border-yellow-500 shadow-lg"> <span className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-wider">Average</span> <span className="text-lg md:text-2xl font-mono text-yellow-400 font-bold">{ALGO_INFO[algorithm].avg}</span> </div>
                 <div className="flex items-center justify-between bg-slate-900 p-3 md:p-4 rounded-xl border-l-4 border-red-500 shadow-lg"> <span className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-wider">Worst Case</span> <span className="text-lg md:text-2xl font-mono text-red-400 font-bold">{ALGO_INFO[algorithm].worst}</span> </div>
             </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 mt-6 md:mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-right">
            <p className="text-slate-400 text-sm flex items-center justify-center md:justify-end gap-1">
              &copy; 2026 All rights reserved by
              <a 
                href="https://nouval-arrizqy.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors ml-1"
              >
                Muhammad Nouval Ar-Rizqy
              </a>
            </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
