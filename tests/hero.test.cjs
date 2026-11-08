const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs');
test('all six hero transitions render composed scenes and clean up',()=>{
 let slides=[];
 class El {
  constructor(cls=''){this.className=cls;this.children=[];this.dataset={};this.style={setProperty(){}};this.clientHeight=508;this.clientWidth=1800;this.classList={add(){},remove(){}};}
  appendChild(el){this.children.push(el);el.parent=this;return el;}
  setAttribute(){} contains(){return false;}
  get firstElementChild(){return this.children[0];}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
  querySelector(s){if(s==='img')return this.img;if(s==='.hero-scene')return this.scene;if(s==='.carousel-item.active')return slides[0];}
  querySelectorAll(s){return s==='.carousel-item'?slides:[];}
  cloneNode(){return new El(this.className);}
 }
 slides=Array.from({length:6},()=>{const s=new El();s.img={complete:true,naturalWidth:2172};s.scene=new El('hero-scene');s.dataset.headerColor='#00383b';return s;});
 const hero=new El();let advance,finish;
 const doc={hidden:false,body:new El(),getElementById(){return hero;},createElement(){return new El();}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../js/hero.js'),'utf8'),{document:doc,window:{matchMedia(){return {matches:false};},setInterval(fn,ms){assert.equal(ms,4000);advance=fn;},setTimeout(fn){finish=fn;}}});
 const counts={'cube-wave':5,iris:1,mosaic:32,curtains:3,zoom:1,diagonal:1};const seen=new Set();
 for(let i=0;i<6;i++){advance();const overlay=hero.children[0];seen.add(overlay.dataset.effect);assert.equal(overlay.children.length,counts[overlay.dataset.effect]);finish();assert.equal(hero.children.length,0);}
 assert.equal(seen.size,6);
 doc.hidden=true;advance();assert.equal(hero.children.length,0);
});
