import DailyInfo from './components/DailyInfo';
import Taproom from './components/Taproom';

function App() {
  return (
    <>
      <div className="flex flex-col items-center p-4 gap-4">
        <DailyInfo />
        <Taproom />
      </div>
    </>
  );
}

export default App;
