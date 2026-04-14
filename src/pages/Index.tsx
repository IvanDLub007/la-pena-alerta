import { useState } from "react";
import BottomNav, { type Tab } from "@/components/BottomNav";
import WaterMonitor from "@/components/WaterMonitor";
import RiskMap from "@/components/RiskMap";
import EmergencyGuide from "@/components/EmergencyGuide";
import ResilienceModule from "@/components/ResilienceModule";
import TechnicalGuides from "@/components/TechnicalGuides";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const [tab, setTab] = useState<Tab>("monitor");
  const [key, setKey] = useState(0);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === "monitor") setKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen pb-20">
      {tab === "monitor" && <WaterMonitor key={key} />}
      {tab === "map" && <RiskMap />}
      {tab === "emergency" && <EmergencyGuide />}
      {tab === "resilience" && <ResilienceModule />}
      {tab === "guides" && <TechnicalGuides />}
      {tab === "admin" && <AdminPanel />}
      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
};

export default Index;
