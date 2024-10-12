"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[507],{88507:(e,a,t)=>{t.d(a,{offchainLookup:()=>k,offchainLookupSignature:()=>m});var s=t(61990),r=t(23512),n=t(21627),o=t(91218);class c extends n.C{constructor(e){let{callbackSelector:a,cause:t,data:s,extraData:r,sender:n,urls:c}=e;super(t.shortMessage||"An error occurred while fetching for an offchain result.",{cause:t,metaMessages:[...t.metaMessages||[],t.metaMessages?.length?"":[],"Offchain Gateway Call:",c&&["  Gateway URL(s):",...c.map((e=>`    ${(0,o.I)(e)}`))],`  Sender: ${n}`,`  Data: ${s}`,`  Callback selector: ${a}`,`  Extra data: ${r}`].flat(),name:"OffchainLookupError"})}}class d extends n.C{constructor(e){let{result:a,url:t}=e;super("Offchain gateway response is malformed. Response data must be a hex value.",{metaMessages:[`Gateway URL: ${(0,o.I)(t)}`,`Response: ${(0,r.A)(a)}`],name:"OffchainLookupResponseMalformedError"})}}class l extends n.C{constructor(e){let{sender:a,to:t}=e;super("Reverted sender address does not match target contract address (`to`).",{metaMessages:[`Contract address: ${t}`,`OffchainLookup sender address: ${a}`],name:"OffchainLookupSenderMismatchError"})}}var u=t(72494),i=t(74745),f=t(31376),h=t(3491),p=t(74074);var w=t(52620),y=t(31499);const m="0x556f1830",b={name:"OffchainLookup",type:"error",inputs:[{name:"sender",type:"address"},{name:"urls",type:"string[]"},{name:"callData",type:"bytes"},{name:"callbackFunction",type:"bytes4"},{name:"extraData",type:"bytes"}]};async function k(e,a){let{blockNumber:t,blockTag:r,data:n,to:o}=a;const{args:d}=(0,i.W)({data:n,abi:[b]}),[u,y,m,k,C]=d,{ccipRead:x}=e,L=x&&"function"===typeof x?.request?x.request:g;try{if(!function(e,a){if(!(0,p.P)(e,{strict:!1}))throw new h.M({address:e});if(!(0,p.P)(a,{strict:!1}))throw new h.M({address:a});return e.toLowerCase()===a.toLowerCase()}(o,u))throw new l({sender:u,to:o});const a=await L({data:m,sender:u,urls:y}),{data:n}=await(0,s.T)(e,{blockNumber:t,blockTag:r,data:(0,w.xW)([k,(0,f.h)([{type:"bytes"},{type:"bytes"}],[a,C])]),to:o});return n}catch(M){throw new c({callbackSelector:k,cause:M,data:n,extraData:C,sender:u,urls:y})}}async function g(e){let{data:a,sender:t,urls:s}=e,n=new Error("An unknown error occurred.");for(let c=0;c<s.length;c++){const e=s[c],l=e.includes("{data}")?"GET":"POST",i="POST"===l?{data:a,sender:t}:void 0;try{const s=await fetch(e.replace("{sender}",t).replace("{data}",a),{body:JSON.stringify(i),method:l});let o;if(o=s.headers.get("Content-Type")?.startsWith("application/json")?(await s.json()).data:await s.text(),!s.ok){n=new u.Ci({body:i,details:o?.error?(0,r.A)(o.error):s.statusText,headers:s.headers,status:s.status,url:e});continue}if(!(0,y.q)(o)){n=new d({result:o,url:e});continue}return o}catch(o){n=new u.Ci({body:i,details:o.message,url:e})}}throw n}}}]);
//# sourceMappingURL=507.269317f2.chunk.js.map