(function(){"use strict";var e={4116:function(e,a,l){var t=l(5130),n=l(6768);const o={id:"app"};function s(e,a,l,t,s,i){const r=(0,n.g2)("ImageGenerator");return(0,n.uX)(),(0,n.CE)("div",o,[(0,n.bF)(r)])}var i=l(4232);const r={class:"image-generator-container px-8"},c=(0,n.Fv)('<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full"><div class="col-span-1 w-full text-start mb-8"><h1 class="headline-text">skunkwork 1.0.1</h1><p class="text-white">WIP: //unstable //Beta</p></div><div class="col-span-1 w-full text-start mb-8"><h2 class="text-lg">Usage Rules:</h2><p class="text-white text-xs"> Compliance with Applicable Law. You agree to abide by all applicable local, state, national, and foreign laws, treaties, and regulations, in connection with your use of the Service. SkunkWorksAI agrees to abide by all applicable local, state, national, and foreign laws, treaties, and regulations, in connection with its provision of the Service. </p></div><div class="col-span-1 w-full flex items-center justify-end mb-8"><img src="/Skunk_works_Logo.svg" alt="Skunkworks Logo" class="w-32 h-auto"></div></div><div class="w-full h-px bg-white my-4"></div>',2),u={class:"grid grid-cols-1 lg:grid-cols-3 gap-4 w-full"},d=(0,n.Lk)("label",{for:"text-input",class:"input-label"},"Enter your text:",-1),p=(0,n.Lk)("label",{for:"image-upload",class:"input-label"},"Upload Reference Image:",-1),m={class:"flex items-baseline space-x-2"},g=(0,n.Lk)("label",{for:"use-reference-image",class:"input-label"}," Use Reference Image ",-1),v={key:0,class:"mb-4"},f=(0,n.Lk)("p",{class:"input-label"},"Reference Image:",-1),k=["src"],h={class:"flex space-x-4"},b={class:"w-1/2"},x=(0,n.Lk)("label",{for:"model-select",class:"input-label"},"Choose Model:",-1),w=(0,n.Lk)("option",{value:"civitai:158441@358398"},"General Purpose",-1),y=[w],L={class:"w-1/2"},I=(0,n.Lk)("label",{for:"preference-select",class:"input-label"},"Select Mode:",-1),S=(0,n.Lk)("option",{value:"speed"},"Speed",-1),R=(0,n.Lk)("option",{value:"quality"},"Quality",-1),M=(0,n.Lk)("option",{value:"hd"},"HD (Max Size)",-1),U=[S,R,M],C={class:"relative group"},E={for:"cfgscale-input",class:"input-label"},W=(0,n.Lk)("span",{class:"ml-2 text-gray-400 cursor-pointer"},"ⓘ",-1),K=(0,n.Lk)("div",{class:"absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-cs p-2 z-10"},[(0,n.eW)(" Min: 0, Max: 30, Default: 7"),(0,n.Lk)("br"),(0,n.eW)(" Guidance scale represents how closely the images will resemble the prompt. Higher values are closer to the prompt. Low values may reduce the quality of the results. ")],-1),O={class:"relative group"},P={for:"steps-input",class:"input-label"},_=(0,n.Lk)("span",{class:"ml-2 text-gray-400 cursor-pointer"},"ⓘ",-1),j=(0,n.Lk)("div",{class:"absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-cs p-2 z-10"},[(0,n.eW)(" Min: 1, Max: 100, Default: 20"),(0,n.Lk)("br"),(0,n.eW)(" Controls the number of iterations. Higher steps can lead to more detail but increase generation time. ")],-1),D={class:"flex space-x-4"},A={class:"w-1/2 relative group"},V={for:"seed-input",class:"input-label"},T=(0,n.Lk)("span",{class:"ml-2 text-gray-400 cursor-pointer"},"ⓘ",-1),$=(0,n.Lk)("div",{class:"absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-sm p-2 shadow-lg w-64 z-10"},[(0,n.eW)(" Min: 1, Max: 9223372036854776000"),(0,n.Lk)("br"),(0,n.eW)(" Use the same seed to reproduce images. Leave empty for a random seed. ")],-1),X={class:"w-1/2"},G=(0,n.Lk)("label",{for:"aspect-ratio-select",class:"input-label"},"Select Aspect Ratio:",-1),F=(0,n.Lk)("option",{value:"1:1"},"1:1 (Square)",-1),q=(0,n.Lk)("option",{value:"3:2"},"3:2 (Classic)",-1),N=(0,n.Lk)("option",{value:"2:3"},"2:3 (Reverse)",-1),J=[F,q,N],H={class:"text-sm text-gray-400"},Q=["disabled"],z={class:"col-span-2 lg:h-full flex bg-fill-secondary items-center justify-center rounded-lg"},B={id:"image-output",class:"image-output w-full h-full lg:h-auto"},Y={key:0,class:"text-white text-center"},Z=(0,n.Lk)("p",null,"Generating image...",-1),ee=[Z],ae={key:1,class:"flex flex-col items-center justify-center h-full"},le=["src"],te={class:"flex flex-col space-y-2 mb-4"},ne={class:"flex space-x-4"},oe={class:"text-white text-center mt-4"},se={key:2,class:"text-white text-center"},ie=(0,n.Lk)("p",null,"No image generated yet.",-1),re=[ie],ce={class:"grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-8"},ue={class:"col-span-1 flex flex-col border-r border-white"},de={class:"terminal-container"},pe={key:0,class:"status-message"},me=(0,n.Lk)("span",{class:"terminal-cursor"},null,-1),ge={key:1,id:"loading-indicator",class:"loading-indicator"},ve={class:"col-span-2 lg:h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr"},fe=["onClick"],ke=["src"],he=(0,n.Lk)("div",{class:"w-32 h-32 border border-white flex items-center justify-center rounded-md"},[(0,n.Lk)("p",null,"Placeholder")],-1),be=[he];function xe(e,a,l,o,s,w){const S=(0,n.g2)("image-modal");return(0,n.uX)(),(0,n.CE)("div",r,[c,(0,n.Lk)("div",u,[(0,n.Lk)("form",{onSubmit:a[10]||(a[10]=(0,t.D$)(((...a)=>e.handleSubmit&&e.handleSubmit(...a)),["prevent"])),class:"form-section col-span-1 flex flex-col border-r border-white"},[(0,n.Lk)("div",null,[d,(0,n.bo)((0,n.Lk)("textarea",{"onUpdate:modelValue":a[0]||(a[0]=a=>e.textInput=a),id:"text-input",rows:"4",class:"text-input resize-none",required:"",placeholder:"Enter your prompt"},"\n          ",512),[[t.Jo,e.textInput]])]),(0,n.Lk)("div",null,[p,(0,n.Lk)("input",{type:"file",id:"image-upload",onChange:a[1]||(a[1]=(...a)=>e.handleImageUpload&&e.handleImageUpload(...a)),accept:"image/jpeg,image/png,image/webp,image/bmp,image/gif",class:"file-input"},null,32)]),(0,n.Lk)("div",m,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",id:"use-reference-image","onUpdate:modelValue":a[2]||(a[2]=a=>e.useReferenceImage=a),class:"form-checkbox h-3 w-3 text-green"},null,512),[[t.lH,e.useReferenceImage]]),g]),e.useReferenceImage&&e.uploadedImage?((0,n.uX)(),(0,n.CE)("div",v,[f,(0,n.Lk)("img",{src:e.uploadedImage,alt:"Reference Image",class:"max-w-full max-h-64 object-contain border p-2"},null,8,k)])):(0,n.Q3)("",!0),(0,n.Lk)("div",h,[(0,n.Lk)("div",b,[x,(0,n.bo)((0,n.Lk)("select",{"onUpdate:modelValue":a[3]||(a[3]=a=>e.model=a),id:"model-select",class:"select-input w-full"},y,512),[[t.u1,e.model]])]),(0,n.Lk)("div",L,[I,(0,n.bo)((0,n.Lk)("select",{"onUpdate:modelValue":a[4]||(a[4]=a=>e.selectedMode=a),id:"preference-select",class:"select-input w-full"},U,512),[[t.u1,e.selectedMode]])])]),(0,n.Lk)("div",C,[(0,n.Lk)("label",E,[(0,n.eW)(" CFG Scale: "+(0,i.v_)(e.cfgScale)+" ",1),W,K]),(0,n.bo)((0,n.Lk)("input",{type:"range","onUpdate:modelValue":a[5]||(a[5]=a=>e.cfgScale=a),id:"cfgscale-input",class:"slider-input w-full",min:"0",max:"30"},null,512),[[t.Jo,e.cfgScale]])]),(0,n.Lk)("div",O,[(0,n.Lk)("label",P,[(0,n.eW)(" Steps: "+(0,i.v_)(e.steps)+" ",1),_,j]),(0,n.bo)((0,n.Lk)("input",{type:"range","onUpdate:modelValue":a[6]||(a[6]=a=>e.steps=a),id:"steps-input",class:"slider-input w-full",min:"1",max:"100"},null,512),[[t.Jo,e.steps]])]),(0,n.Lk)("div",D,[(0,n.Lk)("div",A,[(0,n.Lk)("label",V,[(0,n.eW)(" Seed: "+(0,i.v_)(null!==e.seed?e.seed:"Random")+" ",1),T,$]),(0,n.bo)((0,n.Lk)("input",{type:"number","onUpdate:modelValue":a[7]||(a[7]=a=>e.seedInput=a),id:"seed-input",class:"number-input w-full",min:"1",max:0x8000000000000000,placeholder:"Random"},null,512),[[t.Jo,e.seedInput]])]),(0,n.Lk)("div",X,[G,(0,n.bo)((0,n.Lk)("select",{"onUpdate:modelValue":a[8]||(a[8]=a=>e.aspectRatio=a),id:"aspect-ratio-select",class:"select-input w-full"},J,512),[[t.u1,e.aspectRatio]])])]),(0,n.Lk)("div",null,[(0,n.Lk)("p",H," Calculated Dimensions: "+(0,i.v_)(e.width)+" x "+(0,i.v_)(e.height),1)]),(0,n.Lk)("button",{onClick:a[9]||(a[9]=(...a)=>e.handleSubmit&&e.handleSubmit(...a)),disabled:e.loading,class:"generate-button"},(0,i.v_)(e.loading?"Generating...":"Generate Image"),9,Q)],32),(0,n.Lk)("div",z,[(0,n.Lk)("div",B,[e.loading?((0,n.uX)(),(0,n.CE)("div",Y,ee)):e.imageUrl?((0,n.uX)(),(0,n.CE)("div",ae,[(0,n.Lk)("img",{src:e.imageUrl,alt:"Generated Image",class:"max-h-full max-w-full object-contain p-4"},null,8,le),(0,n.Lk)("div",te,[(0,n.Lk)("div",ne,[(0,n.Lk)("button",{onClick:a[11]||(a[11]=(...a)=>e.openModal&&e.openModal(...a)),class:"view-button"}," View Full Size "),(0,n.Lk)("button",{onClick:a[12]||(a[12]=(...a)=>e.downloadImage&&e.downloadImage(...a)),class:"download-button"}," Download Image ")])]),(0,n.Lk)("div",oe,[(0,n.Lk)("p",null,"Seed: "+(0,i.v_)(e.generatedSeed),1)])])):((0,n.uX)(),(0,n.CE)("div",se,re))])]),e.modalVisible?((0,n.uX)(),(0,n.Wv)(S,{key:0,isVisible:e.modalVisible,imageUrl:e.imageUrl||"",seed:null!==e.generatedSeed?e.generatedSeed:void 0,onClose:e.closeModal},null,8,["isVisible","imageUrl","seed","onClose"])):(0,n.Q3)("",!0)]),(0,n.Lk)("div",ce,[(0,n.Lk)("div",ue,[(0,n.Lk)("div",de,[e.statusMessage?((0,n.uX)(),(0,n.CE)("div",pe,[(0,n.eW)(" Status: "),(0,n.Lk)("span",null,(0,i.v_)(e.statusMessage),1),me])):(0,n.Q3)("",!0),e.loading?((0,n.uX)(),(0,n.CE)("div",ge," Processing Data "+(0,i.v_)(e.loadingAnimation),1)):(0,n.Q3)("",!0)])]),(0,n.Lk)("div",ve,[e.oldImages.length>0?((0,n.uX)(!0),(0,n.CE)(n.FK,{key:0},(0,n.pI)(e.oldImages.slice(-4),((a,l)=>((0,n.uX)(),(0,n.CE)("div",{key:l,class:"flex items-center justify-center cursor-pointer",onClick:l=>e.viewImage(a)},[(0,n.Lk)("img",{src:a,alt:"Old Generated Image",class:"max-h-32 max-w-32 object-contain"},null,8,ke)],8,fe)))),128)):((0,n.uX)(),(0,n.CE)(n.FK,{key:1},(0,n.pI)(4,(e=>(0,n.Lk)("div",{key:e,class:"flex items-center justify-center cursor-pointer"},be))),64))])])])}l(4114),l(4603),l(7566),l(8721);var we=l(144);let ye=0;const Le=5;let Ie=!1;const Se=32e3;function Re(e,a,l,t){const n=new WebSocket("wss://ws-api.runware.ai/v1");return n.onopen=()=>{console.log("WebSocket connection opened."),ye=0;const e="Qw9LhZpi2wuHyRk5LDh6ZOnHwDYQ8O3D";if(!e)return console.error("API Key is missing! Please set VUE_APP_API_KEY in your environment."),void n.close();const l=[{taskType:"authentication",apiKey:e}];n.send(JSON.stringify(l)),console.log("Authentication message sent:",l),a&&a()},n.onmessage=a=>{try{console.log("WebSocket message received:",a.data);const l=JSON.parse(a.data);if(console.log("Parsed WebSocket response:",l),l.data&&l.data[0].errorMessage)return console.error("Authentication failed:",l.data[0].errorMessage),void n.close();const t=l.data[0]?.taskType;"imageInference"===t?console.log("Handling image inference task..."):"imageUpload"===t&&console.log("Handling image upload task..."),e&&e(l)}catch(l){console.error("Error parsing WebSocket message:",l)}},n.onerror=e=>{console.error("WebSocket error occurred:",e),e instanceof ErrorEvent?console.error("Error event message:",e.message):console.error("Non-error event:",e),t&&t(e)},n.onclose=n=>{if(console.log("WebSocket connection closed.",n.reason),l&&l(),!Ie&&ye<Le){Ie=!0;const n=Math.min(1e3*Math.pow(2,ye),Se);console.log(`Reconnecting in ${n/1e3} seconds...`),setTimeout((()=>{ye++,Re(e,a,l,t),Ie=!1}),n)}else ye>=Le&&console.error("Max reconnection attempts reached.")},n}function Me(){let e=(new Date).getTime(),a=performance&&performance.now&&1e3*performance.now()||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(l=>{let t=16*Math.random();return e>0?(t=(e+t)%16|0,e=Math.floor(e/16)):(t=(a+t)%16|0,a=Math.floor(a/16)),("x"===l?t:3&t|8).toString(16)}))}const Ue={key:0,class:"modal-overlay"},Ce={class:"modal-content"},Ee=["src"],We={key:0,class:"text-white text-center mt-4"},Ke={class:"flex space-x-4 mt-4"};function Oe(e,a,l,t,o,s){return e.isVisible?((0,n.uX)(),(0,n.CE)("div",Ue,[(0,n.Lk)("div",Ce,[(0,n.Lk)("img",{src:e.imageUrl,alt:"Generated Image",class:"max-w-full max-h-full"},null,8,Ee),null!==e.seed&&void 0!==e.seed?((0,n.uX)(),(0,n.CE)("div",We,[(0,n.Lk)("p",null,"Seed: "+(0,i.v_)(e.seed),1)])):(0,n.Q3)("",!0),(0,n.Lk)("div",Ke,[(0,n.Lk)("button",{onClick:a[0]||(a[0]=(...a)=>e.downloadImage&&e.downloadImage(...a)),class:"download-button"},"Download Image"),(0,n.Lk)("button",{onClick:a[1]||(a[1]=a=>e.$emit("close")),class:"close-button"},"Close")])])])):(0,n.Q3)("",!0)}var Pe=(0,n.pM)({props:{isVisible:{type:Boolean,required:!0},imageUrl:{type:String,required:!0},seed:{type:Number,required:!1}},setup(e){const a=(0,n.EW)((()=>{const a=e.imageUrl.split(".").pop();return`skunkworks_${Date.now()}.${a}`})),l=async()=>{try{const l=await fetch(e.imageUrl),t=await l.blob(),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=a.value,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(n.href)}catch(l){console.error("Download failed:",l)}};return{downloadImage:l}}}),_e=l(1241);const je=(0,_e.A)(Pe,[["render",Oe]]);var De=je,Ae=(0,n.pM)({components:{ImageModal:De},setup(){const e=()=>Math.floor(0x8000000000000000*Math.random())+1,a=(0,we.KR)(null),l=(0,we.KR)(null),t=(0,we.KR)(null),o=(0,we.KR)(7),s=(0,we.KR)(!1),i=(0,we.KR)(""),r=(0,we.KR)("civitai:158441@358398"),c=(0,we.KR)("speed"),u=(0,we.KR)(15),d=(0,we.KR)("1:1"),p=(0,we.KR)(512),m=(0,we.KR)(512),g=(0,we.KR)(null),v=(0,we.KR)(!1),f=(0,we.KR)(""),k=(0,we.KR)(""),h=(0,we.KR)([]),b=(0,we.KR)(null),x=(0,we.KR)(null),w=(0,we.KR)(!1),y=(0,we.KR)("speed");let L,I=null,S=null;const R=e=>{f.value=e},M=()=>{v.value=!1,E(),null!==I&&(clearTimeout(I),I=null)},U=()=>{const e=512,a=2048;let l,t,n;switch(d.value){case"3:2":l=3,t=2;break;case"2:3":l=2,t=3;break;case"1:1":default:l=1,t=1;break}switch(c.value){case"quality":n=1024;break;case"hd":n=2048;break;case"speed":default:n=512;break}l>=t?(p.value=Math.max(e,Math.min(n,a)),m.value=Math.max(e,Math.min(Math.round(n*t/l),a))):(m.value=Math.max(e,Math.min(n,a)),p.value=Math.max(e,Math.min(Math.round(n*l/t),a))),p.value=64*Math.round(p.value/64),m.value=64*Math.round(m.value/64),p.value=Math.max(e,Math.min(p.value,a)),m.value=Math.max(e,Math.min(m.value,a))},C=()=>{const e=[".  ",".. ","..."," ..","  .","   "];let a=0;S=window.setInterval((()=>{k.value=e[a],a=(a+1)%e.length}),200)},E=()=>{null!==S&&(clearInterval(S),S=null,k.value="")},W=async e=>{const a=e.target.files?.[0];if(!a)return;const l=new FileReader;l.onload=async()=>{b.value=l.result;const e=Me(),a={taskType:"imageUpload",taskUUID:e,image:b.value};L.send(JSON.stringify([a]))},l.readAsDataURL(a)},K=()=>{if(v.value)return void(f.value="Please wait for the current request to complete.");if(!L||L.readyState!==WebSocket.OPEN)return void(f.value="WebSocket connection is not ready. Please wait.");v.value=!0,g.value=null,a.value=l.value||Math.floor(0x8000000000000000*Math.random())+1;const e=Me(),t={taskType:"imageInference",taskUUID:e,outputType:"URL",outputFormat:"JPG",positivePrompt:i.value,height:m.value,width:p.value,model:r.value,steps:u.value,seed:a.value,CFGScale:o.value,numberResults:1};w.value&&x.value&&(t.seedImage=x.value,t.strength=.8),L.send(JSON.stringify([t])),f.value=`Sending image generation request:\n    - Model: ${r.value}\n    - Width: ${p.value}px\n    - Height: ${m.value}px\n    - Steps: ${u.value}\n    - Seed: ${null!==a.value?a.value:"Random"}`,C(),I=window.setTimeout((()=>{f.value+="\nRequest timed out. Please try again.",M()}),3e4)},O=e=>{if(!e||!e.data||!Array.isArray(e.data)||0===e.data.length)return void console.error("Received an invalid response or empty data array",e);const l=e.data[0];if("imageUpload"===l.taskType)l.imageUUID?(x.value=l.imageUUID,f.value="Image uploaded successfully!"):f.value="Image upload failed.";else if("imageInference"===l.taskType){const e=l.imageURL;e?(g.value=e,void 0!==l.seed&&null!==l.seed?(t.value=l.seed,console.log("Seed received and set:",t.value)):(console.warn("Seed is missing from the response. Using fallback."),t.value=a.value),h.value.push(e),h.value.length>4&&h.value.shift(),f.value="Image generated successfully!",M()):(f.value="Failed to generate image. Please try again.",M())}},P=()=>{console.log("Reinitializing WebSocket due to model change..."),L&&L.readyState===WebSocket.OPEN&&L.close(),setTimeout((()=>{L=Re(O,(()=>{R(`Authenticated successfully with model: ${r.value}`)}))}),500)};(0,n.wB)([c,d],U,{immediate:!0}),(0,n.wB)(r,(()=>{console.log(`Model changed to: ${r.value}`),P(),R(`Authenticated successfully with model: ${r.value}`)})),(0,n.sV)((()=>{a.value=e(),P(),U(),setInterval((()=>{if(L&&L.readyState===WebSocket.OPEN){const e={taskType:"ping",ping:!0};L.send(JSON.stringify([e])),R("Ping message sent to keep connection alive.")}}),6e4)})),(0,n.wB)([c,d],U,{immediate:!0});const _=()=>{s.value=!0},j=()=>{s.value=!1},D=e=>{g.value=e,_()},A=(0,n.EW)((()=>{if(g.value){const e=g.value.split(".").pop();return`skunkworks_${Me()}.${e}`}return"skunkworks_image.jpg"})),V=async()=>{if(g.value)try{const e=await fetch(g.value),a=await e.blob(),l=document.createElement("a");l.href=URL.createObjectURL(a),l.download=A.value,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(l.href)}catch(e){console.error("Download failed:",e)}};return{textInput:i,model:r,steps:u,cfgScale:o,preference:y,aspectRatio:d,width:p,height:m,imageUrl:g,loading:v,statusMessage:f,loadingAnimation:k,handleSubmit:K,oldImages:h,downloadFilename:A,downloadImage:V,modalVisible:s,openModal:_,closeModal:j,viewImage:D,handleImageUpload:W,uploadedImage:b,imageUUID:x,useReferenceImage:w,handleImageResponse:O,seed:a,generatedSeed:t,selectedMode:c,seedInput:l}}});const Ve=(0,_e.A)(Ae,[["render",xe]]);var Te=Ve,$e=(0,n.pM)({components:{ImageGenerator:Te}});const Xe=(0,_e.A)($e,[["render",s]]);var Ge=Xe;(0,t.Ef)(Ge).mount("#app")}},a={};function l(t){var n=a[t];if(void 0!==n)return n.exports;var o=a[t]={exports:{}};return e[t].call(o.exports,o,o.exports,l),o.exports}l.m=e,function(){var e=[];l.O=function(a,t,n,o){if(!t){var s=1/0;for(u=0;u<e.length;u++){t=e[u][0],n=e[u][1],o=e[u][2];for(var i=!0,r=0;r<t.length;r++)(!1&o||s>=o)&&Object.keys(l.O).every((function(e){return l.O[e](t[r])}))?t.splice(r--,1):(i=!1,o<s&&(s=o));if(i){e.splice(u--,1);var c=n();void 0!==c&&(a=c)}}return a}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[t,n,o]}}(),function(){l.n=function(e){var a=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(a,{a:a}),a}}(),function(){l.d=function(e,a){for(var t in a)l.o(a,t)&&!l.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:a[t]})}}(),function(){l.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){l.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)}}(),function(){var e={524:0};l.O.j=function(a){return 0===e[a]};var a=function(a,t){var n,o,s=t[0],i=t[1],r=t[2],c=0;if(s.some((function(a){return 0!==e[a]}))){for(n in i)l.o(i,n)&&(l.m[n]=i[n]);if(r)var u=r(l)}for(a&&a(t);c<s.length;c++)o=s[c],l.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return l.O(u)},t=self["webpackChunkskunkworks_vue"]=self["webpackChunkskunkworks_vue"]||[];t.forEach(a.bind(null,0)),t.push=a.bind(null,t.push.bind(t))}();var t=l.O(void 0,[504],(function(){return l(4116)}));t=l.O(t)})();
//# sourceMappingURL=app.52b219e9.js.map