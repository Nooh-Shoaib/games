(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[557],{2066:(e,t,l)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/games/memory",function(){return l(5042)}])},5042:(e,t,l)=>{"use strict";l.r(t),l.d(t,{default:()=>m});var a=l(4848),r=l(6715),s=l(6540);let n={easy:{pairs:6,timeLimit:60},medium:{pairs:8,timeLimit:90},hard:{pairs:12,timeLimit:120}},o=["\uD83C\uDF1F","\uD83C\uDFAE","\uD83C\uDFB2","\uD83C\uDFAF","\uD83C\uDFA8","\uD83C\uDFAD","\uD83C\uDFAA","\uD83C\uDFA2","\uD83C\uDFA0","\uD83C\uDFA1","\uD83C\uDFA9","\uD83C\uDFAC","\uD83C\uDFB5","\uD83C\uDFB8","\uD83C\uDFB9","\uD83C\uDFBA","\uD83C\uDFBB","\uD83C\uDFAD"],i={MATCH_POINTS:100,MISTAKE_PENALTY:20,TIME_BONUS_MULTIPLIER:5,MAX_TIME_BONUS:500},d=e=>{let t=o.slice(0,e);return[...t,...t].sort(()=>Math.random()-.5).map((e,t)=>({id:t,symbol:e,isFlipped:!1,isMatched:!1}))};function c(){let e=(0,r.useRouter)(),[t,l]=(0,s.useState)("menu"),[o,c]=(0,s.useState)("easy"),[m,g]=(0,s.useState)([]),[u,x]=(0,s.useState)([]),[h,b]=(0,s.useState)([]),[p,y]=(0,s.useState)(0),[f,N]=(0,s.useState)(0),[v,j]=(0,s.useState)(0),[w,S]=(0,s.useState)({easy:0,medium:0,hard:0});(0,s.useEffect)(()=>{let e=localStorage.getItem("memoryGameHighScores");e&&S(JSON.parse(e))},[]),(0,s.useEffect)(()=>{Object.values(w).some(e=>e>0)&&localStorage.setItem("memoryGameHighScores",JSON.stringify(w))},[w]);let _=e=>{c(e),x([]),b([]),y(0),N(0),j(n[e].timeLimit),l("playing")},k=e=>{if("playing"!==t||2===u.length||u.includes(e)||h.includes(e))return;let l=[...u,e];if(x(l),2===l.length){N(e=>e+1);let[e,t]=l,a=m[e],r=m[t];a.symbol===r.symbol?(b(l=>[...l,e,t]),y(e=>e+i.MATCH_POINTS),x([])):(setTimeout(()=>x([]),1e3),y(e=>Math.max(0,e-i.MISTAKE_PENALTY)))}};return(0,s.useEffect)(()=>{if("playing"===t){let{pairs:e}=n[o];g(d(e))}},[t,o]),(0,s.useEffect)(()=>{let e;return"playing"===t&&(e=setInterval(()=>{j(e=>e<=1?(l("gameOver"),0):e-1)},1e3)),()=>clearInterval(e)},[t]),(0,s.useEffect)(()=>{if(h.length===m.length&&m.length>0&&"playing"===t){let e=Math.floor((p+Math.min(v*i.TIME_BONUS_MULTIPLIER,i.MAX_TIME_BONUS))*("easy"===o?1:"medium"===o?1.2:1.5));y(e),S(t=>({...t,[o]:Math.max(t[o],e)})),l("gameOver")}},[h.length,m.length,v,o,p,t]),(0,a.jsxs)("div",{className:"min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8",children:[(0,a.jsx)("div",{className:"fixed top-4 left-4 z-20",children:(0,a.jsxs)("button",{onClick:()=>e.push("/"),className:"px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700    hover:bg-gray-700 transition-all flex items-center gap-2 font-semibold",children:[(0,a.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M10 19l-7-7m0 0l7-7m-7 7h18"})}),"Back to Games"]})}),(0,a.jsx)("h1",{className:"text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",children:"Memory Game"}),"menu"===t&&(0,a.jsxs)("div",{className:"flex flex-col items-center gap-4",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold text-gray-200 mb-4",children:"Select Difficulty"}),Object.keys(n).map(e=>(0,a.jsx)("button",{onClick:()=>_(e),className:"\n                px-8 py-4 text-xl rounded-lg font-bold\n                transition-all transform hover:scale-105\n                shadow-md hover:shadow-lg\n                ".concat("easy"===e?"bg-gradient-to-r from-green-500 to-green-600":"medium"===e?"bg-gradient-to-r from-yellow-500 to-yellow-600":"bg-gradient-to-r from-red-500 to-red-600","\n                text-white\n              "),children:e.charAt(0).toUpperCase()+e.slice(1)},e))]}),("playing"===t||"gameOver"===t)&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"flex gap-8 mb-8",children:[{label:"Score",value:p,color:"blue"},{label:"Time",value:"".concat(v,"s"),color:"red"},{label:"Moves",value:f,color:"purple"}].map(e=>{let{label:t,value:l,color:r}=e;return(0,a.jsx)("div",{className:"bg-gray-800 px-6 py-3 rounded-lg shadow-md border border-gray-700",children:(0,a.jsxs)("span",{className:"text-2xl font-bold text-gray-200",children:[t,": ",(0,a.jsx)("span",{className:"text-".concat(r,"-400"),children:l})]})},t)})}),(0,a.jsx)("div",{className:"grid gap-4 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700\n              ".concat("easy"===o?"grid-cols-4":"medium"===o?"grid-cols-4":"grid-cols-6","\n            "),children:m.map(e=>(0,a.jsx)("button",{onClick:()=>k(e.id),className:"\n                  w-20 h-20 text-4xl\n                  rounded-lg\n                  transition-all duration-300\n                  transform perspective-1000\n                  shadow-sm hover:shadow-md\n                  ".concat(u.includes(e.id)||h.includes(e.id)?"rotate-y-180 bg-gray-700 border border-gray-600":"bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105","\n                  ").concat(h.includes(e.id)?"opacity-50":"","\n                  disabled:cursor-not-allowed\n                  active:scale-95\n                "),disabled:"playing"!==t||2===u.length||h.includes(e.id),children:(u.includes(e.id)||h.includes(e.id))&&(0,a.jsx)("span",{className:"block rotate-y-180 animate-pop-in",children:e.symbol})},e.id))})]}),"gameOver"===t&&(0,a.jsx)("div",{className:"fixed inset-0 bg-black/70 flex items-center justify-center z-50",children:(0,a.jsxs)("div",{className:"bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700",children:[(0,a.jsx)("h2",{className:"text-3xl font-bold text-gray-100 mb-4",children:h.length===m.length?"You Won! \uD83C\uDF89":"Game Over! ⏰"}),(0,a.jsxs)("div",{className:"space-y-2 mb-6",children:[(0,a.jsxs)("p",{className:"text-xl text-gray-300",children:["Final Score:"," ",(0,a.jsx)("span",{className:"text-blue-400 font-bold",children:p})]}),(0,a.jsxs)("p",{className:"text-xl text-gray-300",children:["High Score:"," ",(0,a.jsx)("span",{className:"text-purple-400 font-bold",children:w[o]})]})]}),(0,a.jsxs)("div",{className:"space-x-4",children:[(0,a.jsx)("button",{onClick:()=>_(o),className:"px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500    text-white rounded-lg hover:opacity-90 transition-all   transform hover:scale-105 font-bold shadow-md",children:"Play Again"}),(0,a.jsx)("button",{onClick:()=>l("menu"),className:"px-6 py-3 bg-gray-700 text-gray-200 rounded-lg    hover:bg-gray-600 transition-all font-bold",children:"Change Difficulty"})]})]})}),"paused"===t&&(0,a.jsx)("div",{className:"fixed inset-0 bg-black/70 flex items-center justify-center z-50",children:(0,a.jsxs)("div",{className:"bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700",children:[(0,a.jsx)("h2",{className:"text-3xl font-bold text-gray-100 mb-6",children:"Game Paused"}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsx)("button",{onClick:()=>l("playing"),className:"w-full px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500    text-white rounded-lg hover:opacity-90 transition-all transform    hover:scale-105 font-bold shadow-md",children:"Resume Game"}),(0,a.jsx)("button",{onClick:()=>_(o),className:"w-full px-8 py-4 text-xl bg-gray-700 text-gray-200 rounded-lg    hover:bg-gray-600 transition-all font-bold",children:"Restart Game"}),(0,a.jsx)("button",{onClick:()=>l("menu"),className:"w-full px-8 py-4 text-xl bg-red-500 text-white rounded-lg    hover:bg-red-600 transition-all font-bold shadow-md",children:"Back to Menu"})]})]})})]})}function m(){return(0,r.useRouter)(),(0,a.jsx)(c,{})}},6715:(e,t,l)=>{e.exports=l(8440)}},e=>{var t=t=>e(e.s=t);e.O(0,[636,593,792],()=>t(2066)),_N_E=e.O()}]);