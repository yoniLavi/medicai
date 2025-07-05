
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  time: string;
  type: string;
  priority: string;
  initials: string;
  location: string;
  concerns: string[];
}

interface CalendarViewProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
}

const CalendarView = ({ patients, onPatientSelect }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock appointments for different dates
  const appointments = {
    [new Date().toDateString()]: patients,
    [new Date(Date.now() + 86400000).toDateString()]: [
      { ...patients[0], time: "9:00 AM", type: "Follow-up" },
      { ...patients[2], time: "2:30 PM", type: "Check-up" }
    ],
    [new Date(Date.now() + 2 * 86400000).toDateString()]: [
      { ...patients[1], time: "11:00 AM", type: "Mental health consultation" }
    ]
  };

  const selectedDateString = selectedDate?.toDateString() || new Date().toDateString();
  const dayAppointments = appointments[selectedDateString] || [];

  return (
    <div className="flex gap-6 h-full">
      <div className="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate?.toLocaleDateString('en-IE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            {dayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for this date.</p>
            ) : (
              dayAppointments.map((appointment, index) => (
                <Card 
                  key={`${appointment.id}-${index}`} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPatientSelect(appointment)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {appointment.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{appointment.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={appointment.priority === "high" ? "destructive" : appointment.priority === "medium" ? "default" : "secondary"}
                          className="mb-2"
                        >
                          {appointment.priority}
                        </Badge>
                        <div className="space-y-1">
                          {appointment.concerns.slice(0, 2).map((concern, idx) => (
                            <p key={idx} className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                              {concern}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
