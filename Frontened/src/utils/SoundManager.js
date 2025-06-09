import { Howl, Howler } from 'howler'

// Sound sources
const SOUNDS = {
  buttonClick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  bubblePop: 'https://assets.mixkit.co/active_storage/sfx/1698/1698-preview.mp3',
  gameStart: 'https://assets.mixkit.co/active_storage/sfx/1818/1818-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/3/3-preview.mp3',
  levelComplete: 'https://assets.mixkit.co/active_storage/sfx/1185/1185-preview.mp3',
  loseLife: 'https://assets.mixkit.co/active_storage/sfx/1811/1811-preview.mp3',
  background: 'https://assets.mixkit.co/active_storage/sfx/541/541-preview.mp3'
}

// Sound instances
const soundInstances = {}

class SoundManager {
  static init() {
    // Load all sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      soundInstances[key] = new Howl({
        src: [url],
        volume: key === 'background' ? 0.3 : 0.5,
        loop: key === 'background',
        preload: true
      })
    })
    
    // Start background music
    this.playBackgroundMusic()
  }
  
  static play(soundName) {
    if (soundInstances[soundName]) {
      soundInstances[soundName].play()
    } else {
      console.warn(`Sound '${soundName}' not found`)
    }
  }
  
  static stop(soundName) {
    if (soundInstances[soundName]) {
      soundInstances[soundName].stop()
    }
  }
  
  static playBackgroundMusic() {
    if (soundInstances.background) {
      soundInstances.background.play()
    }
  }
  
  static stopBackgroundMusic() {
    if (soundInstances.background) {
      soundInstances.background.stop()
    }
  }
  
  static toggleMute() {
    Howler.mute(!Howler.mute())
  }
  
  static stopAll() {
    Object.values(soundInstances).forEach(sound => {
      sound.stop()
    })
  }
}

export default SoundManager