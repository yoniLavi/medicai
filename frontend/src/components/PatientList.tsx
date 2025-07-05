
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, User } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  time: string;
  type: string;
  lastSeen: string;
  priority: string;
  concerns: string[];
  initials: string;
  location: string;
  background: string;
  communicationStyle: string;
  conditions: string[];
  culturalNotes: string;
}

interface PatientListProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
  onConsultationPrep: (patient: Patient) => void;
  onStartSession: (patient: Patient) => void;
  searchQuery: string;
}

const PatientList = ({ patients, onPatientSelect, onConsultationPrep, onStartSession, searchQuery }: PatientListProps) => {
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.concerns.some(concern => concern.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 overflow-y-auto h-full">
      {filteredPatients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4" />
                    <span>Age {patient.age}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{patient.time}</span>
                    <span>•</span>
                    <span>{patient.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{patient.background}</p>
                  <p className="text-xs text-gray-500 italic">"{patient.culturalNotes}"</p>
                  <p className="text-sm text-gray-500 mt-1">Last seen: {patient.lastSeen}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge 
                  variant={patient.priority === "high" ? "destructive" : patient.priority === "medium" ? "default" : "secondary"}
                >
                  {patient.priority} priority
                </Badge>
                <div className="space-y-1 text-right">
                  {patient.concerns.slice(0, 2).map((concern, idx) => (
                    <p key={idx} className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                      {concern}
                    </p>
                  ))}
                  {patient.concerns.length > 2 && (
                    <p className="text-xs text-gray-500">+{patient.concerns.length - 2} more</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => onStartSession(patient)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start Session
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onConsultationPrep(patient)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Prep Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPatientSelect(patient)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientList;
