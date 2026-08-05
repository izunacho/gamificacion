import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Missions } from './pages/Missions';
import { Projects } from './pages/Projects';
import { Shop } from './pages/Shop';
import { useGameStore } from './store/useGameStore';

const DAILY_RESET_CHECK_INTERVAL_MS = 60_000;

function App() {
  const processDailyReset = useGameStore((s) => s.processDailyReset);

  useEffect(() => {
    processDailyReset();
    const interval = setInterval(processDailyReset, DAILY_RESET_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [processDailyReset]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="misiones" element={<Missions />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="tienda" element={<Shop />} />
      </Route>
    </Routes>
  );
}

export default App;
