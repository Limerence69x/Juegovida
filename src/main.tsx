import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ArtGallery } from './components/screens/ArtGallery.tsx'
import './index.css'

const galeria = new URLSearchParams(location.search).has('galeria')

createRoot(document.getElementById('root')!).render(<StrictMode>{galeria ? <ArtGallery /> : <App />}</StrictMode>)
