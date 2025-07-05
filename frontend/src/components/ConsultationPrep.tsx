
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Clock, AlertTriangle, Heart, Lightbulb, MessageSquare, CheckCircle } from "lucide-react";

interface ConsultationPrepProps {
  patient: any;
  onBack: () => void;
}

const ConsultationPrep = ({ patient, onBack }: ConsultationPrepProps) => {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);

  // Mock AI-generated consultation prep data
  const prepData = {
    aiSummary: "Mary is a 61-year-old woman with well-controlled Type 2 diabetes and hypertension. She was last seen 3 months ago and has been compliant with medications. She tends to worry about being a burden on her family and prefers conservative treatment approaches. Recent concerns include morning dizziness which may be related to blood pressure medication timing.",
    
    keyPoints: [
      "Patient has been compliant with medication regimen",
      "Reported morning dizziness in last visit - may need BP medication timing adjustment",
      "Lost 3kg since last visit - positive lifestyle changes",
      "HbA1c improved to 7.2% - diabetes well controlled",
      "Prefers morning appointments and conservative treatment approaches"
    ],
    
    suggestedQuestions: [
      "How has the morning dizziness been since we adjusted your medication timing?",
      "Can you tell me about your current diet and exercise routine?",
      "Any concerns about your diabetes management at home?",
      "How are you feeling about the weight loss you've achieved?"
    ],
    
    alerts: [
      "Blood pressure readings may need review",
      "Patient expressed memory concerns in previous visit - follow up sensitively",
      "Emergency contact: Husband John - very supportive"
    ],
    
    lastVisitHighlights: {
      doctor: "Dr. Murphy",
      date: "2nd January 2024",
      mainConcern: "Blood pressure review and morning dizziness",
      outcome: "Medication timing adjusted, patient feeling better",
      followUpNeeded: "Check if dizziness has resolved"
    }
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    // Mock AI response
    const mockResponse = `Based on Mary's history, ${question.toLowerCase().includes('medication') ? 
      'her current medications are working well. The Lisinopril adjustment made in January seems to have helped with the morning dizziness. Consider asking about compliance and any remaining side effects.' :
      question.toLowerCase().includes('family') ?
      'Mary has expressed concerns about being a burden on her family. Her husband John is very supportive. She may benefit from reassurance about maintaining her independence.' :
      'this is an important area to explore with Mary. Given her preference for conservative approaches and her good compliance history, she will likely appreciate a collaborative discussion.'
    }`;
    
    setResponses([...responses, { question, response: mockResponse }]);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
                <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-lg">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consultation Prep: {patient.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Appointment at {patient.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Lightbulb className="h-5 w-5" />
                  AI Patient Summary
                </CardTitle>
                <CardDescription>
                  Quick overview generated from patient's history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{prepData.aiSummary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Points to Remember</CardTitle>
                <CardDescription>Important context from recent visits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {prepData.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Discussion Points</CardTitle>
                <CardDescription>Questions tailored to this patient's history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prepData.suggestedQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                      <p className="text-sm text-gray-700">"{q}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ask the AI Assistant
                </CardTitle>
                <CardDescription>
                  Get specific insights about this patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., What should I know about her medication compliance?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    className="flex-1"
                  />
                  <Button onClick={handleAskQuestion} className="bg-blue-600 hover:bg-blue-700">
                    Ask
                  </Button>
                </div>
                
                {responses.length > 0 && (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {responses.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm font-medium text-gray-800">Q: {item.question}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">{item.response}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  Important Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prepData.alerts.map((alert, idx) => (
                  <div key={idx} className="p-2 bg-amber-100 rounded border-l-4 border-amber-400">
                    <p className="text-sm text-amber-800">{alert}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Last Visit Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Doctor</p>
                  <p className="text-gray-900">{prepData.lastVisitHighlights.date}</p>
                  <p className="text-gray-600 text-sm">{prepData.lastVisitHighlights.doctor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Main Concern</p>
                  <p className="text-gray-900 text-sm">{prepData.lastVisitHighlights.mainConcern}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Outcome</p>
                  <p className="text-gray-900 text-sm">{prepData.lastVisitHighlights.outcome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Follow-up Needed</p>
                  <p className="text-blue-600 text-sm font-medium">{prepData.lastVisitHighlights.followUpNeeded}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View Full Medical History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Check Recent Lab Results
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Review Medication List
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPrep;
