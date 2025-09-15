import { PromptSidebar } from '@/components/PromptSidebar';
import './App.css';

function App() {
  return (
    <div className="h-screen bg-background text-foreground w-full" style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <PromptSidebar />
    </div>
  );
}

export default App;
