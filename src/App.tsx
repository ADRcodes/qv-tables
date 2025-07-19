import DailyInfo from './components/DailyInfo';
import Footer from './components/Footer';
import Taproom from './components/Taproom';

function App() {
  return (
    <>
      <div className="flex justify-center md:flex-row flex-col items-center flex-wrap p-4 gap-4">
        <Taproom />
        <DailyInfo />
      </div>
      <Footer />
    </>
  );
}

export default App;
