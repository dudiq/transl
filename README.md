## This is transl, whisper web part to convert video to text

based on https://github.com/mayeaux/generate-subtitles


## Setup

Install:
- anaconda
- inside anaconda powershell, install whisper
  - pip uninstall torch
  - pip cache purge
  - pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
  - $env:PYTHONIOENCODING='utf-8'
- ffmpeg as python (conda install ffmpeg)
- cuda drivers (if nvidia)
- yarn install
- yarn dev

open localhost:4545 and upload few video files to extract text
