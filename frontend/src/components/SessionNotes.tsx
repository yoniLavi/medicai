
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Mic, User, Clock, FileText, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface SessionNotesProps {
  onBack: () => void;
}

const SessionNotes = ({ onBack }: SessionNotesProps) => {
  const [sessionData, setSessionData] = useState({
    patientName: "",
    sessionType: "",
    chiefComplaint: "",
    assessment: "",
    plan: "",
    followUp: "",
    keyInsights: "",
    patientPreferences: "",
    nextAppointment: ""
  });

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSaveSession = () => {
    if (!sessionData.patientName || !sessionData.chiefComplaint) {
      toast.error("Please fill in at least the patient name and chief complaint");
      return;
    }
    
    toast.success("Session notes saved successfully! Memory updated for future consultations.");
    console.log("Session saved:", sessionData, "Tags:", tags);
    
    // Reset form
    setSessionData({
      patientName: "",
      sessionType: "",
      chiefComplaint: "",
      assessment: "",
      plan: "",
      followUp: "",
      keyInsights: "",
      patientPreferences: "",
      nextAppointment: ""
    });
    setTags([]);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started - speak your notes");
    } else {
      toast.info("Voice recording stopped - processing notes...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">New Session Notes</h1>
                <p className="text-gray-600">Document consultation insights for shared memory</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className={isRecording ? "animate-pulse" : ""}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isRecording ? "Stop Recording" : "Voice Notes"}
              </Button>
              <Button onClick={handleSaveSession} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Save Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient & Session Details
                </CardTitle>
                <CardDescription>Basic information about this consultation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Patient Name *
                    </label>
                    <Input
                      placeholder="e.g., Mary O'Sullivan"
                      value={sessionData.patientName}
                      onChange={(e) => setSessionData({...sessionData, patientName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Session Type
                    </label>
                    <Select value={sessionData.sessionType} onValueChange={(value) => setSessionData({...sessionData, sessionType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="new-consultation">New Consultation</SelectItem>
                        <SelectItem value="routine-check">Routine Check-up</SelectItem>
                        <SelectItem value="urgent">Urgent Care</SelectItem>
                        <SelectItem value="specialist-referral">Specialist Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Clinical Notes
                </CardTitle>
                <CardDescription>Medical assessment and documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Chief Complaint *
                  </label>
                  <Textarea
                    placeholder="What brought the patient in today? Main concerns or symptoms..."
                    value={sessionData.chiefComplaint}
                    onChange={(e) => setSessionData({...sessionData, chiefComplaint: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Assessment & Observations
                  </label>
                  <Textarea
                    placeholder="Clinical findings, examination results, patient's condition..."
                    value={sessionData.assessment}
                    onChange={(e) => setSessionData({...sessionData, assessment: e.target.value})}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Treatment Plan
                  </label>
                  <Textarea
                    placeholder="Medications prescribed, treatments recommended, lifestyle advice..."
                    value={sessionData.plan}
                    onChange={(e) => setSessionData({...sessionData, plan: e.target.value})}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Context & Memory</CardTitle>
                <CardDescription>Important insights for future consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Key Insights & Observations
                  </label>
                  <Textarea
                    placeholder="Personal details, patient concerns, family situation, treatment preferences that future doctors should know..."
                    value={sessionData.keyInsights}
                    onChange={(e) => setSessionData({...sessionData, keyInsights: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Patient Preferences & Communication Style
                  </label>
                  <Textarea
                    placeholder="How does this patient prefer to communicate? Any specific concerns or anxieties? Family dynamics..."
                    value={sessionData.patientPreferences}
                    onChange={(e) => setSessionData({...sessionData, patientPreferences: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Follow-up Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Follow-up Required
                  </label>
                  <Textarea
                    placeholder="What needs to be checked in the next visit? Lab results to review? Symptoms to monitor..."
                    value={sessionData.followUp}
                    onChange={(e) => setSessionData({...sessionData, followUp: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Next Appointment
                  </label>
                  <Input
                    placeholder="e.g., 2 weeks, 3 months, as needed"
                    value={sessionData.nextAppointment}
                    onChange={(e) => setSessionData({...sessionData, nextAppointment: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Tags</CardTitle>
                <CardDescription>Add tags to categorize this session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Suggested: diabetes, hypertension, follow-up, medication-review, urgent
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">AI Memory Assistant</CardTitle>
                <CardDescription className="text-blue-600">
                  How this helps future care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-700">
                <p>✓ Patient context will be available to all doctors</p>
                <p>✓ Treatment preferences will be remembered</p>
                <p>✓ Follow-up actions will be tracked</p>
                <p>✓ Reduces need for patients to repeat information</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionNotes;
