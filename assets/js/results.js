'use strict';
// Values reported in the paper: Table IV (ablations), Table VI (data scale).
const vlaSettings = [
  {key:'seen',label:'Seen',description:'Seen layouts, geometries, and appearances, relative to the full training set.'},
  {key:'layout',label:'Unseen L',description:'L = layout: new object starting positions and placement targets; seen geometries and appearances.'},
  {key:'layout-geometry',label:'Unseen L + G',description:'L = new layouts; G = new object geometries. Object appearance remains seen.'},
  {key:'layout-geometry-appearance',label:'Unseen L + G + A',description:'L = new layouts; G = new object geometries; A = new visual appearances.'},
];
const vlaAblations = [
  {name:'Full data',label:['Full','data'],color:'#477561',values:[97.50,95.00,91.25,91.25]},
  {name:'Without geometry augmentation',label:['No geometry','augmentation'],color:'#baa78b',short:'Geometry aug.',values:[92.50,93.75,75.00,76.25]},
  {name:'Without rendering augmentation',label:['No rendering','augmentation'],color:'#8eabb2',short:'Rendering aug.',values:[91.25,88.75,87.50,76.25]},
  {name:'Without grasp-mode text',label:['No grasp','mode text'],color:'#b28c83',short:'Grasp-mode text',values:[80.00,80.00,76.25,70.00]},
];
const vlaDataScales = [
  {name:'1% of training data',label:'1%',color:'#d0c5b3',values:[67.50,38.75,31.25,28.75]},
  {name:'10% of training data',label:'10%',color:'#95aa8f',values:[85.00,87.50,90.00,85.00]},
  {name:'100% of training data',label:'100%',color:'#477561',values:vlaAblations[0].values},
];
let vlaSetting = 3;
const plotMono='Menlo, Consolas, "Liberation Mono", monospace';
const plotLabels={
  id:'percentLabels',
  afterDatasetsDraw(chart){
    const {ctx}=chart;ctx.save();ctx.fillStyle='#393d35';ctx.font=(chart.width>700?'16px ':'11px ')+plotMono;ctx.textAlign='center';ctx.textBaseline='bottom';
    chart.getDatasetMeta(0).data.forEach((bar,i)=>ctx.fillText(chart.data.datasets[0].data[i].toFixed(2)+'%',bar.x,bar.y-7));
    ctx.restore();
  },
};
const plotBackground={id:'plotBackground',beforeDraw(chart){const {ctx}=chart;ctx.save();ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,chart.width,chart.height);ctx.restore();}};
function makeVlaPlot(id,rows,axisLabel){
  return new Chart($(id),{
    type:'bar',
    data:{labels:rows.map(row=>row.label),datasets:[{label:'Success (%)',data:rows.map(row=>row.values[vlaSetting]),backgroundColor:rows.map(row=>row.color),borderRadius:3,barPercentage:.7,categoryPercentage:.78,maxBarThickness:72}]},
    options:{responsive:true,maintainAspectRatio:false,animation:reducedMotion.matches?false:{duration:550},layout:{padding:{top:25,right:5,left:0}},
      plugins:{legend:{display:false},title:{display:false},tooltip:{backgroundColor:'#30372f',titleFont:{family:plotMono,size:11},bodyFont:{family:plotMono,size:11},padding:12,callbacks:{title:items=>rows[items[0].dataIndex].name,label:item=>'Success: '+item.raw.toFixed(2)+'%'}}},
      scales:{y:{min:0,max:100,border:{display:false},grid:{color:'#e9e3d9',drawTicks:false},ticks:{stepSize:25,color:'#8a8377',padding:7,font:{family:plotMono,size:10}},title:{display:true,text:'Pick-and-place success (%)',color:'#80796d',font:{family:plotMono,size:10}}},
        x:{border:{color:'#d9d1c4'},grid:{display:false},ticks:{color:'#6e695f',font:{family:plotMono,size:10,lineHeight:1.4},maxRotation:0,autoSkip:false},title:{display:!!axisLabel,text:axisLabel,color:'#80796d',font:{family:plotMono,size:10}}}},
    },plugins:[plotBackground,plotLabels],
  });
}
const vlaCharts={ablation:makeVlaPlot('#ablation-chart',vlaAblations,''),scale:makeVlaPlot('#scale-chart',vlaDataScales,'Fraction of generated training data')};
function showVlaSetting(index){
  vlaSetting=index;
  const setting=vlaSettings[index],full=vlaAblations[0].values[index];
  selectTab($('#evidence-settings'),$('#evidence-setting-'+index));
  $('#evidence-panels').setAttribute('aria-labelledby','evidence-setting-'+index);
  $('#evidence-context').textContent=setting.description;
  for(const [name,rows] of [['ablation',vlaAblations],['scale',vlaDataScales]]){
    const values=rows.map(row=>row.values[index]);
    vlaCharts[name].data.datasets[0].data=values;vlaCharts[name].update();
    $('#'+name+'-chart').setAttribute('aria-label',setting.label+'. '+rows.map((row,i)=>row.name+': '+values[i].toFixed(2)+'%').join('; '));
    $('#'+name+'-download').href='assets/figures/vla-'+name+'-'+setting.key+'.png';
  }
  $('#ablation-drops').replaceChildren();
  vlaAblations.slice(1).forEach(row=>{
    const item=element('div','');item.append(element('strong','','−'+(full-row.values[index]).toFixed(2)+' pp'),element('span','',row.short));$('#ablation-drops').append(item);
  });
  $('#scale-gain').replaceChildren(element('strong','','+'+(full-vlaDataScales[0].values[index]).toFixed(2)+' pp'),element('span','','1% → 100% training data'));
}
function exportVlaPlot(name){
  const chart=vlaCharts[name],setting=vlaSettings[vlaSetting];
  chart.stop();chart.update('none');
  const w=chart.width,h=chart.height,scale=window.devicePixelRatio;
  const canvas=document.createElement('canvas');canvas.width=w*scale;canvas.height=(h+95)*scale;
  const ctx=canvas.getContext('2d');ctx.scale(scale,scale);ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,w,h+95);
  ctx.fillStyle='#343c32';ctx.font='bold 15px '+plotMono;
  ctx.fillText(name==='ablation'?'Data-ingredient ablations':'Effect of training-data scale',12,24);
  ctx.font='10px '+plotMono;ctx.fillStyle='#80776b';ctx.fillText(setting.label+' · Simulation VLA',12,43);
  ctx.drawImage(chart.canvas,0,60,w,h);
  ctx.fillText('Table '+(name==='ablation'?'IV':'VI')+' · 8 grasp modes × 10 trials per setting',12,h+83);
  return canvas.toDataURL('image/png');
}
for(const name of ['ablation','scale'])$('#'+name+'-download').addEventListener('click',event=>{
  event.currentTarget.href=exportVlaPlot(name);
  event.currentTarget.download='vla-'+name+'-'+vlaSettings[vlaSetting].key+'.png';
});
$('#evidence-settings').addEventListener('click',event=>{const button=event.target.closest('[data-setting]');if(button)showVlaSetting(Number(button.dataset.setting));});
showVlaSetting(vlaSetting);
