import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";

interface Helpline {
  name: string;
  phone: string;
  category: string;
  region: string;
}

interface Location {
  lat: number;
  lng: number;
}

const EmergencySOS: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [loading, setLoading] = useState(false);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  }, []);

  // SOS button
  const handleSOS = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8001/api/helpline");
      setHelplines(res.data);
    } catch (error) {
      console.error("Error fetching helplines:", error);
      alert("Failed to fetch helplines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-yellow-500" />
          <h2 className="text-xl font-semibold mb-2">Detecting Location...</h2>
          <p className="text-muted-foreground">Please allow location access for emergency services.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            🚨 Emergency SOS
          </h1>
          <p className="text-muted-foreground">
            Quick access to mental health helplines and emergency services
          </p>
        </div>

        {/* MAP CARD */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Location</h2>
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="rounded-lg"
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </Card>

        {/* SOS BUTTON */}
        <Card className="p-6 mb-6 text-center">
          <Button
            onClick={handleSOS}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
            size="lg"
          >
            <AlertTriangle className="mr-2 w-6 h-6" />
            {loading ? "Fetching Helplines..." : "🚨 SOS – Get Helplines"}
          </Button>
        </Card>

        {/* HELPLINES LIST */}
        {helplines.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Helplines</h2>
            <div className="space-y-4">
              {helplines.map((h, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{h.name}</h3>
                    <p className="text-sm text-muted-foreground">{h.category} • {h.region}</p>
                  </div>
                  <Button asChild variant="outline" className="ml-4">
                    <a href={`tel:${h.phone}`} className="flex items-center">
                      <Phone className="mr-2 w-4 h-4" />
                      {h.phone}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default EmergencySOS;
