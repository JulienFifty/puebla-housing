#!/bin/bash

# Script para convertir hero-video.mov a hero-video.mp4
# Requiere ffmpeg instalado

echo "Convirtiendo hero-video.mov a hero-video.mp4..."

if command -v ffmpeg &> /dev/null; then
    cd public
    ffmpeg -i hero-video.mov -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart hero-video.mp4
    echo "✅ Conversión completada: public/hero-video.mp4"
else
    echo "❌ ffmpeg no está instalado."
    echo "Instala ffmpeg con: brew install ffmpeg"
fi

