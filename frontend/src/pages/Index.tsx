
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, Clock, Users, FileText, Plus, AlertCircle } from "lucide-react";
import PatientProfile from "@/components/PatientProfile";
import ConsultationPrep from "@/components/ConsultationPrep";
import ActiveSession from "@/components/ActiveSession";
import PatientList from "@/components/PatientList";
import CalendarView from "@/components/CalendarView";
import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Updated Irish personas data
  const patientsData = [
    {
      id: 1,
      name: "Brigid O'Sullivan",
      age: 72,
      time: "10:30 AM",
      type: "Follow-up",
      lastSeen: "3 months ago",
      priority: "high",
      concerns: ["Diabetes management", "Sleep disturbances since move", "Memory concerns"],
      initials: "BO",
      location: "Blackrock, Dublin (Recently from Kerry)",
      background: "Retired teacher, widowed, moved from Kerry 18 months ago",
      communicationStyle: "Traditional, polite, may understate symptoms",
      conditions: ["Type 2 Diabetes", "Osteoarthritis", "Mild hypertension"],
      culturalNotes: "Uses Kerry expressions, prefers phone calls, very deferential to doctors"
    },
    {
      id: 2,
      name: "Cian Murphy",
      age: 20,
      time: "11:15 AM",
      type: "Student health check",
      lastSeen: "6 months ago",
      priority: "medium",
      concerns: ["Sleep issues", "Academic stress", "Poor diet"],
      initials: "CM",
      location: "UCD Student, originally from Sligo",
      background: "Computer Science student, first in family to attend university",
      communicationStyle: "Tech-savvy, informal, asks lots of questions",
      conditions: ["Seasonal depression (suspected)", "Eye strain", "Social anxiety"],
      culturalNotes: "Uses contemporary slang, prefers digital communication, may mask mental health concerns"
    },
    {
      id: 3,
      name: "Orla Flanagan",
      age: 33,
      time: "2:00 PM",
      type: "Routine check-up",
      lastSeen: "4 months ago",
      priority: "low",
      concerns: ["Work stress", "Hormonal issues", "Preventive screening"],
      initials: "OF",
      location: "Ranelagh, Dublin (Originally from Cork)",
      background: "Senior UX Designer, health-conscious professional",
      communicationStyle: "Direct, well-informed, appreciates efficiency",
      conditions: ["Chronic stress", "Irregular periods", "Vitamin D deficiency"],
      culturalNotes: "Professional communicator, uses health apps, proactive about wellness"
    }
  ];

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

  if (activeView === "profile" && selectedPatient) {
    return <PatientProfile patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "consultation" && selectedPatient) {
    return <ConsultationPrep patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "session" && selectedPatient) {
    return <ActiveSession patient={selectedPatient} onBack={() => setActiveView("dashboard")} />;
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
