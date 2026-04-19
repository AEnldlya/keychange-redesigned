# Key Change — Hero Video Prompts for Nano Banana

Place the generated video at: `/public/assets/hero-video.mp4`

The hero section is scroll-activated: as the user scrolls down,
Framer Motion drives `video.currentTime` forward through the clip.
**Generate a 6–10 second clip. Keep it slow, deliberate, and cinematic.**

---

## PROMPT 1 — Instruments Awakening (Recommended)

> Cinematic macro close-up sequence. A collection of musical instruments — 
> acoustic guitar, brass trumpet, wooden flute, violin — resting on a 
> dark weathered wooden surface. Soft golden side-lighting. The camera 
> slowly drifts forward. Dust motes float in a single beam of warm light 
> falling across the guitar strings. Ultra slow motion. Film grain. 
> No people. No text. Aspect ratio 16:9. Photorealistic. 6 seconds.

**Settings:**
- Duration: 6–8 seconds
- Style: Cinematic / Film
- Motion: Ultra Slow / Creep forward
- Aspect: 16:9
- No audio needed (muted in code)

---

## PROMPT 2 — Hands on Strings

> Extreme close-up of young hands gently pressing guitar strings. 
> Shallow depth of field. Bokeh background of a sunlit classroom. 
> The camera pulls back very slowly to reveal the neck of an acoustic 
> guitar. Warm amber and cream tones. Soft natural window light. 
> Cinematic slow motion, 24fps look. No faces visible. 8 seconds.

---

## PROMPT 3 — Abstract Music + Movement

> Abstract cinematic loop: sound waves visualized as rippling golden 
> light on a dark navy surface. Thin horizontal lines of light pulse 
> outward like a plucked string. Occasionally a silhouette of a violin 
> appears briefly out of focus. Very subtle, minimal, elegant. 
> Dark blue-black background, gold accents. 6 seconds seamless loop. 
> Ultra smooth camera drift.

---

## PROMPT 4 — Instrument Collection Pan

> Overhead drone-style pan across a flat lay of carefully arranged 
> musical instruments: guitar, trumpet, snare drum, violin, flute, 
> keyboard keys. Dark textured concrete surface. Each instrument 
> slightly worn, clearly loved. Slow top-down camera drift from right 
> to left. Cinematic color grade — desaturated with warm highlights. 
> 8 seconds. No text, no people, no logos.

---

## HOW TO USE IN THE SITE

1. Generate your chosen video (any of the prompts above)
2. Export as **MP4, H.264, 1920×1080**
3. Place the file at:
   ```
   keychange-redesigned/public/assets/hero-video.mp4
   ```
4. The scroll-activated code in `app/page.jsx` will automatically:
   - Play the video forward as the user scrolls
   - Fall back to `hero.webp` if the video hasn't loaded yet
   - Scale and parallax the video layer on scroll

## TECHNICAL NOTES

- **Duration**: 6–10 seconds ideal. Longer clips = more scroll range per frame.
- **Loop**: Set `loop={false}` in the code — the video scrubs with scroll, 
  it does not loop autonomously.
- **File size**: Compress to under 8MB for fast load. Use HandBrake or ffmpeg:
  ```
  ffmpeg -i input.mp4 -vcodec h264 -crf 23 -preset slow -vf scale=1920:-2 hero-video.mp4
  ```
- **Fallback**: `hero.webp` is always shown behind the video via CSS z-index,
  so the hero looks great even before the video loads.
