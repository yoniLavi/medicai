
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, Clock, Users, FileText, Plus, AlertCircle, Loader2 } from "lucide-react";
import PatientProfile from "@/components/PatientProfile";
import ConsultationPrep from "@/components/ConsultationPrep";
import ActiveSession from "@/components/ActiveSession";
import PatientList from "@/components/PatientList";
import CalendarView from "@/components/CalendarView";
import AIAssistant from "@/components/AIAssistant";
import { getRecentPatients, testConnection } from "@/lib/api";

const Index = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real patient data
  const { data: patientsResponse, isLoading: isPatientsLoading, error: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: getRecentPatients,
    retry: 1,
    retryDelay: 1000,
  });

  // Debug logging
  console.log('🔍 Query state:', {
    isLoading: isPatientsLoading,
    error: patientsError,
    data: patientsResponse,
  });

  // Transform API data to match existing component interface
  const patientsData = patientsResponse?.recent_patients?.map(patient => ({
    id: patient.patient_id,
    name: patient.name,
    age: 0, // Will be filled from patient profile
    time: "TBD", // Will be set when scheduling
    type: "Consultation",
    lastSeen: patient.last_seen || "Unknown",
    priority: "medium", // Default priority
    concerns: [], // Will be filled from patient profile
    initials: patient.name.split(' ').map(n => n[0]).join(''),
    location: "Ireland",
    background: "Patient information available in profile",
    communicationStyle: "Professional",
    conditions: [],
    culturalNotes: "Individual preferences available in profile"
  })) || [];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveView("profile");
  };

  const handleConsultationPrep = (patient) => {
    setSelectedPatient(patient);
    setActiveView("consultation");
  };

  const handleStartSession = (patient) => {
    setSelectedPatient(patient);
    setActiveView("session");
  };

  const handleTestConnection = async () => {
    console.log('🧪 Testing API connection...');
    try {
      const result = await testConnection();
      console.log('✅ Connection test successful:', result);
      alert('API connection successful! Check console for details.');
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      alert('API connection failed! Check console for details.');
    }
  };

  if (activeView === "profile" && selectedPatient) {
    return <PatientProfile patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "consultation" && selectedPatient) {
    return <ConsultationPrep patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "session" && selectedPatient) {
    return <ActiveSession patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
  }

  // Loading state
  if (isPatientsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading patients...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (patientsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load patients</h2>
          <p className="text-gray-600 mb-4">Please make sure the backend server is running.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Memory System</h1>
              <p className="text-gray-600">Your shared healthcare memory assistant</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={handleTestConnection} variant="outline" className="mr-2">
                🧪 Test API
              </Button>
              <Button onClick={() => handleStartSession(null)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Main Content Area - 3/4 width */}
          <div className="flex-1 w-3/4">
            <Tabs defaultValue="list" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Patient List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="flex-1 mt-6">
                <PatientList 
                  patients={patientsData}
                  onPatientSelect={handlePatientSelect}
                  onConsultationPrep={handleConsultationPrep}
                  onStartSession={handleStartSession}
                  searchQuery={searchQuery}
                />
              </TabsContent>

              <TabsContent value="calendar" className="flex-1 mt-6">
                <CalendarView 
                  patients={patientsData}
                  onPatientSelect={handlePatientSelect}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Assistant - 1/4 width */}
          <div className="w-1/4 min-w-80">
            <AIAssistant 
              selectedPatient={selectedPatient}
              patients={patientsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
