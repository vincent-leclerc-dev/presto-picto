import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import 'react-image-crop/dist/ReactCrop.css';
import './styles/App.css';

import lightTheme from './styles/lightTheme';

import Footer from './components/Footer';
import TopBar from './components/TopBar';
import ConfigProvider from './contexts/ConfigProvider';
import EditorPage from './pages/editor';
import ImportComponent from './pages/import';
import ParametersPage from './pages/parameters';
import PictosPage from './pages/pictos';
import TestsPage from './pages/tests';
import UploadPage from './pages/upload';

export default function App() {
  return (
    <ConfigProvider>
      <HashRouter>
        <ThemeProvider theme={lightTheme}>
          <TopBar />
          <div
            className="fixed left-0 top-[42px] bottom-[42px] w-full overflow-y-auto dark:bg-gradient-to-b dark:from-neutral-600 dark:via-neutral-700 dark:to-neutral-900
            "
          >
            <Routes>
              <Route path="/" element={<EditorPage />} />
              <Route path="/pictos" element={<PictosPage />} />
              <Route path="/picto" element={<UploadPage />} />
              <Route path="/picto/:pictoId" element={<UploadPage />} />
              <Route path="/import" element={<ImportComponent />} />
              <Route path="/parameters" element={<ParametersPage />} />
              <Route path="/tests" element={<TestsPage />} />
            </Routes>
          </div>
          <Footer />
        </ThemeProvider>
      </HashRouter>
    </ConfigProvider>
  );
}
