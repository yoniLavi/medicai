
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, FileText, Heart, AlertTriangle, User, Phone, Mail, MapPin } from "lucide-react";

interface PatientProfileProps {
  patient: any;
  onBack: () => void;
}

const PatientProfile = ({ patient, onBack }: PatientProfileProps) => {
  // Mock comprehensive patient data
  const patientDetails = {
    ...patient,
    dateOfBirth: "15th March 1962",
    address: "12 O'Connell Street, Cork",
    phone: "+353 21 123 4567",
    email: "mary.osullivan@email.ie",
    emergencyContact: "John O'Sullivan (Husband) - +353 21 987 6543",
    conditions: ["Type 2 Diabetes", "Hypertension", "High Cholesterol"],
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      { name: "Metformin", dosage: "500mg twice daily", prescribed: "Dr. O'Brien" },
      { name: "Lisinopril", dosage: "10mg daily", prescribed: "Dr. Murphy" },
      { name: "Atorvastatin", dosage: "20mg evening", prescribed: "Dr. O'Brien" }
    ],
    consultationHistory: [
      {
        date: "2nd January 2024",
        doctor: "Dr. Murphy",
        reason: "Blood pressure review",
        outcome: "Medication adjusted, follow-up in 6 weeks",
        notes: "Patient mentioned feeling dizzy in mornings. BP readings improved."
      },
      {
        date: "15th November 2023",
        doctor: "Dr. O'Brien",
        reason: "Diabetes management",
        outcome: "HbA1c improved to 7.2%, continue current regimen",
        notes: "Patient very compliant with diet changes. Pleased with weight loss of 3kg."
      },
      {
        date: "20th September 2023",
        doctor: "Dr. Fitzgerald",
        reason: "Annual check-up",
        outcome: "Overall health stable, routine bloods ordered",
        notes: "Patient expressed concerns about memory - reassured, no clinical signs of concern."
      }
    ],
    preferences: {
      communication: "Prefers phone calls over emails",
      appointments: "Morning appointments work best",
      treatment: "Conservative approach, prefers lifestyle changes over medication increases",
      concerns: "Worried about becoming a burden on family"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-gray-600">Patient Profile & History</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{patientDetails.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address
                  </p>
                  <p className="text-gray-900 text-sm">{patientDetails.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p className="text-gray-900 text-sm">{patientDetails.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </p>
                  <p className="text-gray-900 text-sm">{patientDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                  <p className="text-gray-900 text-sm">{patientDetails.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Allergies & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patientDetails.allergies.map((allergy, idx) => (
                    <Badge key={idx} variant="destructive" className="mr-2">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-500" />
                  Patient Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Communication</p>
                  <p className="text-sm text-gray-600">{patientDetails.preferences.communication}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Appointments</p>
                  <p className="text-sm text-gray-600">{patientDetails.preferences.appointments}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Treatment Approach</p>
                  <p className="text-sm text-gray-600">{patientDetails.preferences.treatment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Key Concerns</p>
                  <p className="text-sm text-gray-600">{patientDetails.preferences.concerns}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="conditions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="conditions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Conditions</CardTitle>
                    <CardDescription>Current medical conditions being managed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientDetails.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{condition}</p>
                            <p className="text-sm text-gray-600">Diagnosed: 2019</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Medications</CardTitle>
                    <CardDescription>Active prescriptions and dosages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientDetails.medications.map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                            <p className="text-xs text-gray-500">Prescribed by {med.prescribed}</p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  {patientDetails.consultationHistory.map((consultation, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{consultation.reason}</CardTitle>
                          <Badge variant="outline">{consultation.date}</Badge>
                        </div>
                        <CardDescription>Seen by {consultation.doctor}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Outcome:</p>
                            <p className="text-sm text-gray-600">{consultation.outcome}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Doctor's Notes:</p>
                            <p className="text-sm text-gray-600 italic">"{consultation.notes}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Care Timeline</CardTitle>
                    <CardDescription>Chronological view of patient care</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {patientDetails.consultationHistory.map((event, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            {idx < patientDetails.consultationHistory.length - 1 && (
                              <div className="w-px h-16 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{event.date}</p>
                              <Badge variant="outline" className="text-xs">{event.doctor}</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{event.reason}</p>
                            <p className="text-xs text-gray-600">{event.outcome}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
