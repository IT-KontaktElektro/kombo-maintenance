import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MQTTProvider } from './context/mqtt-store.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MQTTProvider>
      <App />
    </MQTTProvider>
  </BrowserRouter>
)
