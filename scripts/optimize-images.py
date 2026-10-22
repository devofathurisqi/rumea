from PIL import Image, ImageOps
from pathlib import Path
base=Path('public/assets/images')
for file in base.glob('*.jpg'):
    im=ImageOps.exif_transpose(Image.open(file)).convert('RGB')
    im.thumbnail((1200,1600))
    im.save(file.with_suffix('.webp'),'WEBP',quality=88,method=6)
for file in list(base.glob('*.webp')):
    if any(file.stem.endswith('-'+str(w)) for w in [360,640,960]): continue
    im=Image.open(file)
    for width in [360,640,960]:
        if im.width<=width: continue
        small=im.copy()
        small.thumbnail((width,round(width*im.height/im.width)))
        small.save(file.with_name(file.stem+'-'+str(width)+'.webp'),'WEBP',quality=84,method=5)
print('Responsive WebP assets ready.')
