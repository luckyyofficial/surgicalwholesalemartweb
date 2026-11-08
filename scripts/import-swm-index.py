"""Merge previously retrieved public index data; no network requests."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[1]
text=Path('/tmp/swm-index.txt').read_text()
d=json.loads((root/'data/catalog.json').read_text())
# The index groups individual product links underneath each source category.
current=None; entries=[]
for line in text.splitlines():
 line=re.sub(r'^L\d+: ?', '',line)
 m=re.search(r'【\d+†\s*】【\d+†([^】]+)】',line)
 if m: current=m.group(1).strip();continue
 m=re.match(r'\s*\* 【\d+†([^】]+)】',line)
 if current and m and m.group(1).strip() not in ('View All',):entries.append((current,m.group(1).strip()))
 if line.startswith('X') or line.startswith('Product Videos'):current=None

def category(group,name):
 s=group.lower()
 if any(w in s for w in ['instrument set','surgical instruments']):return 'instruments'
 if any(w in s for w in ['mask','ppe']):return 'consumables'
 if any(w in s for w in ['gas','flow meter','modular operation','theater door','head panel']):return 'mgps'
 if any(w in s for w in ['bed','trolley','trolleys','furniture','stool','chair','stretcher','couch','operation table','ot table','delivery','instrument cabinet','spine board']):return 'furniture'
 return 'equipment'
def dept(group):
 s=group.lower()
 if any(w in s for w in ['icu','monitor','ventilator','oxygen','suction','bipap','cpap']):return 'icu'
 if any(w in s for w in ['table','ot light','anaesthesia','anesthesia','instrument','modular','gas','autoclave','insufflator','endoscopy']):return 'ot'
 if any(w in s for w in ['bed','chair','locker','stool','panel']):return 'ward'
 if any(w in s for w in ['stretcher','spine']):return 'emergency'
 return 'opd'
def key(s):return re.sub('[^a-z0-9]','',s.lower())
known={key(p['name']):p for p in d['products']};known.update({key(p['sourceName']):p for p in d['products']})
# Hand-reviewed exact naming aliases, rather than merging distinct models.
aliases={'deluxeexaminationcouch':'9065d7fe01a7','otexaminationlight':'4faf3d170da3','manualwheelchair':'046172436ac2','suctionmachinesms':'754d8a1e3199'}
byid={p['id']:p for p in d['products']}
added=[]
for group,name in entries:
 k=key(name)
 existing=known.get(k) or byid.get(aliases.get(k))
 if existing:
  existing.setdefault('additionalSources',[])
  if not any(x.get('name')==name for x in existing['additionalSources']):existing['additionalSources'].append({'name':name,'url':'https://www.surgicalwholesalemart.co.in/products-and-services.html'})
  continue
 id='swm-'+hashlib.sha256(k.encode()).hexdigest()[:12]
 p=dict(id=id,name=name,category=category(group,name),subcategory=group,department=dept(group),image=None,features=[group,'Configuration on enquiry'],description=f'{name}, listed in the {group} range. Ask our team for the current specification, product photograph, availability and quotation.',source='https://www.surgicalwholesalemart.co.in/products-and-services.html',sourceName=name,imageSource=None,photoStatus='request',origin='swm')
 d['products'].append(p);added.append(p);known[k]=p
for c in d['categories']:
 if any(p['category']==c['id'] for p in d['products']):c['enquiryOnly']=False
# Include source evidence in the repository so generation is reproducible.
(root/'data/swm-index-products.json').write_text(json.dumps([{'sourceCategory':g,'name':n} for g,n in entries],indent=2)+'\n')
(root/'data/catalog.json').write_text(json.dumps(d,indent=2)+'\n')
print(f'Imported {len(added)} unique additional listings from {len(entries)} index entries; total {len(d["products"])} products.')
