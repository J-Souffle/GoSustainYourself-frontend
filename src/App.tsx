import RecycleCenterMap from "./components/RecycleCenterMap";
import DashboardPage from './dashboard/page';

function App() {
  return (
    <div>
  <DashboardPage />
  <div className="flex flex-wrap px-4 lg:px-6 gap-4">
  <div className="flex-1">
  <h1 className="text-center text-xl font-bold"
        style={{
          color: "rgba(0, 180, 0, 0.5)", // Custom green color
          fontWeight: "bold", // Makes the text bold
        }}
      >Find Recycling Centers Near You</h1>
  </div>
  <div className="w-full">
    <RecycleCenterMap className="w-full" />
  </div>
</div>

</div>

  );
}

export default App;
