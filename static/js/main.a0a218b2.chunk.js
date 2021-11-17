(this["webpackJsonpcarbon-live-js"]=this["webpackJsonpcarbon-live-js"]||[]).push([[0],{113:function(e,t,a){e.exports=a(131)},118:function(e,t,a){},130:function(e,t,a){},131:function(e,t,a){"use strict";a.r(t);var l=a(0),i=a.n(l),s=a(47),n=a.n(s),o=(a(118),a(4)),r=a(5),p=a(6),c=a(2),h=a(8),m=a(7);function d(e){return 1e-15*e*12}function _(e){return 2.13*e}function u(e){return e/2.13}function v(e){var t=e.Tc,a=e.Sal,l=Math.sqrt(a),i=t+273.15,s=Math.log(i),n=Math.exp(9345.17/i-60.2409+23.3585*Math.log(i/100)+a*(.023517-.023656*i/100+i/100*.0047036*(i/100))),o=Math.pow(10,-3633.86/i+61.2172-9.6777*s+.011555*a-1152e-7*a*a),r=Math.pow(10,-471.78/i-25.929+3.16967*s+.01781*a-1122e-7*a*a),p=Math.exp(148.9652-13847.26/i-23.6521*s+(118.67/i-5.977+1.0495*s)*l-.01615*a),c=Math.exp((-8966.9-2890.53*l-77.942*a+1.728*a*l-.0996*a*a)/i+(148.0248+137.1942*l+1.62142*a)+(-24.4344-25.085*l-.2474*a)*s+.053105*l*i),h=Math.pow(10,-171.9065-.077993*i+2839.319/i+71.595*Math.log10(i)+(.0028426*i-.77712+178.34/i)*l-.07711*a+.0041249*a*l),m=Math.pow(10,-171.945-.077993*i+2903.293/i+71.595*Math.log10(i)+(.0017276*i-.068393+88.135/i)*l-.10018*a+.0059415*a*l),d=57.7-.118*i,_=12.0408*i-1636.75-.0327957*Math.pow(i,2)+316528e-10*Math.pow(i,3),u=83.1451*i;return{K0:n,K1:o,K2:r,KB:c,KW:p,KspA:m,KspC:h,FugFac:Math.exp(1.01325*(_+2*d)/u)}}function b(e){var t=e.DIC,a=e.TA,l=e.Sal,i=e.Ks,s=function(e){for(var t=e.DIC,a=e.TA,l=e.Sal,i=e.Ks,s=4157e-7/35*l,n=Math.pow(10,-8),o=n,r=null,p=null,c=null;Math.abs(o)>1e-15;)n-=o=(a-((r=t/(1+n/i.K1+i.K2/n))+2*(p=t/(1+n/i.K2+Math.pow(n,2)/(i.K1*i.K2))))-s*i.KB/(i.KB+n)-(c=i.KW/n)+n)/(1+(2*p+r+c)/n+s*i.KB/Math.pow(i.KB+n,2));return n}({DIC:t*=1e-6,TA:a*=1e-6,Sal:l,Ks:i}),n=-Math.log10(s),o=1e6*t/(1+i.K1/s+i.K1*i.K2/Math.pow(s,2)),r=1e6*t/(1+s/i.K1+i.K2/s),p=1e6*t/(1+s/i.K2+Math.pow(s,2)/(i.K1*i.K2)),c=o/i.K0,h=c/i.FugFac;return{pH:n,fCO2:c,CO2:o,HCO3:r,CO3:p,c:1e-6*p/(i.KspC/.0102),pCO2:h}}var C={PO4:"[PO<sub>4</sub>]",c:"\u03a9",DIC:"DIC",TA:"TA",fCO2:"fCO<sub>2</sub>",pCO2:"pCO<sub>2</sub>",pH:"pH",CO2:"[H<sub>2</sub>CO<sub>3</sub><sup>*</sup>]",CO3:"[CO<sub>3</sub><sup>2-</sup>]",HCO3:"[HCO<sub>3</sub><sup>-</sup>]"},O=358e12,y={kas:.02,vmix:189e13,vcirc:63072e10,tau_hilat:50,tau_lolat:1,percent_CaCO3_hilat:10,percent_CaCO3_lolat:20,depth_lolat:100,depth_hilat:200,vol_ocean:134e16,vol_deep:129883e13,vol_lolat:3043e13,vol_hilat:1074e13,mass_atmos:5132e15,moles_atmos:1773e17,SA_ocean:O,fSA_hilat:.15,fSA_lolat:.85,SA_hilat:.15*O,SA_lolat:.85*O,temp_deep:1.92,temp_hilat:3.715,temp_lolat:22.85,sal_lolat:35.15,sal_hilat:33.5,sal_deep:34.72,PO4_lolat:.182,PO4_hilat:1.68,PO4_deep:2.38,DIC_lolat:1969,DIC_hilat:2183.1,DIC_deep:2260.5,TA_lolat:2253.4,TA_hilat:2344.1,TA_deep:2381.4,pCO2_atmos:372.75,pCO2_atmos_noExch:372.75};function f(e,t){for(var a=b({DIC:e.DIC_deep,TA:e.TA_deep,Sal:e.sal_deep,Ks:t.deep}),l=b({DIC:e.DIC_hilat,TA:e.TA_hilat,Sal:e.sal_hilat,Ks:t.hilat}),i=b({DIC:e.DIC_lolat,TA:e.TA_lolat,Sal:e.sal_lolat,Ks:t.lolat}),s=0,n=["pH","fCO2","pCO2","CO2","HCO3","CO3","c"];s<n.length;s++){var o=n[s];e[o+"_deep"]=a[o],e[o+"_lolat"]=i[o],e[o+"_hilat"]=l[o]}return e}for(var x={},g=0,E=["hilat","lolat","deep"];g<E.length;g++){var j=E[g];x[j]=v({Tc:y["temp_"+j],Sal:y["sal_"+j]})}function S(e){var t={};t.vmix_PO4_hilat=e.vmix*(e.PO4_hilat-e.PO4_deep),t.vmix_PO4_lolat=e.vmix*(e.PO4_lolat-e.PO4_deep),t.vmix_DIC_hilat=e.vmix*(e.DIC_hilat-e.DIC_deep),t.vmix_DIC_lolat=e.vmix*(e.DIC_lolat-e.DIC_deep),t.vmix_TA_hilat=e.vmix*(e.TA_hilat-e.TA_deep),t.vmix_TA_lolat=e.vmix*(e.TA_lolat-e.TA_deep),t.vcirc_PO4_deep=e.vcirc*(e.PO4_hilat-e.PO4_deep),t.vcirc_PO4_lolat=e.vcirc*(e.PO4_deep-e.PO4_lolat),t.vcirc_PO4_hilat=e.vcirc*(e.PO4_lolat-e.PO4_hilat),t.vcirc_DIC_deep=e.vcirc*(e.DIC_hilat-e.DIC_deep),t.vcirc_DIC_lolat=e.vcirc*(e.DIC_deep-e.DIC_lolat),t.vcirc_DIC_hilat=e.vcirc*(e.DIC_lolat-e.DIC_hilat),t.vcirc_TA_deep=e.vcirc*(e.TA_hilat-e.TA_deep),t.vcirc_TA_lolat=e.vcirc*(e.TA_deep-e.TA_lolat),t.vcirc_TA_hilat=e.vcirc*(e.TA_lolat-e.TA_hilat),t.prod_PO4_hilat=e.PO4_hilat*e.vol_hilat/e.tau_hilat,t.prod_PO4_lolat=e.PO4_lolat*e.vol_lolat/e.tau_lolat;var a=106+106*e.percent_CaCO3_lolat/100,l=106+106*e.percent_CaCO3_hilat/100;t.prod_DIC_hilat=t.prod_PO4_hilat*l,t.prod_DIC_lolat=t.prod_PO4_lolat*a;var i=.15*106+212*e.percent_CaCO3_lolat/100,s=.15*106+212*e.percent_CaCO3_hilat/100;return t.prod_TA_hilat=t.prod_PO4_hilat*s,t.prod_TA_lolat=t.prod_PO4_lolat*i,t.exCO2_lolat=e.kas*e.SA_lolat*(e.pCO2_atmos-e.pCO2_lolat),t.exCO2_hilat=e.kas*e.SA_hilat*(e.pCO2_atmos-e.pCO2_hilat),t}y=f(y,x);var P,T,I={vmix:{label:"Mixing Rate (m3 / yr)",ymin:null,ymax:null,precision:null},vcirc:{label:"Thermohaline Mixing Rate (m3 / yr)",ymin:null,ymax:null,precision:null},tau_lolat:{label:"Productivity (tau)",ymin:null,ymax:null,precision:null},tau_hilat:{label:"Productivity (tau)",ymin:null,ymax:null,precision:null},percent_CaCO3_lolat:{label:"% CaCO3",ymin:0,ymax:100,precision:1},percent_CaCO3:{label:"% CaCO3",ymin:0,ymax:100,precision:1},vol_deep:{label:"Ocean Volume (m3)",ymin:null,ymax:null,precision:null},vol_lolat:{label:"Ocean Volume (m3)",ymin:null,ymax:null,precision:null},vol_hilat:{label:"Ocean Volume (m3)",ymin:null,ymax:null,precision:null},PO4_lolat:{label:"[PO4]",ymin:0,ymax:1,precision:3},PO4_hilat:{label:"[PO4]",ymin:0,ymax:1,precision:3},PO4_deep:{label:"[PO4]",ymin:2.4,ymax:2.6,precision:3},DIC_hilat:{label:"[DIC]",ymin:1800,ymax:2e3,precision:4},DIC_lolat:{label:"[DIC]",ymin:1800,ymax:2e3,precision:4},DIC_deep:{label:"[DIC]",ymin:2130,ymax:2150,precision:5},TA_lolat:{label:"Alkalinity",ymin:2200,ymax:2400,precision:4},TA_hilat:{label:"Alkalinity",ymin:2200,ymax:2400,precision:4},TA_deep:{label:"Alkalinity",ymin:2390,ymax:2410,precision:5},pH_deep:{label:"pH",ymin:7.9,ymax:8.15,precision:3},fCO2_deep:{label:"fCO2",ymin:350,ymax:450,precision:3},pCO2_deep:{label:"pCO2",ymin:350,ymax:450,precision:3},CO2_deep:{label:"[CO2]",ymin:5,ymax:15,precision:3},HCO3_deep:{label:"[HCO3]",ymin:1500,ymax:2e3,precision:4},CO3_deep:{label:"[CO3]",ymin:70,ymax:120,precision:3},pH_hilat:{label:"pH",ymin:7.9,ymax:8.15,precision:3},fCO2_hilat:{label:"fCO2",ymin:350,ymax:450,precision:3},pCO2_hilat:{label:"pCO2",ymin:350,ymax:450,precision:3},CO2_hilat:{label:"[CO2]",ymin:5,ymax:15,precision:3},HCO3_hilat:{label:"[HCO3]",ymin:1500,ymax:2e3,precision:4},CO3_hilat:{label:"[CO3]",ymin:70,ymax:120,precision:3},pH_lolat:{label:"pH",ymin:7.9,ymax:8.15,precision:3},fCO2_lolat:{label:"fCO2",ymin:350,ymax:450,precision:3},pCO2_lolat:{label:"pCO2",ymin:350,ymax:450,precision:3},CO2_lolat:{label:"[CO2]",ymin:5,ymax:15,precision:3},HCO3_lolat:{label:"[HCO3]",ymin:1500,ymax:2e3,precision:4},CO3_lolat:{label:"[CO3]",ymin:70,ymax:120,precision:3},c_deep:{label:"\u03a9",ymin:0,ymax:1,precision:2},c_lolat:{label:"\u03a9",ymin:0,ymax:1,precision:2},c_hilat:{label:"\u03a9",ymin:0,ymax:1,precision:2},pCO2_atmos:{label:"pCO2",ymin:350,ymax:450,precision:4},pCO2_atmos_noExch:{label:"pCO2",ymin:350,ymax:450,precision:4},temp_lolat:{label:"Temp",ymin:20,ymax:25,precision:3},temp_hilat:{label:"Temp",ymin:2,ymax:6,precision:3},temp_deep:{label:"Temp",ymin:0,ymax:4,precision:3},sal_lolat:{label:"Temp",ymin:36,ymax:34,precision:3},sal_hilat:{label:"Temp",ymin:36,ymax:34,precision:3},sal_deep:{label:"Temp",ymin:36,ymax:34,precision:3}},k=a(11),D=a(23),A=a(24),w=a(49),M=a(9),N=a(48),H=a.n(N),K=(a(125),i.a.Component,function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;return Object(r.a)(this,a),(l=t.call(this,e)).handleChange=function(e){l.props.handleChange(e)},l.handleChange=l.handleChange.bind(Object(c.a)(l)),l.fmtLabel=l.fmtLabel.bind(Object(c.a)(l)),l}return Object(p.a)(a,[{key:"fmtLabel",value:function(e){return this.props.fmt_info[0](e,this.props.fmt_info[1])}},{key:"render",value:function(){return i.a.createElement(H.a,{value:this.props.value,min:this.props.min,max:this.props.max,orientation:"vertical",onChange:this.handleChange,format:this.fmtLabel,labels:this.props.labels,step:this.props.step})}}]),a}(i.a.Component));function L(e,t){return e.toExponential(t)}function z(e,t){return e.toPrecision(t)}function V(e,t){return e.toFixed(t)}var U={vcirc:[L,1,.5*y.vcirc,2*y.vcirc],vmix:[L,1,.5*y.vmix,2*y.vmix],tau_hilat:[z,2,30,100],tau_lolat:[z,2,1,10,.1],percent_CaCO3_hilat:[z,2,0,50],percent_CaCO3_lolat:[z,2,0,50],temp_hilat:[V,1,0,10,.1],temp_lolat:[V,1,20,30,.1]},G={vcirc:(P={},Object(M.a)(P,y.vcirc,""),Object(M.a)(P,2*y.vcirc,"x2"),Object(M.a)(P,y.vcirc/2,"/2"),P),vmix:(T={},Object(M.a)(T,y.vmix,""),Object(M.a)(T,2*y.vmix,"x2"),Object(M.a)(T,y.vmix/2,"/2"),T),tau_hilat:Object(M.a)({},y.tau_hilat,""),tau_lolat:Object(M.a)({},y.tau_lolat,""),percent_CaCO3_hilat:Object(M.a)({},y.percent_CaCO3_hilat,""),percent_CaCO3_lolat:Object(M.a)({},y.percent_CaCO3_lolat,""),temp_hilat:Object(M.a)({},y.temp_hilat,""),temp_lolat:Object(M.a)({},y.temp_lolat,"")},F={vcirc:"V<sub>circ</sub>",vmix:"V<sub>mix</sub>",tau_hilat:"&tau;",tau_lolat:"&tau;",percent_CaCO3_hilat:"% CaCO<sub>3</sub>",percent_CaCO3_lolat:"% CaCO<sub>3</sub>",temp_hilat:"Temp",temp_lolat:"Temp"},Y=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;return Object(r.a)(this,a),(l=t.call(this,e)).handleDouble=l.handleDouble.bind(Object(c.a)(l)),l.handleHalve=l.handleHalve.bind(Object(c.a)(l)),l.handleSliderChange=l.handleSliderChange.bind(Object(c.a)(l)),l}return Object(p.a)(a,[{key:"handleDouble",value:function(e){this.props.handleUpdate(this.props.param,2*this.props.value)}},{key:"handleHalve",value:function(e){this.props.handleUpdate(this.props.param,this.props.value/2)}},{key:"handleSliderChange",value:function(e){this.props.handleUpdate(this.props.param,e)}},{key:"render",value:function(){var e=U[this.props.param][2],t=U[this.props.param][3],a=U[this.props.param][4];return i.a.createElement("div",{className:"control-set"},i.a.createElement("h3",{dangerouslySetInnerHTML:{__html:F[this.props.param]}}),i.a.createElement(K,{value:this.props.value,min:e,max:t,handleChange:this.handleSliderChange,fmt_info:U[this.props.param],labels:G[this.props.param],step:a}),i.a.createElement("div",{className:"control-value"},U[this.props.param][0](this.props.value,U[this.props.param][1])))}}]),a}(i.a.Component),B=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;return Object(r.a)(this,a),(l=t.call(this,e)).state={GtC_pinutubo:.05*.272,emitLabel:"Burn!"},l.handleStHelens=l.handleStHelens.bind(Object(c.a)(l)),l.handlePinatubo=l.handlePinatubo.bind(Object(c.a)(l)),l.handleEmissions=l.handleEmissions.bind(Object(c.a)(l)),l}return Object(p.a)(a,[{key:"handleStHelens",value:function(){this.props.handleVolcano(.00272)}},{key:"handlePinatubo",value:function(){this.props.handleVolcano(.05*.272)}},{key:"handleEmissions",value:function(){this.props.handleEmissions(),"Burn!"===this.state.emitLabel?this.setState({emitLabel:"Stop."}):this.setState({emitLabel:"Burn!"})}},{key:"render",value:function(){return i.a.createElement("div",{className:"control-section disasters",style:{zIndex:5}},i.a.createElement("h2",null,"Carbon Release: ",this.props.GtC_released.toFixed(2)," GtC"),i.a.createElement("div",{className:"model-controls"},i.a.createElement("div",{className:"control-set"},i.a.createElement("h3",null,"Fossil Fuels"),i.a.createElement(k.a,{onClick:this.handleEmissions,size:"sm"},this.state.emitLabel)),i.a.createElement("div",{className:"control-set"},i.a.createElement("h3",null,"Volcanos"),i.a.createElement(k.a,{onClick:this.handleStHelens,size:"sm"},"St. Helens"),i.a.createElement(k.a,{onClick:this.handlePinatubo,size:"sm"},"Pinatubo"))))}}]),a}(i.a.Component);function W(e){return 5.35*Math.log(e/y.pCO2_atmos)}function R(e){return 2.5*e/y.pCO2_atmos-2.5}var J=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{className:"control-section forcing",style:{zIndex:5}},i.a.createElement("h2",null,"Climate: Radiative Forcing "),i.a.createElement("div",{className:"model-controls"},i.a.createElement("div",{className:"control-set table"},i.a.createElement("div",{className:"table cell title"}),i.a.createElement("div",{className:"table cell head"},"No Ocean"),i.a.createElement("div",{className:"table cell head"},"With Ocean"),i.a.createElement("div",{className:"table cell title"}),i.a.createElement("div",{className:"table cell title",dangerouslySetInnerHTML:{__html:"pCO<sub>2</sub>"}}),i.a.createElement("div",{className:"table cell"}," ",this.props.pCO2_atmos_noExch.toFixed(1)),i.a.createElement("div",{className:"table cell"}," ",this.props.pCO2_atmos.toFixed(1)),i.a.createElement("div",{className:"table cell unit"},"ppm"),i.a.createElement("div",{className:"table cell title",dangerouslySetInnerHTML:{__html:"\u0394F"}}),i.a.createElement("div",{className:"table cell"}," ",W(this.props.pCO2_atmos_noExch).toFixed(1)),i.a.createElement("div",{className:"table cell"}," ",W(this.props.pCO2_atmos).toFixed(1)),i.a.createElement("div",{className:"table cell unit",dangerouslySetInnerHTML:{__html:"W m<sup>-2</sup>"}}),i.a.createElement("div",{className:"table cell title",dangerouslySetInnerHTML:{__html:"\u0394T"}}),i.a.createElement("div",{className:"table cell"}," ",R(this.props.pCO2_atmos_noExch).toFixed(1)),i.a.createElement("div",{className:"table cell"}," ",R(this.props.pCO2_atmos).toFixed(1)),i.a.createElement("div",{className:"table cell unit",dangerouslySetInnerHTML:{__html:"\u2103"}}))))}}]),a}(i.a.Component),X=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"render",value:function(){var e,t=[],a=Object(o.a)(this.props.params);try{for(a.s();!(e=a.n()).done;){var l=e.value;t.push(i.a.createElement(Y,{key:l,param:l,value:this.props.now[l],handleUpdate:this.props.handleUpdate}))}}catch(s){a.e(s)}finally{a.f()}return i.a.createElement("div",{className:"control-section"},i.a.createElement("h2",null,this.props.title),i.a.createElement("div",{className:"model-controls"},t))}}]),a}(i.a.Component),q=a(15),$=a(13),Q=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;return Object(r.a)(this,a),(l=t.call(this,e)).interval=null,l.graph={},l.graph.data=l.make_data(),l}return Object(p.a)(a,[{key:"getYLimits",value:function(e){var t,a=1/0,l=-1/0,i=Object(o.a)(this.graph.data);try{for(i.s();!(t=i.n()).done;){var s,n=t.value,r=Object(o.a)(n);try{for(r.s();!(s=r.n()).done;){var p=s.value;p[1]<a&&(a=p[1]),p[1]>l&&(l=p[1])}}catch(_){r.e(_)}finally{r.f()}}}catch(_){i.e(_)}finally{i.f()}var c,h=Object(o.a)(this.props.variables);try{for(h.s();!(c=h.n()).done;){var m=c.value;a>this.props.var_info[m].ymin&&(a=this.props.var_info[m].ymin),l<this.props.var_info[m].ymax&&(l=this.props.var_info[m].ymax)}}catch(_){h.e(_)}finally{h.f()}var d=l-a;return 0===d&&(d=10),[a-d*e,l+d*e]}},{key:"make_data",value:function(){var e,t=[],a=Object(o.a)(this.props.variables);try{for(a.s();!(e=a.n()).done;){for(var l=e.value,i=this.props.data[l],s=[],n=1-i.length,r=0;r<i.length;r++)s.push([n,i[r]]),n+=1;t.push(s)}}catch(p){a.e(p)}finally{a.f()}return t}},{key:"initGraph",value:function(){var e=this;this.graph.bb=$.e("#"+this.props.id).node().getBoundingClientRect();var t=this.graph.bb.height,a=this.graph.bb.width,l=t-20-6,i=a-35-6;this.graph.xScale=$.d().domain([-this.props.npoints,0]).range([0,i]),this.graph.yScale=$.d().domain(this.getYLimits(.05)).range([l,0]),this.graph.svg=$.e("#"+this.props.id).append("svg").attr("id","svg_"+this.props.id).attr("viewBox","0 0 ".concat(a," ").concat(t)).append("g").attr("transform","translate(35, 6)"),this.graph.yAxis=$.b(this.graph.yScale).ticks(2),this.graph.svg.append("g").attr("class","y axis").call(this.graph.yAxis),this.graph.xAxis=$.a(this.graph.xScale).ticks(2),this.graph.svg.append("g").attr("class","x axis").attr("transform","translate(0,"+l+")").call(this.graph.xAxis),this.graph.lines=[];var s,n=Object(o.a)(this.props.variables);try{for(n.s();!(s=n.n()).done;){s.value;this.graph.lines.push($.c().x((function(t){return e.graph.xScale(t[0])})).y((function(t){return e.graph.yScale(t[1])})))}}catch(p){n.e(p)}finally{n.f()}for(var r in this.graph.data)this.graph.svg.append("path").attr("id","dataline").attr("id",this.props.id+r).attr("d",this.graph.lines[r](this.graph.data[r]))}},{key:"updateLine",value:function(){for(var e in this.graph.data)this.graph.svg.selectAll("path#"+this.props.id+e).attr("d",this.graph.lines[e](this.graph.data[e]))}},{key:"updateYlim",value:function(){this.graph.yScale.domain(this.getYLimits(.05)),this.graph.yAxis.scale(this.graph.yScale),$.e("#"+this.props.id).select(".y").call(this.graph.yAxis)}},{key:"updateXlim",value:function(){this.graph.xScale.domain([-this.props.npoints,0]),this.graph.xAxis.scale(this.graph.xScale),$.e("#"+this.props.id).select(".x").call(this.graph.xAxis)}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"componentDidMount",value:function(){this.initGraph()}},{key:"componentDidUpdate",value:function(){this.graph.data=this.make_data(),this.updateXlim(),this.updateYlim(),this.updateLine()}},{key:"render",value:function(){return i.a.createElement("div",{className:"graph-pane",style:{left:this.props.pos[0]+"%",bottom:this.props.pos[1]+"%",width:this.props.pos[2]+"%",height:this.props.pos[3]+"%"}},i.a.createElement("div",{className:"subgraph",id:this.props.id,style:{height:this.props.height}},i.a.createElement("div",{className:"subgraph-label",dangerouslySetInnerHTML:{__html:this.props.label}})))}}]),a}(l.Component),Z=["CO<sub>2</sub> Exchange","Thermohaline Circulation","Vertical Mixing","Biological Export"],ee=["#888e9b","#5369dcff","#202080ff","#307f2aff"],te=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{className:"box",id:this.props.id,style:{left:this.props.pos[0]+"%",bottom:this.props.pos[1]+"%",width:this.props.pos[2]+"%",height:this.props.pos[3]+"%",backgroundColor:this.props.color}},i.a.createElement("div",{className:"box-value",id:this.props.id,dangerouslySetInnerHTML:{__html:this.props.value}}),i.a.createElement("div",{className:"box-label",id:this.props.id},i.a.createElement("div",{id:this.props.id},this.props.label),i.a.createElement("div",{id:this.props.id},this.props.GtC.toFixed(0)+" GtC")))}}]),a}(l.Component);function ae(e,t,a,l,i){return 100*((1-.8)/2+.8*(1-(e-t)/(a-t)))}function le(e,t,a){return"hsl("+e+","+t+"%,"+a+"%)"}var ie=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"getLimits",value:function(){var e=Math.min(Math.min.apply(Math,Object(q.a)(this.props.data[this.props.param+"_deep"])),Math.min.apply(Math,Object(q.a)(this.props.data[this.props.param+"_hilat"])),Math.min.apply(Math,Object(q.a)(this.props.data[this.props.param+"_lolat"]))),t=Math.max(Math.max.apply(Math,Object(q.a)(this.props.data[this.props.param+"_deep"])),Math.max.apply(Math,Object(q.a)(this.props.data[this.props.param+"_hilat"])),Math.max.apply(Math,Object(q.a)(this.props.data[this.props.param+"_lolat"])));return e===t&&(e-=1,t+=1),[e,t]}},{key:"render",value:function(){for(var e=this.getLimits(),t=this.props.data.pCO2_atmos.length-1,a=this.props.data.pCO2_atmos[t],l=this.props.data[this.props.param+"_deep"][t],s=le(200,51,ae(l,e[0],e[1])),n=this.props.data[this.props.param+"_lolat"][t],o=le(200,51,ae(n,e[0],e[1])),r=this.props.data[this.props.param+"_hilat"][t],p=le(200,51,ae(r,e[0],e[1])),c=_(this.props.data.pCO2_atmos[t]),h=d(.001*this.props.data.DIC_deep[t]*this.props.data.vol_deep[t]),m=d(.001*this.props.data.DIC_lolat[t]*this.props.data.vol_lolat[t]),u=d(.001*this.props.data.DIC_hilat[t]*this.props.data.vol_hilat[t]),v=[],b=0;b<ee.length;b++)v.push(i.a.createElement("div",{className:"legend item"},i.a.createElement("div",{className:"legend key",style:{backgroundColor:ee[b]}}),i.a.createElement("div",{className:"legend label",dangerouslySetInnerHTML:{__html:Z[b]}})));return i.a.createElement("div",{className:"schematic-container"},i.a.createElement("div",{className:"schematic",id:"threebox"},i.a.createElement(te,{id:"atmos",pos:[0,80,100,20],color:"white",value:"pCO<sub>2</sub>: "+a.toPrecision(this.props.var_info.pCO2_atmos.precision),label:"Atmosphere",GtC:c}),i.a.createElement(te,{id:"deep",pos:[0,0,100,50],color:s,value:l.toPrecision(this.props.var_info[this.props.param+"_deep"].precision),label:"Deep Ocean",GtC:h}),i.a.createElement(te,{id:"lolat",pos:[35,50,65,30],color:o,value:n.toPrecision(this.props.var_info[this.props.param+"_deep"].precision),label:"Low Lat. Surface Ocean",GtC:m}),i.a.createElement(te,{id:"hilat",pos:[0,40,35,40],color:p,value:r.toPrecision(this.props.var_info[this.props.param+"_deep"].precision),label:"High Lat. Surface Ocean",GtC:u}),i.a.createElement(Q,{pos:[38,84,22,12],data:this.props.data,npoints:this.props.npoints,variables:["pCO2_atmos_noExch","pCO2_atmos"],var_info:I,label:"pCO<sub>2</sub>",id:"g_atmos_noex"}),i.a.createElement(Q,{pos:[2,54,22,12],data:this.props.data,npoints:this.props.npoints,variables:[this.props.plot_hilat],var_info:I,label:C[this.props.param],id:"g_hilat"}),i.a.createElement(Q,{pos:[76,58,22,12],data:this.props.data,npoints:this.props.npoints,variables:[this.props.plot_lolat],var_info:I,label:C[this.props.param],id:"g_lolat"}),i.a.createElement(Q,{pos:[38,10,22,12],data:this.props.data,npoints:this.props.npoints,variables:[this.props.plot_deep],var_info:I,label:C[this.props.param],id:"g_deep"}),i.a.createElement(se,{fluxes:[d(-this.props.fluxes.exCO2_hilat)],sizes:[.3],centre:[18,20],colors:[ee[0]],label:"Gas exch.",id:"gas"}),i.a.createElement(se,{fluxes:[d(-this.props.fluxes.exCO2_lolat)],sizes:[.3],centre:[70,20],colors:[ee[0]],label:"Gas exch.",id:"gas"}),i.a.createElement(se,{fluxes:[this.props.fluxes.vcirc_DIC_deep/this.props.data.vol_ocean[t]],sizes:[.1],centre:[35,55],colors:[ee[1]],label:"V<sub>circ</sub>",id:"hideep"}),i.a.createElement(se,{fluxes:[this.props.fluxes.vcirc_DIC_lolat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[39,50],colors:[ee[1]],label:"V<sub>circ</sub>"}),i.a.createElement(se,{fluxes:[this.props.fluxes.vcirc_DIC_hilat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[35,42],colors:[ee[1]],label:"V<sub>circ</sub>",id:"lohi"}),i.a.createElement(se,{fluxes:[-this.props.fluxes.vmix_DIC_hilat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[24,60],colors:[ee[2]],label:"V<sub>mix</sub>"}),i.a.createElement(se,{fluxes:[-this.props.fluxes.vmix_DIC_lolat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[54,50],colors:[ee[2]],label:"V<sub>mix</sub>"}),i.a.createElement(se,{fluxes:[-this.props.fluxes.prod_DIC_hilat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[16,60],colors:[ee[3]],label:"\u03c4"}),i.a.createElement(se,{fluxes:[-this.props.fluxes.prod_DIC_lolat/this.props.data.vol_ocean[t]],sizes:[.1],centre:[64,50],colors:[ee[3]],label:"\u03c4"}),i.a.createElement("div",{className:"legend box"},i.a.createElement("h3",null,"Net DIC Fluxes"),v)))}}]),a}(l.Component),se=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;return Object(r.a)(this,a),(l=t.call(this,e)).state={arrowWidthPercent:3,arrowHeightPercent:10},l.style={width:l.props.fluxes.length*l.state.arrowWidthPercent+"%",height:l.state.arrowHeightPercent+"%",left:l.props.centre[0]-l.props.fluxes.length*l.state.arrowWidthPercent/2+"%",top:l.props.centre[1]-.5*l.state.arrowHeightPercent+"%"},l}return Object(p.a)(a,[{key:"render",value:function(){for(var e=[],t=this.props.fluxes.length,a=0,l=0;l<t;l++)e.push(i.a.createElement(ne,{direction:this.props.fluxes[l],width:100/t+"%",amplitude:this.props.sizes[l],color:this.props.colors[l]})),this.props.fluxes[l]>0?a+=1:a-=1;var s={};return a<0?s.bottom="55%":s.top="55%",i.a.createElement("div",{className:"flux-pane",id:this.props.id,style:this.style},i.a.createElement("div",{className:"flux-label",dangerouslySetInnerHTML:{__html:this.props.label},style:s}),e)}}]),a}(l.Component),ne=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"size_2_percent",value:function(e){return Math.abs(50*e/this.props.amplitude)+"%"}},{key:"render",value:function(){var e={width:"33%",backgroundColor:this.props.color};return this.props.direction>=0?(e.bottom="50%",e.height=this.size_2_percent(this.props.direction)):(e.top="50%",e.height=this.size_2_percent(this.props.direction)),i.a.createElement("div",{className:"flux-box",style:{width:this.props.width}},i.a.createElement("div",{className:"flux-arrow",style:e}))}}]),a}(l.Component),oe=a(34),re=a(22),pe=(a(46),i.a.Component,function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"render",value:function(){var e,t=[],a=Object(o.a)(this.props.params);try{for(a.s();!(e=a.n()).done;){var l=e.value;t.push(i.a.createElement(re.a,{key:l,value:l},i.a.createElement("div",{dangerouslySetInnerHTML:{__html:C[l]}})))}}catch(s){a.e(s)}finally{a.f()}return i.a.createElement(oe.a,{type:"radio",name:"plot_params",size:"sm",onChange:this.props.onChange,defaultValue:this.props.defaultValue},t)}}]),a}(i.a.Component)),ce=_(372.8),he=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var l;for(var i in Object(r.a)(this,a),(l=t.call(this,e)).state={start_state:y,now:y,history:{},fluxes:S(y),npoints:200,year_field:200,frameTime:20},l.state.Ks=l.genKs(y),l.state.now)l.state.history[i]=new Array(2).fill(l.state.now[i]);l.state.yearsPerSecond=1/l.state.frameTime*1e3,l.state.schematicParam="pCO2",l.state.model_global_params=["vmix","vcirc"],l.state.model_hilat_params=["tau_hilat","percent_CaCO3_hilat","temp_hilat"],l.state.model_lolat_params=["tau_lolat","percent_CaCO3_lolat","temp_lolat"],l.state.ocean_vars=["pCO2","DIC","pH","CO3","HCO3","CO2"],l.state.plot_atmos=["pCO2_atmos"],l.state.plot_ocean=["pCO2"];for(var s=0,n=["_deep","_hilat","_lolat"];s<n.length;s++){var o=n[s];l.state["plot"+o]=[l.state.plot_ocean[0]+o]}return l.state.start_stop_button="Pause",l.state.running=!0,l.interval=null,l.emitting=!1,l.state.GtC_released=0,l.stepModel=l.stepModel.bind(Object(c.a)(l)),l.startSimulation=l.startSimulation.bind(Object(c.a)(l)),l.stopSimulation=l.stopSimulation.bind(Object(c.a)(l)),l.resetModel=l.resetModel.bind(Object(c.a)(l)),l.toggleSimulation=l.toggleSimulation.bind(Object(c.a)(l)),l.genPlotVars=l.genPlotVars.bind(Object(c.a)(l)),l.genKs=l.genKs.bind(Object(c.a)(l)),l.handleDropdownSelect=l.handleDropdownSelect.bind(Object(c.a)(l)),l.handleParamButtonChange=l.handleParamButtonChange.bind(Object(c.a)(l)),l.handleParamToggle=l.handleParamToggle.bind(Object(c.a)(l)),l.handleParamUpdate=l.handleParamUpdate.bind(Object(c.a)(l)),l.handleVolcano=l.handleVolcano.bind(Object(c.a)(l)),l.toggleEmissions=l.toggleEmissions.bind(Object(c.a)(l)),l.onChangeYears=l.onChangeYears.bind(Object(c.a)(l)),l.onYearsEnter=l.onYearsEnter.bind(Object(c.a)(l)),l.handleUpdateYears=l.handleUpdateYears.bind(Object(c.a)(l)),l.handleSpeedUp=l.handleSpeedUp.bind(Object(c.a)(l)),l.handleSlowDown=l.handleSlowDown.bind(Object(c.a)(l)),l}return Object(p.a)(a,[{key:"startSimulation",value:function(){var e=this;null==this.interval&&(this.interval=setInterval((function(){e.stepModel()}),this.state.frameTime)),this.setState({running:!0})}},{key:"stopSimulation",value:function(){clearInterval(this.interval),this.interval=null,this.setState({running:!1})}},{key:"toggleSimulation",value:function(){null===this.interval?(this.startSimulation(),this.setState({start_stop_button:"Pause"})):(this.stopSimulation(),this.setState({start_stop_button:"Run"}))}},{key:"resetModel",value:function(){this.setState({now:y,fluxes:S(y),history:this.updateHistory(y),Ks:this.genKs(y),GtC_released:0})}},{key:"stepModel",value:function(){var e=this.state.now,t=this.state.GtC_released;this.emitting&&(e.pCO2_atmos+=u(2),t+=2);var a=S(e);(e=function(e,t,a){var l=Object.assign({},e);return l.PO4_deep+=(t.vmix_PO4_hilat+t.vmix_PO4_lolat+t.vcirc_PO4_deep+t.prod_PO4_hilat+t.prod_PO4_lolat)/e.vol_deep,l.PO4_hilat+=(-t.vmix_PO4_hilat+t.vcirc_PO4_hilat-t.prod_PO4_hilat)/e.vol_hilat,l.PO4_lolat+=(-t.vmix_PO4_lolat+t.vcirc_PO4_lolat-t.prod_PO4_lolat)/e.vol_lolat,l.DIC_deep+=(t.vmix_DIC_hilat+t.vmix_DIC_lolat+t.vcirc_DIC_deep+t.prod_DIC_hilat+t.prod_DIC_lolat)/e.vol_deep,l.DIC_hilat+=(-t.vmix_DIC_hilat+t.vcirc_DIC_hilat-t.prod_DIC_hilat+1e3*t.exCO2_hilat)/e.vol_hilat,l.DIC_lolat+=(-t.vmix_DIC_lolat+t.vcirc_DIC_lolat-t.prod_DIC_lolat+1e3*t.exCO2_lolat)/e.vol_lolat,l.TA_deep+=(t.vmix_TA_hilat+t.vmix_TA_lolat+t.vcirc_TA_deep+t.prod_TA_hilat+t.prod_TA_lolat)/e.vol_deep,l.TA_hilat+=(-t.vmix_TA_hilat+t.vcirc_TA_hilat-t.prod_TA_hilat)/e.vol_hilat,l.TA_lolat+=(-t.vmix_TA_lolat+t.vcirc_TA_lolat-t.prod_TA_lolat)/e.vol_lolat,l.pCO2_atmos+=12*(-t.exCO2_hilat-t.exCO2_lolat)/213e13,l=f(l,a)}(e,a,this.state.Ks)).pCO2_atmos_noExch=u(ce+this.state.GtC_released),this.setState({now:e,fluxes:a,history:this.updateHistory(e),GtC_released:t})}},{key:"updateHistory",value:function(e){var t=this.state.history,a=t.DIC_deep.length;for(var l in this.state.now)a>=this.state.npoints&&(t[l]=t[l].slice(a-this.state.npoints+1)),t[l].push(e[l]);return t}},{key:"handleParamButtonChange",value:function(e){this.setState(this.genPlotVars(e))}},{key:"handleParamToggle",value:function(e){var t=this.genPlotVars([e]);t.schematicParam=e,this.setState(t)}},{key:"handleVolcano",value:function(e){var t=this.state.now;t.pCO2_atmos+=u(e),this.setState({now:t,GtC_released:this.state.GtC_released+e})}},{key:"toggleEmissions",value:function(){this.emitting?this.emitting=!1:this.emitting=!0}},{key:"genPlotVars",value:function(e){for(var t={plot_ocean:e,plot_atmos:["pCO2_atmos"]},a=0,l=["_deep","_hilat","_lolat"];a<l.length;a++){var i=l[a];t["plot"+i]=[];var s,n=Object(o.a)(e);try{for(n.s();!(s=n.n()).done;){var r=s.value;t["plot"+i].push(r+i)}}catch(p){n.e(p)}finally{n.f()}}return t}},{key:"genKs",value:function(e){var t={};return t.deep=v({Tc:e.temp_deep,Sal:e.sal_deep}),t.hilat=v({Tc:e.temp_hilat,Sal:e.sal_hilat}),t.lolat=v({Tc:e.temp_lolat,Sal:e.sal_lolat}),t}},{key:"componentDidMount",value:function(){this.startSimulation()}},{key:"componentWillUnmount",value:function(){this.stopSimulation()}},{key:"handleDropdownSelect",value:function(e){this.setState({schematicParam:e})}},{key:"handleParamUpdate",value:function(e,t){var a=this.state.now;a[e]=t,this.setState({now:a,Ks:this.genKs(a)})}},{key:"onChangeYears",value:function(e){this.setState({year_field:e.target.value})}},{key:"onYearsEnter",value:function(e){"Enter"===e.key&&this.setState({npoints:this.state.year_field})}},{key:"handleUpdateYears",value:function(){this.setState({npoints:this.state.year_field})}},{key:"handleSpeedUp",value:function(){var e=this,t=this.state.frameTime/2,a=1/t*1e3;clearInterval(this.interval),this.interval=setInterval((function(){e.stepModel()}),t),this.setState({frameTime:t,yearsPerSecond:a})}},{key:"handleSlowDown",value:function(){var e=this,t=2*this.state.frameTime,a=1/t*1e3;clearInterval(this.interval),this.interval=setInterval((function(){e.stepModel()}),t),this.setState({frameTime:t,yearsPerSecond:a})}},{key:"render",value:function(){return i.a.createElement("div",{id:"main-panel"},i.a.createElement("div",{className:"top-bar"},i.a.createElement("div",{className:"control-container"},i.a.createElement(B,{handleVolcano:this.handleVolcano,handleEmissions:this.toggleEmissions,GtC_released:this.state.GtC_released}),i.a.createElement(X,{title:"Circulation",params:this.state.model_global_params,now:this.state.now,handleUpdate:this.handleParamUpdate}),i.a.createElement(X,{title:"High Latitude",params:this.state.model_hilat_params,now:this.state.now,handleUpdate:this.handleParamUpdate}),i.a.createElement(X,{title:"Low Latitude",params:this.state.model_lolat_params,now:this.state.now,handleUpdate:this.handleParamUpdate}),i.a.createElement(J,{pCO2_atmos:this.state.now.pCO2_atmos,pCO2_atmos_noExch:this.state.now.pCO2_atmos_noExch}))),i.a.createElement("div",{className:"main-display"},i.a.createElement(ie,{param:this.state.schematicParam,data:this.state.history,fluxes:this.state.fluxes,npoints:this.state.npoints,var_info:I,plot_hilat:this.state.plot_hilat,plot_lolat:this.state.plot_lolat,plot_deep:this.state.plot_deep})),i.a.createElement("div",{className:"bottom-bar"},i.a.createElement("div",{id:"plot-controls"},i.a.createElement(pe,{id:"plot-param-toggle",params:this.state.ocean_vars,defaultValue:this.state.plot_ocean,onChange:this.handleParamToggle}),i.a.createElement("div",{id:"time-controls"},i.a.createElement(A.a,{size:"sm",className:"control-bit"},i.a.createElement(A.a.Prepend,null,i.a.createElement(A.a.Text,{id:"basic-addon1"},"Model Years")),i.a.createElement(w.a,{placeholder:"200","aria-label":"200","aria-describedby":"basic-addon2",onChange:this.onChangeYears,onKeyPress:this.onYearsEnter}),i.a.createElement(A.a.Append,null,i.a.createElement(k.a,{onClick:this.handleUpdateYears,size:"sm"},"Set"))),i.a.createElement(D.a,{size:"sm",id:"speed-controls",className:"control-bit"},i.a.createElement(k.a,{onClick:this.handleSlowDown,size:"sm"},"\u2193"),i.a.createElement("div",{id:"speed-label",dangerouslySetInnerHTML:{__html:"Speed<br>"+this.state.yearsPerSecond+" yr/s"}}),i.a.createElement(k.a,{onClick:this.handleSpeedUp,size:"sm"},"\u2191")),i.a.createElement(D.a,{size:"sm",className:"control-bit"},i.a.createElement(k.a,{onClick:this.resetModel,size:"sm"},"Reset"),i.a.createElement(k.a,{onClick:this.toggleSimulation,size:"sm"},this.state.start_stop_button)))),i.a.createElement("div",{className:"bottom-credit"},"\xa9"," ",i.a.createElement("a",{href:"mailto:ob266@cam.ac.uk"},"Oscar Branson"),", Department of Earth Sciences, University of Cambridge")))}}]),a}(i.a.Component);a(130);var me=function(){return i.a.createElement("div",{className:"App"},i.a.createElement(he,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(me,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[113,1,2]]]);
//# sourceMappingURL=main.a0a218b2.chunk.js.map