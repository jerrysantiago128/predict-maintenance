import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { create } from 'zustand';
import { io } from 'socket.io-client';

// --- 0. Tailwind CSS CDN (Included in the HTML wrapper for Canvas) ---
// This code assumes Tailwind CSS is loaded via a CDN or build process.
// Example for CDN: <script src="https://cdn.tailwindcss.com"></script>

// --- 1. React Query Setup ---
// Create a client for React Query to manage server state caching, refetching, etc.
const queryClient = new QueryClient();

// --- 2. Zustand Store for Client UI State ---
// This store manages a simple UI toggle, like a "Dark Mode" switch.
interface UiStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useUiStore = create<UiStore>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

// --- 3. Socket.IO Client Setup ---
// Connect to the Socket.IO server. In a real app, this would be your backend URL.
// For this example, we'll simulate events.
// const socket = io('http://localhost:4000'); // Replace with your actual backend URL
const socket = io({ autoConnect: false }); // Auto-connect is false for simulation purposes

// --- 4. Simulated Backend API (Axios-like behavior with fetch/setTimeout) ---
// In a real application, you'd use Axios or native fetch to make HTTP requests
// to your backend. Here, we simulate the responses.
const simulatedApi = {
  getSensors: (): Promise<Sensor[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sensors: Sensor[] = [
          { id: 'robot-001-temp', name: 'Robot 001 - Temperature', type: 'temperature', value: 25.5, unit: '°C', status: 'normal' },
          { id: 'robot-001-batt', name: 'Robot 001 - Battery', type: 'battery', value: 85, unit: '%', status: 'normal' },
          { id: 'robot-002-temp', name: 'Robot 002 - Temperature', type: 'temperature', value: 28.1, unit: '°C', status: 'alert' },
          { id: 'robot-002-batt', name: 'Robot 002 - Battery', type: 'battery', value: 20, unit: '%', status: 'warning' },
          { id: 'robot-003-motion', name: 'Robot 003 - Motion', type: 'motion', value: 1, unit: 'active', status: 'normal' },
        ];
        resolve(sensors);
      }, 500); // Simulate network delay
    });
  },
  getSensorHistory: (sensorId: string): Promise<SensorHistoryData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate historical data for a sensor
        const data: SensorHistoryData[] = Array.from({ length: 10 }, (_, i) => ({
          time: `10:${30 + i}`,
          value: parseFloat((Math.random() * 5 + (sensorId.includes('temp') ? 20 : 70)).toFixed(1)),
        }));
        resolve(data);
      }, 700); // Simulate network delay
    });
  },
};

// --- TypeScript Interfaces for Data Structures ---
interface Sensor {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'alert';
}

interface SensorHistoryData {
  time: string;
  value: number;
}

// --- Context for Socket.IO (Optional, but good for sharing socket instance) ---
const SocketContext = createContext<typeof socket | null>(null);

// --- Components ---

