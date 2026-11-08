"""Apply visually reviewed photo manifests without overwriting existing photos."""
import json
from pathlib import Path
from urllib.parse import urlsplit
root=Path(__file__).resolve().parents[1]
path=root/'data/catalog.json'
data=json.loads(path.read_text())
byid={p['id']:p for p in data['products']}
applied=[]
for manifest in sorted((root/'data').glob('image-research-*.json')):
 if manifest.name.endswith('-unresolved.json'):continue
 for photo in json.loads(manifest.read_text()):
  assert photo['id'] in byid,(manifest,photo['id'])
  url=urlsplit(photo['url'])
  assert url.scheme=='https' and url.netloc,(manifest,photo['url'])
  assert photo['kind'] in ['exact','representative'],photo
  assert photo.get('notes') and photo.get('sourcePage'),photo
  p=byid[photo['id']]
  if p.get('image'):continue
  p.update(image=photo['url'],imageSource=photo['sourcePage'],imageKind=photo['kind'],imageReview=photo['notes'],imageReviewed='2026-11-08')
  p.pop('photoStatus',None)
  applied.append(photo['id'])
path.write_text(json.dumps(data,indent=2)+'\n')
report=dict(added=len(applied),withPhotos=sum(bool(p['image']) for p in data['products']),withoutPhotos=sum(not p['image'] for p in data['products']),total=len(data['products']))
(root/'data/image-coverage.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
