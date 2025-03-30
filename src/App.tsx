import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecycleCenterMap from "./components/RecycleCenterMap";
import DashboardPage from './dashboard/page';

function App() {
  return (
    <div>
  <DashboardPage />
  <div className="flex flex-col w-screen px-4 gap-4">
    <div className="w-full">
      <h1 className="text-center text-xl font-bold"
        style={{
          color: "rgba(0, 180, 0, 0.5)", // Custom green color
          fontWeight: "bold", // Makes the text bold
        }}
      >Find Recycling Places Near You</h1>
    </div>
    <div className="w-full">
      <RecycleCenterMap />
    </div>
  </div>
</div>

  );
}

export default App;
