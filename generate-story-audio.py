import asyncio, hashlib, html, json, re, sys
from pathlib import Path
root = Path(__file__).parent
sys.path.insert(0, str(root / '.build-tools'))
import edge_tts
from mutagen.mp3 import MP3
site = root
folder = site / 'assets/audio'
folder.mkdir(parents=True, exist_ok=True)
voice, rate = 'vi-VN-HoaiMyNeural', '-5%'
source = (site / 'assets/js/main.js').read_text(encoding='utf-8').split('const articlesData = {',1)[1].split('function openArticleModal',1)[0]
stories = re.findall(r'title:\s*"([^"]+)".*?content:\s*`([^`]+)`', source, re.S)
assert len(stories)==5
async def main():
    tracks = {}
    for i,(title,content) in enumerate(stories,1):
        content_hash = hashlib.sha256((title+'\n'+content).encode()).hexdigest()
        file_hash = hashlib.sha256((content_hash+voice+rate).encode()).hexdigest()[:12]
        filename = f'story-{i}-{file_hash}.mp3'
        dest = folder / filename
        text = html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'</(?:p|blockquote)>', '.\n', content)))
        text = re.sub(r'\s+', ' ', title+'. '+text).strip()
        text = re.sub(r'([.!?])\s*\.', r'\1', text)
        if not dest.exists() or dest.stat().st_size < 1000:
            temporary = dest.with_suffix('.mp3.part')
            await asyncio.wait_for(edge_tts.Communicate(text, voice, rate=rate).save(str(temporary)),timeout=60)
            MP3(temporary)
            temporary.replace(dest)
        audio = MP3(dest)
        tracks[str(i)]={'src':'assets/audio/'+filename,'contentHash':content_hash,'seconds':round(audio.info.length,1),'bytes':dest.stat().st_size}
        print(json.dumps({'story':i,**tracks[str(i)]}),flush=True)
    (folder/'manifest.json').write_text(json.dumps({'voice':voice,'rate':rate,'tracks':tracks},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
asyncio.run(main())

