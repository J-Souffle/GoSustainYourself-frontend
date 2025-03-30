import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecycleCenterMap from "./components/RecycleCenterMap";
import DashboardPage from './dashboard/page';

function App() {
  return (
    <div>
      <DashboardPage />
      <div className="flex flex-wrap px-4 lg:px-6 gap-4">
        <div className="flex-1">
          <h1>Find Recycling Centers Near You</h1>
        </div>
        <div className="flex-1">
          <RecycleCenterMap />
        </div>
      </div>
    </div>
  );
}

export default App;
