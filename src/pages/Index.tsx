import { useEffect, useState } from "react";
import { Thermometer, Wind, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { SensorCard } from "@/components/SensorCard";
import { AirQualityIndex } from "@/components/AirQualityIndex";
import { FanControl } from "@/components/FanControl";
import { StatusBar } from "@/components/StatusBar";

const ESP_IP = "http://10.176.130.20"; // CHANGE if needed

type SensorData = {
    temperature: number;
    gas: number;
    dust: number;
    airQualityIndex: number;
    fan: boolean;
};

function parseSensorResponse(raw: string) {
    // The device sometimes returns malformed JSON:
    // - NaN values
    // - missing comma between fan and dust (e.g., `"fan":true"dust":26`)
    const sanitized = raw
        .replace(/\bnan\b/gi, "null")
        .replace(/("fan":\s*(?:true|false))"/i, '$1,"');

    return JSON.parse(sanitized);
}

function getTemperatureStatus(temp: number) {
    if (temp >= 20 && temp <= 24) return { status: "good" as const, text: "Optimal" };
    if (temp >= 18 && temp <= 26) return { status: "moderate" as const, text: "Acceptable" };
    return { status: "poor" as const, text: "Out of range" };
}

function getGasStatus(gas: number) {
    if (gas < 500) return { status: "good" as const, text: "Clean air" };
    if (gas < 800) return { status: "moderate" as const, text: "Fair" };
    return { status: "poor" as const, text: "Ventilate" };
}

function getDustStatus(dust: number) {
    if (dust < 50) return { status: "good" as const, text: "Excellent" };
    if (dust < 100) return { status: "moderate" as const, text: "Moderate" };
    return { status: "poor" as const, text: "High PM" };
}

export default function Index() {
    const [data, setData] = useState<SensorData>({
        temperature: 0,
        gas: 0,
        dust: 0,
        airQualityIndex: 0,
        fan: false,
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
                    fan: Boolean(json.fan),
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

    const toggleFan = async (turnOn: boolean) => {
        const endpoint = turnOn ? "/fan/on" : "/fan/off";

        try {
            const res = await fetch(`${ESP_IP}${endpoint}`, { method: "POST" });
            console.log(res)
            if (!res.ok) throw new Error(`Fan toggle failed: ${res.status}`);
            setData(prev => ({ ...prev, fan: turnOn }));
        } catch (err) {
            console.error(err);
        }
    };


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
                        <AirQualityIndex
                            score={data.gas}
                            className="h-full"
                        />
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

                    {/* Fan Control */}
                    <div className="md:col-span-2 lg:col-span-1 animate-fade-in-delay-4">
                        <FanControl
                            isOn={data.fan}
                            onToggle={toggleFan}

                            className="h-full"
                        />
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-sm text-muted-foreground">
                    <p>IoT Air Quality Monitoring System • Real-time Environmental Data</p>
                </footer>
            </main>
        </div>
    );
}

