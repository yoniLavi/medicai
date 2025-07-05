
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Save, 
  Clock,
  User,
  AlertCircle,
  FileText
} from "lucide-react";

interface ActiveSessionProps {
  patient: any;
  onBack: () => void;
}

const ActiveSession = ({ patient, onBack }: ActiveSessionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (sessionStartTime) {
      const interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionStartTime]);

  const startSession = () => {
    setSessionStartTime(new Date());
    setIsListening(true);
    
    // Mock ambient listening functionality
    setTimeout(() => {
      setTranscript("Patient mentions feeling tired in the mornings...");
      setAiSuggestions([
        "Consider asking about sleep quality",
        "Check morning medication timing",
        "Explore morning routine changes"
      ]);
    }, 3000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const endSession = () => {
    setIsListening(false);
    // Save session data
    console.log("Session ended - saving data...");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Patient Selected</h2>
            <p className="text-gray-600 mb-4">Please select a patient to start a session.</p>
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-lg">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Active Session: {patient.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Age {patient.age}</span>
                    {sessionStartTime && (
                      <>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>Duration: {formatDuration(sessionDuration)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!sessionStartTime ? (
                <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Pause Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Resume Listening
                      </>
                    )}
                  </Button>
                  <Button onClick={endSession} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Context - Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Background</p>
                  <p className="text-sm text-gray-600">{patient.background}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Communication Style</p>
                  <p className="text-sm text-gray-600">{patient.communicationStyle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Concerns</p>
                  <div className="space-y-1">
                    {patient.concerns.map((concern: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {concern}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Cultural Notes</p>
                  <p className="text-xs text-gray-500 italic">"{patient.culturalNotes}"</p>
                </div>
              </CardContent>
            </Card>

            {aiSuggestions.length > 0 && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="h-5 w-5" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    Based on conversation context
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Session Notes - Middle Column */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Session Notes
                </CardTitle>
                <CardDescription>
                  Record key observations and decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Record your observations, patient concerns, treatment decisions, and follow-up plans..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="min-h-80 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    {sessionNotes.length} characters
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ambient Listening - Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Ambient Listening
                  {isListening && (
                    <div className="ml-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="ml-1 text-sm text-red-600">LIVE</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Real-time conversation monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!sessionStartTime ? (
                  <p className="text-gray-500 text-center py-8">
                    Start session to begin ambient listening
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Live Transcript</p>
                      <p className="text-sm text-gray-600">
                        {transcript || (isListening ? "Listening..." : "Paused")}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Automatically captures key conversation points</p>
                      <p>• Identifies symptoms and concerns</p>
                      <p>• Suggests follow-up questions</p>
                      <p>• Privacy-compliant processing</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSession;
