import { useEffect, useState } from "react";
import { Thermometer, Wind, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { SensorCard } from "@/components/SensorCard";
import { AirQualityIndex } from "@/components/AirQualityIndex";
import { StatusBar } from "@/components/StatusBar";
import { UserQrSearch } from "@/components/UserQrSearch";

const ESP_IP = "http://192.168.79.186"; // CHANGE if needed

type SensorData = {
  temperature: number;
  gas: number;
  dust: number;
  airQualityIndex: number;
};

function parseSensorResponse(raw: string) {
  // The device sometimes returns malformed JSON:
  // - NaN values
  // - missing comma between fan and dust (e.g., `"fan":true"dust":26`)
  const sanitized = raw.replace(/\bnan\b/gi, "null");

  return JSON.parse(sanitized);
}

function getTemperatureStatus(temp: number) {
  if (temp >= 20 && temp <= 22)
    return { status: "good" as const, text: "Optimal" };
  if (temp >= 23 && temp <= 26)
    return { status: "moderate" as const, text: "Acceptable" };
  return { status: "poor" as const, text: "Out of range" };
}

function getGasStatus(gas: number) {
  if (gas < 500) return { status: "good" as const, text: "Clean air" };
  if (gas < 800) return { status: "moderate" as const, text: "Fair" };
  return { status: "poor" as const, text: "Ventilate" };
}

function getDustStatus(dust: number) {
  if (dust < 2500) return { status: "good" as const, text: "Excellent" };
  if (dust < 4500) return { status: "moderate" as const, text: "Moderate" };
  return { status: "poor" as const, text: "High PM" };
}

export default function Index() {
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    gas: 0,
    dust: 0,
    airQualityIndex: 0,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${ESP_IP}/status`);
        const text = await res.text();
        const json = parseSensorResponse(text);

        setData({
          temperature: Number(json.temperature) || 0,
          gas: Number(json.gas) || 0,
          dust: Number(json.dust) || 0,
          airQualityIndex: Number(json.airQualityIndex) || 0,
        });

        setIsConnected(true);
        setLastUpdated(new Date());
      } catch (err) {
        setIsConnected(false);
        console.error("ESP32 not reachable");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fan control removed

  const tempStatus = getTemperatureStatus(data.temperature);
  const gasStatus = getGasStatus(data.gas);
  const dustStatus = getDustStatus(data.dust);

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} lastUpdated={lastUpdated} />

      <main className="container mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="mb-8 animate-fade-in">
          <StatusBar
            roomName="Conference Room A - Main Building"
            uptime="4h 23m"
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Air Quality Index - Featured */}
          <div className="lg:row-span-2 animate-fade-in-delay-1">
            <AirQualityIndex score={data.gas} className="h-full" />
          </div>

          {/* User QR search */}
          <div className="animate-fade-in-delay-2">
            <UserQrSearch className="h-full" />
          </div>

          {/* Sensor Cards */}
          <div className="animate-fade-in-delay-2">
            <SensorCard
              title="Temperature"
              value={data.temperature}
              unit="°C"
              icon={Thermometer}
              status={tempStatus.status}
              statusText={tempStatus.text}
            />
          </div>

          <div className="animate-fade-in-delay-3">
            <SensorCard
              title="Gas Level"
              value={data.gas}
              unit="ppm"
              icon={Wind}
              status={gasStatus.status}
              statusText={gasStatus.text}
            />
          </div>

          <div className="animate-fade-in-delay-4">
            <SensorCard
              title="Dust Particles"
              value={data.dust}
              unit="µg/m³"
              icon={Sparkles}
              status={dustStatus.status}
              statusText={dustStatus.text}
            />
          </div>

          {/* Fan Control removed */}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            IoT Air Quality Monitoring System • Real-time Environmental Data
          </p>
        </footer>
      </main>
    </div>
  );
}