// SensorStatusCard: Displays individual sensor status and updates in real-time
const SensorStatusCard: React.FC<{ sensor: Sensor }> = ({ sensor: initialSensor }) => {
  const [sensor, setSensor] = useState<Sensor>(initialSensor);
  const socket = useContext(SocketContext);
  const cardRef = useRef<HTMLDivElement>(null); // Ref for focus management

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates for this specific sensor
    const handleSensorUpdate = (updatedSensor: Sensor) => {
      if (updatedSensor.id === sensor.id) {
        setSensor(updatedSensor);
        // Announce status changes for accessibility
        if (cardRef.current && initialSensor.status !== updatedSensor.status) {
          const statusMessage = `Sensor ${updatedSensor.name} status changed to ${updatedSensor.status}. Current value: ${updatedSensor.value} ${updatedSensor.unit}.`;
          // Visually hidden element for screen reader announcement
          const liveRegion = document.getElementById('status-announcer');
          if (liveRegion) {
            liveRegion.textContent = statusMessage;
          }
        }
      }
    };

    socket.on('sensorUpdate', handleSensorUpdate);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      socket.off('sensorUpdate', handleSensorUpdate);
    };
  }, [socket, sensor.id, initialSensor.status]); // Depend on socket, sensor.id, and initial status for re-subscription

  const statusColor = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    alert: 'bg-red-500',
  }[sensor.status];

  const statusText = sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1);

  return (
    <div
      ref={cardRef}
      className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out
                  ${sensor.status === 'alert' ? 'border-4 border-red-600 animate-pulse' : 'border border-gray-200'}
                  ${useUiStore.getState().isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      role="status" // ARIA role for live regions
      aria-live="polite" // Announce changes politely
      aria-labelledby={`sensor-name-${sensor.id}`}
      tabIndex={0} // Make card focusable
    >
      <div className="flex items-center justify-between mb-4">
        <h3 id={`sensor-name-${sensor.id}`} className="text-xl font-semibold">
          {sensor.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${statusColor}`}>
          {statusText}
        </span>
      </div>
      <p className="text-3xl font-bold mb-2">
        {sensor.value} <span className="text-lg font-normal">{sensor.unit}</span>
      </p>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// SensorChart: Displays historical data for a sensor using Recharts
const SensorChart: React.FC<{ sensorId: string; sensorName: string }> = ({ sensorId, sensorName }) => {
  // Use React Query to fetch historical data
  const { data, isLoading, isError, error } = useQuery<SensorHistoryData[], Error>({
    queryKey: ['sensorHistory', sensorId], // Unique key for this query
    queryFn: () => simulatedApi.getSensorHistory(sensorId), // Function to fetch data
  });

  if (isLoading) return <div className="text-center py-8">Loading chart data...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Error loading chart: {error?.message}</div>;

  return (
    <div
      className={`p-6 rounded-xl shadow-lg ${useUiStore.getState().isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      role="img" // ARIA role for images/charts
      aria-label={`Line chart showing historical data for ${sensorName}`}
      tabIndex={0} // Make chart focusable
    >
      <h3 className="text-xl font-semibold mb-4">{sensorName} - Historical Data</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={useUiStore.getState().isDarkMode ? '#4A5568' : '#E2E8F0'} />
          <XAxis dataKey="time" stroke={useUiStore.getState().isDarkMode ? '#CBD5E0' : '#4A5568'} />
          <YAxis stroke={useUiStore.getState().isDarkMode ? '#CBD5E0' : '#4A5568'} />
          <Tooltip contentStyle={{ backgroundColor: useUiStore.getState().isDarkMode ? '#2D3748' : '#FFF', border: 'none', borderRadius: '8px' }} itemStyle={{ color: useUiStore.getState().isDarkMode ? '#FFF' : '#2D3748' }} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// FeatureToggle: Demonstrates Zustand usage for a simple UI state
const FeatureToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const toggleButtonRef = useRef<HTMLButtonElement>(null); // Ref for focus management

  useEffect(() => {
    // Example of managing focus after state change (e.g., if this button was part of a larger interaction)
    if (toggleButtonRef.current) {
      // toggleButtonRef.current.focus(); // Uncomment if you need to force focus here
    }
  }, [isDarkMode]); // Re-run effect when isDarkMode changes

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-inner flex items-center justify-between">
      <span className="text-gray-700">Dark Mode:</span>
      <button
        ref={toggleButtonRef}
        onClick={toggleDarkMode}
        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200
                   ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-800'}
                   hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        aria-pressed={isDarkMode} // ARIA attribute for toggle buttons
        aria-label={`Toggle dark mode, currently ${isDarkMode ? 'on' : 'off'}`}
      >
        {isDarkMode ? 'On' : 'Off'}
      </button>
    </div>
  );
};

// DashboardLayout: Main layout component
const DashboardLayout: React.FC = () => {
  const { isDarkMode } = useUiStore();
  const mainContentRef = useRef<HTMLDivElement>(null); // Ref for main content area

  // Use React Query to fetch the initial list of sensors
  const { data: sensors, isLoading, isError, error } = useQuery<Sensor[], Error>({
    queryKey: ['sensors'], // Unique key for this query
    queryFn: simulatedApi.getSensors, // Function to fetch data
  });

  // Effect to manage focus after initial data load or significant layout change
  useEffect(() => {
    if (!isLoading && mainContentRef.current) {
      mainContentRef.current.focus(); // Set focus to the main content area
    }
  }, [isLoading]);

  // Simulate real-time sensor updates for Socket.IO
  useEffect(() => {
    socket.connect(); // Connect the socket
    const interval = setInterval(() => {
      if (sensors && sensors.length > 0) {
        const randomIndex = Math.floor(Math.random() * sensors.length);
        const sensorToUpdate = { ...sensors[randomIndex] };

        // Simulate value change
        sensorToUpdate.value = parseFloat((sensorToUpdate.value + (Math.random() * 2 - 1)).toFixed(1));

        // Simulate status change for some sensors
        if (sensorToUpdate.type === 'temperature') {
          if (sensorToUpdate.value > 30) sensorToUpdate.status = 'alert';
          else if (sensorToUpdate.value > 27) sensorToUpdate.status = 'warning';
          else sensorToUpdate.status = 'normal';
        } else if (sensorToUpdate.type === 'battery') {
          if (sensorToUpdate.value < 15) sensorToUpdate.status = 'alert';
          else if (sensorToUpdate.value < 30) sensorToUpdate.status = 'warning';
          else sensorToUpdate.status = 'normal';
        }

        // Emit the update (this would go to your backend Socket.IO server)
        // For this frontend-only simulation, we directly trigger the client listener
        socket.emit('sensorUpdate', sensorToUpdate);
      }
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(interval);
      socket.disconnect(); // Disconnect socket on unmount
    };
  }, [sensors]); // Re-run effect if sensors data changes

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} font-sans`}>
      {/* Visually hidden live region for screen reader announcements */}
      <div id="status-announcer" aria-live="polite" className="sr-only"></div>

      {/* Sidebar */}
      <aside className={`w-64 p-6 shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col justify-between`}>
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-600 mb-8">
            Warehouse Monitor
          </h2>
          <nav aria-label="Main navigation">
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200"
                   aria-current="page">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <FeatureToggle />
      </aside>

      {/* Main Content */}
      <main
        ref={mainContentRef}
        className="flex-1 p-8 overflow-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        tabIndex={-1} // Make main content programmatically focusable
        role="main" // ARIA role for main content
        aria-label="Warehouse Sensor Data Dashboard"
      >
        <h1 className="text-4xl font-extrabold mb-8">Sensor Overview</h1>

        {isLoading ? (
          <div className="text-center py-16 text-xl">Loading sensor data...</div>
        ) : isError ? (
          <div className="text-center py-16 text-red-500 text-xl">
            Error fetching sensors: {error?.message}
            <p className="text-sm mt-2">Please check your backend connection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sensors?.map((sensor) => (
              <SensorStatusCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        )}

        <h2 className="text-3xl font-extrabold mb-8">Sensor Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Display charts for a couple of sensors */}
          {sensors && sensors.length > 0 && (
            <>
              <SensorChart sensorId={sensors[0].id} sensorName={sensors[0].name} />
              {sensors.length > 1 && (
                <SensorChart sensorId={sensors[1].id} sensorName={sensors[1].name} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// App: The root component that sets up QueryClientProvider and SocketContext
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socket}>
        <DashboardLayout />
      </SocketContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
