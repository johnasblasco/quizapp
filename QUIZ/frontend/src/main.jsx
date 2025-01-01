import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { CursorProvider } from './Cursorcontext.jsx';
import CustomCursor from './CustomCursor.jsx';

createRoot(document.getElementById('root')).render(
      <StrictMode>
            <CursorProvider>
                  <CustomCursor />
                  <BrowserRouter>
                        <App />
                  </BrowserRouter>
            </CursorProvider>
      </StrictMode>,
)
