(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[916],{5194:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/games/word-scramble",function(){return s(8015)}])},8015:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d});var n=s(4848),l=s(6715),i=s(6540),r=s(9381),a=s(6297);let o={easy:{minLength:4,maxLength:6,timeLimit:60},medium:{minLength:6,maxLength:8,timeLimit:45},hard:{minLength:8,maxLength:12,timeLimit:30}},c={easy:[{word:"LETTER",hint:"Written communication"},{word:"GAME",hint:"Play for fun"},{word:"BOOK",hint:"Reading material"},{word:"PHONE",hint:"Communication device"},{word:"WATER",hint:"Essential liquid"},{word:"SMILE",hint:"Happy expression"},{word:"CHAIR",hint:"Sitting furniture"},{word:"TABLE",hint:"Flat surface furniture"},{word:"LIGHT",hint:"Illumination source"},{word:"MUSIC",hint:"Melodic sounds"}],medium:[{word:"COMPUTER",hint:"Electronic device"},{word:"KEYBOARD",hint:"Input device"},{word:"PROGRAM",hint:"Software instructions"},{word:"NETWORK",hint:"Connected systems"},{word:"BROWSER",hint:"Web explorer"},{word:"SCREEN",hint:"Display surface"},{word:"WINDOW",hint:"View opening"},{word:"PICTURE",hint:"Visual representation"},{word:"GARDEN",hint:"Plant growing area"},{word:"LIBRARY",hint:"Book collection place"}],hard:[{word:"ALGORITHM",hint:"Problem-solving steps"},{word:"DEVELOPER",hint:"Software creator"},{word:"INTERFACE",hint:"Connection point"},{word:"DATABASE",hint:"Information storage"},{word:"FRAMEWORK",hint:"Development structure"},{word:"JAVASCRIPT",hint:"Web programming language"},{word:"BUTTERFLY",hint:"Colorful flying insect"},{word:"CHEMISTRY",hint:"Study of substances"},{word:"TELESCOPE",hint:"Star viewing device"},{word:"ADVENTURE",hint:"Exciting journey"}]};function d(){let e=(0,l.useRouter)(),[t,s]=(0,i.useState)("menu"),[d,x]=(0,i.useState)("easy"),[u,m]=(0,i.useState)(""),[p,h]=(0,i.useState)(""),[g,b]=(0,i.useState)(""),[f,j]=(0,i.useState)(""),[w,v]=(0,i.useState)(0),[N,y]=(0,i.useState)(0),[k,S]=(0,i.useState)(0),[E,C]=(0,i.useState)(!1),[L,M]=(0,i.useState)(new Set),[R,T]=(0,i.useState)(!1),[A,P]=(0,i.useState)(!1),[I,W]=(0,i.useState)(0),[O,B]=(0,i.useState)(0),[H,_]=(0,i.useState)(0),[G,D]=(0,i.useState)(0),[U,F]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let e=localStorage.getItem("wordScrambleHighScore");e&&S(parseInt(e))},[]);let V=e=>{let t=e.split("");for(let e=t.length-1;e>0;e--){let s=Math.floor(Math.random()*(e+1));[t[e],t[s]]=[t[s],t[e]]}let s=t.join("");return s===e?V(e):s},z=(0,i.useCallback)(()=>{let e=c[d].filter(e=>{let{word:t}=e;return!L.has(t)});if(0===e.length)return F(!0),null;let t=Math.floor(Math.random()*e.length);return e[t]},[d,L]),K=(0,i.useCallback)(()=>{M(new Set);let e=z();if(!e)return;let{word:t,hint:n}=e;m(t),h(V(t)),b(n),j(""),C(!1),v(o[d].timeLimit),s("playing"),M(e=>new Set([...e,t])),W(e=>e+1)},[d,z]);(0,i.useEffect)(()=>{if("playing"===t&&w>0&&!R){let e=setInterval(()=>{v(e=>e<=1?(s("failed"),0):e-1)},1e3);return()=>clearInterval(e)}},[t,w,R]);let Y=(0,i.useCallback)(e=>{"Escape"===e.key?"playing"===t&&(T(e=>!e),P(e=>!e)):"Enter"===e.key&&"success"===t&&K()},[t,K]);return(0,i.useEffect)(()=>(window.addEventListener("keydown",Y),()=>window.removeEventListener("keydown",Y)),[Y]),(0,n.jsxs)("div",{className:"min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-8",children:[(0,n.jsx)("div",{className:"fixed top-4 left-4",children:(0,n.jsxs)("button",{onClick:()=>e.push("/"),className:"px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg    hover:bg-white/20 transition-all flex items-center gap-2",children:[(0,n.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M10 19l-7-7m0 0l7-7m-7 7h18"})}),"Back"]})}),"playing"===t&&(0,n.jsxs)("div",{className:"fixed top-4 right-4 flex items-center gap-4",children:[(0,n.jsx)("div",{className:"text-sm text-purple-200",children:"Press ESC to pause"}),(0,n.jsx)("button",{onClick:()=>{T(!0),P(!0)},className:"p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors",title:"Game Menu",children:(0,n.jsx)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"})})})]}),(0,n.jsxs)("div",{className:"max-w-2xl mx-auto",children:[(0,n.jsxs)("div",{className:"text-center mb-8",children:[(0,n.jsx)("h1",{className:"text-4xl font-bold mb-2",children:"Word Scramble"}),(0,n.jsx)("p",{className:"text-purple-200",children:"Unscramble the word before time runs out!"})]}),"menu"===t&&(0,n.jsxs)("div",{className:"space-y-6 text-center",children:[(0,n.jsxs)("div",{className:"space-y-4",children:[(0,n.jsx)("h2",{className:"text-2xl font-bold",children:"Select Difficulty"}),(0,n.jsx)("div",{className:"flex justify-center gap-4",children:Object.keys(o).map(e=>(0,n.jsx)("button",{onClick:()=>{x(e),K()},className:"px-6 py-3 rounded-lg text-lg font-semibold\n                      ".concat("easy"===e?"bg-green-500 hover:bg-green-600":"medium"===e?"bg-yellow-500 hover:bg-yellow-600":"bg-red-500 hover:bg-red-600","\n                      transition-all transform hover:scale-105"),children:e.charAt(0).toUpperCase()+e.slice(1)},e))})]}),k>0&&(0,n.jsxs)("p",{className:"text-purple-200",children:["High Score: ",k]})]}),("playing"===t||"success"===t||"failed"===t)&&(0,n.jsxs)("div",{className:"space-y-8",children:[(0,n.jsxs)("div",{className:"flex justify-between items-center",children:[(0,n.jsxs)("div",{className:"text-xl",children:["Score: ",N]}),(0,n.jsxs)("div",{className:"text-xl font-bold ".concat(w<=10?"text-red-500":"text-white"),children:["Time: ",w,"s"]})]}),(0,n.jsxs)("div",{className:"bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6",children:[(0,n.jsx)("div",{className:"flex justify-center gap-2",children:p.split("").map((e,t)=>(0,n.jsx)(r.P.div,{initial:{scale:0},animate:{scale:1},transition:{delay:.1*t},className:"w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center   text-2xl font-bold",children:e},t))}),(0,n.jsx)("input",{type:"text",value:f,onChange:e=>{let t=e.target.value.toUpperCase();if(j(t),t===u){let e=o[d].timeLimit-w;D(t=>t+e),B(e=>e+1),_(t=>(G+e)/(O+1));let t=N+Math.floor(w*("hard"===d?3:"medium"===d?2:1));y(t),t>k&&(S(t),localStorage.setItem("wordScrambleHighScore",t.toString())),s("success")}},disabled:"playing"!==t||R,className:"w-full bg-white/20 rounded-lg px-4 py-3 text-center text-2xl   focus:outline-none focus:ring-2 focus:ring-purple-500   disabled:opacity-50 disabled:cursor-not-allowed",placeholder:"Type your answer...",autoFocus:!0}),(0,n.jsxs)("div",{className:"text-center",children:[!E&&"playing"===t&&(0,n.jsx)("button",{onClick:()=>C(!0),className:"text-purple-300 hover:text-purple-200 transition-colors",children:"Show Hint"}),E&&(0,n.jsxs)("p",{className:"text-purple-300",children:["Hint: ",g]})]})]}),(0,n.jsxs)(a.N,{mode:"wait",children:["success"===t&&(0,n.jsxs)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"text-center",children:[(0,n.jsx)("p",{className:"text-green-400 text-2xl font-bold mb-4",children:"Correct!"}),(0,n.jsx)("button",{onClick:K,className:"px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all",children:"Next Word"})]}),"failed"===t&&(0,n.jsxs)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"text-center",children:[(0,n.jsx)("p",{className:"text-red-400 text-2xl font-bold mb-2",children:"Time's Up!"}),(0,n.jsxs)("p",{className:"text-purple-200 mb-4",children:["The word was: ",u]}),(0,n.jsx)("button",{onClick:K,className:"px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all",children:"Try Again"})]})]})]}),(0,n.jsx)(a.N,{mode:"wait",children:A&&(0,n.jsx)(()=>(0,n.jsx)(r.P.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2,ease:"easeInOut"},className:"fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]",style:{pointerEvents:"auto"},children:(0,n.jsxs)(r.P.div,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},transition:{duration:.2,ease:"easeInOut"},className:"bg-purple-900 rounded-xl p-8 max-w-md w-full",onClick:e=>e.stopPropagation(),children:[(0,n.jsx)("h2",{className:"text-3xl font-bold text-center mb-6",children:R?"Game Paused":"Menu"}),(0,n.jsxs)("div",{className:"space-y-4",children:["playing"===t&&(0,n.jsxs)("button",{onClick:()=>{T(!1),P(!1)},className:"w-full px-6 py-4 bg-green-600 hover:bg-green-500    rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2",children:[(0,n.jsxs)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"}),(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})]}),"Continue Game"]}),(0,n.jsxs)("button",{onClick:()=>{M(new Set),y(0),T(!1),P(!1),K()},className:"w-full px-6 py-4 bg-yellow-600 hover:bg-yellow-500    rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2",children:[(0,n.jsx)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})}),"Restart Game"]}),(0,n.jsxs)("button",{onClick:()=>{s("menu"),M(new Set),y(0),T(!1),P(!1)},className:"w-full px-6 py-4 bg-blue-600 hover:bg-blue-500    rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2",children:[(0,n.jsx)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})}),"New Game"]}),(0,n.jsxs)("button",{onClick:()=>e.push("/"),className:"w-full px-6 py-4 bg-red-600 hover:bg-red-500    rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2",children:[(0,n.jsx)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})}),"Quit to Menu"]})]}),(0,n.jsxs)("div",{className:"mt-6 text-center text-sm text-purple-300",children:["Press ESC to ",R?"resume":"pause"," game"]})]})}),{})}),(0,n.jsx)(a.N,{mode:"wait",children:U&&(0,n.jsx)(()=>(0,n.jsx)(r.P.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},className:"fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]",children:(0,n.jsxs)("div",{className:"bg-purple-900 rounded-xl p-8 max-w-md w-full",children:[(0,n.jsx)("h2",{className:"text-3xl font-bold text-center mb-6",children:"Game Complete!"}),(0,n.jsxs)("div",{className:"space-y-4",children:[(0,n.jsxs)("div",{className:"bg-purple-800/50 rounded-lg p-4",children:[(0,n.jsx)("div",{className:"text-4xl font-bold text-center text-purple-200 mb-2",children:N}),(0,n.jsx)("div",{className:"text-center text-purple-300",children:"Final Score"})]}),(0,n.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,n.jsxs)("div",{className:"bg-purple-800/50 rounded-lg p-4",children:[(0,n.jsx)("div",{className:"text-2xl font-bold text-center mb-1",children:O}),(0,n.jsx)("div",{className:"text-sm text-center text-purple-300",children:"Words Correct"})]}),(0,n.jsxs)("div",{className:"bg-purple-800/50 rounded-lg p-4",children:[(0,n.jsxs)("div",{className:"text-2xl font-bold text-center mb-1",children:[Math.round(H),"s"]}),(0,n.jsx)("div",{className:"text-sm text-center text-purple-300",children:"Avg. Time per Word"})]}),(0,n.jsxs)("div",{className:"bg-purple-800/50 rounded-lg p-4",children:[(0,n.jsx)("div",{className:"text-2xl font-bold text-center mb-1",children:I}),(0,n.jsx)("div",{className:"text-sm text-center text-purple-300",children:"Total Words"})]}),(0,n.jsxs)("div",{className:"bg-purple-800/50 rounded-lg p-4",children:[(0,n.jsxs)("div",{className:"text-2xl font-bold text-center mb-1",children:[Math.round(O/I*100),"%"]}),(0,n.jsx)("div",{className:"text-sm text-center text-purple-300",children:"Accuracy"})]})]}),N>k&&(0,n.jsx)("div",{className:"text-yellow-400 text-center font-bold mt-4",children:"New High Score!"}),(0,n.jsxs)("div",{className:"flex gap-4 mt-8",children:[(0,n.jsx)("button",{onClick:()=>{F(!1),s("menu"),M(new Set),W(0),B(0),D(0),y(0)},className:"flex-1 px-6 py-3 bg-purple-700 hover:bg-purple-600    rounded-lg transition-colors",children:"Play Again"}),(0,n.jsx)("button",{onClick:()=>e.push("/"),className:"flex-1 px-6 py-3 bg-purple-700/50 hover:bg-purple-600/50    rounded-lg transition-colors",children:"Exit"})]})]})]})}),{})})]})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[783,636,593,792],()=>t(5194)),_N_E=e.O()}]);