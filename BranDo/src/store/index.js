import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#1d4ed8',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './BranDo.png',
  fullDecal: './BranDoTitle.png',
});

export default state;