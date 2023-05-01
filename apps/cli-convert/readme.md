#cli cpu whisper

#setup

- yarn install
- download an put to `cmd`
  - ffmpeg.exe from https://ffmpeg.org/download.html
  - whisper-blas-bin-x64 from https://github.com/ggerganov/whisper.cpp/releases
- done

#usage

- put needed video files to `input` folder
- run `yarn dev`


```
ffmpeg -n -loglevel error -i 27.04_SYNC.mp4 -vcodec libx264 -crf 28 -preset faster -tune film outputfilename.mp4

ffmpeg -i outputfilename.mp4 -vf "scale=trunc(iw/10)*2:trunc(ih/10)*2" -c:v libx264 -crf 28 a_fifth_the_frame_size.mp4

ffmpeg -i outputfilename.mp4 -vf "scale=trunc(iw/10)*2:trunc(ih/10)*2" -c:v libx264 -crf 28 a_fifth_the_frame_size.mp4
```
