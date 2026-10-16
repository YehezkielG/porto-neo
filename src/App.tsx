import Public from './pages/Public';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Public />
    </ThemeProvider>
  );
}

export default App;
