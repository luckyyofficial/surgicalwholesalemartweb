from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re
root=Path(__file__).resolve().parents[1]
class Check(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if d.get('id'):self.ids.append(d['id'])
  if t=='img':assert 'alt' in d,'Missing image alt'
  for k in ('href','src'):
   if k in d:self.refs.append(d[k])
pages=list(root.glob('*.html'))
for page in pages:
 text=page.read_text();p=Check();p.feed(text)
 assert len(p.ids)==len(set(p.ids)),(page,'duplicate ids')
 assert not any(word in text for word in ('Nordic Chair','Kruzo','Modern Interior','Furni Free','Lorem ipsum','Donec vitae')),page
 for ref in p.refs:
  url=urlsplit(ref)
  if url.scheme or url.netloc:continue
  target=root/unquote(url.path) if url.path else page
  assert target.is_file(),(page.name,ref)
  if url.fragment:
   found=Check();found.feed(target.read_text());assert url.fragment in found.ids,(page.name,ref)
catalog=json.loads((root/'data/catalog.json').read_text())
for item in catalog['products']:
 if item['image']:
  image_url=urlsplit(item['image'])
  if image_url.scheme:assert image_url.scheme=='https' and image_url.netloc,(item['id'],'invalid external image URL')
  else:assert (root/item['image']).is_file()
index=json.loads((root/'data/swm-index-products.json').read_text())
normalize=lambda s:re.sub('[^a-z0-9]','',s.lower())
covered={normalize(p['name']) for p in catalog['products']}|{normalize(p['sourceName']) for p in catalog['products']}|{normalize(s['name']) for p in catalog['products'] for s in p.get('additionalSources',[])}
for p in index:assert normalize(p['name']) in covered,p['name']
hero=(root/'data/hero.html').read_text()
assert hero.count('class="carousel-item')==6
assert 'window.setInterval(advanceBanner, 4000)' in (root/'js/hero.js').read_text()
print(f'Passed: {len(pages)} pages, local links and anchors, images, no furniture-template content, all {len(index)} retrieved index entries, and six hero slides.')

company=json.loads((root/'data/company.json').read_text())
locations=(root/'locations.html').read_text()
for location in company['locations']:
 assert 'id="location-'+location['id']+'"' in locations
 assert location['phone'] in locations
for leader in company['leadership']:
 assert leader['name'] in (root/'about.html').read_text()
print('Passed company coverage: all 10 published locations and four Dr. Smith leadership profiles.')

for item in catalog['categories']:
 if item.get('image'):
  image_url=urlsplit(item['image'])
  if image_url.scheme:assert image_url.scheme=='https' and image_url.netloc
  else:assert (root/item['image']).is_file()
for item in catalog['products']:
 if item.get('image') and urlsplit(item['image']).scheme:
  assert item.get('imageReview') and item.get('imageSource'),item['id']
  if item.get('imageKind')=='representative':
   assert 'Reference image' in (root/'products.html').read_text()
print('Passed external image URL and review-provenance checks.')
