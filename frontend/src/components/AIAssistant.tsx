
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Heart, Lightbulb } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantProps {
  selectedPatient: any;
  patients: any[];
}

const AIAssistant = ({ selectedPatient, patients }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello there! I'm Áine, your healthcare memory assistant. I'm here to help ye understand yer patients better and prepare for consultations. How can I help ye today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response based on context
    const response = generateResponse(inputMessage, selectedPatient);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage("");
  };

  const generateResponse = (query: string, patient: any) => {
    const lowerQuery = query.toLowerCase();
    
    if (!patient) {
      if (lowerQuery.includes('brigid') || lowerQuery.includes("o'sullivan")) {
        return "Ah, Brigid O'Sullivan! She's a lovely woman from Kerry who moved to Dublin after her husband passed. She's 72, has diabetes that's well-managed, but she's struggling with the move and might be having some memory concerns. She's very traditional in her approach - calls me 'Doctor' even though I'm just an assistant! She tends to downplay her symptoms, so ye might need to gently probe a bit more. Would ye like to know about her medication routine or her family situation?";
      } else if (lowerQuery.includes('cian') || lowerQuery.includes('murphy')) {
        return "Cian Murphy is a grand lad - 20 years old, studying Computer Science at UCD. He's from Sligo originally and this is his first time living away from home. He's tech-savvy and will ask ye loads of questions, but he might not be fully honest about mental health concerns - there's still that stigma for young fellas, ye know? He's living on Pot Noodles and staying up too late gaming. His sleep pattern is all over the place!";
      } else if (lowerQuery.includes('orla') || lowerQuery.includes('flanagan')) {
        return "Orla Flanagan is a successful UX designer, 33, originally from Cork but living in Ranelagh now. She's very health-conscious and well-informed - she'll come prepared with questions and might have already researched her symptoms online. She's dealing with work stress and some hormonal issues. She appreciates efficiency and direct communication. Fair play to her for being so proactive about her health!";
      } else {
        return "I'm here to help ye with any of yer patients! Would ye like to know about Brigid O'Sullivan (the 72-year-old teacher from Kerry), Cian Murphy (the UCD student from Sligo), or Orla Flanagan (the UX designer from Cork)? Or is there something specific about patient care ye'd like to discuss?";
      }
    }

    // Patient-specific responses
    if (patient.name === "Brigid O'Sullivan") {
      if (lowerQuery.includes('medication') || lowerQuery.includes('diabetes')) {
        return "Brigid is very good with her medications - takes them religiously at the same times every day. She uses a weekly pill organizer that her daughter Siobhán set up for her. Her diabetes has been well-controlled since 2019 with Metformin. However, since the move to Dublin and losing Paddy, she's lost some weight due to grief. Ye might want to check if her eating routine has changed, as that could affect her blood sugar management.";
      } else if (lowerQuery.includes('family') || lowerQuery.includes('support')) {
        return "Brigid has four children - Siobhán (48, a nurse in Tallaght Hospital) is the one who lives nearby and helps her. The others are scattered: Declan emigrated to Perth, Mairead teaches in Cork, and Seán took over the family farm in Kerry. Siobhán is very supportive but might be getting a bit stressed trying to balance work and caring for her mam. Brigid worries about being a burden on her.";
      } else if (lowerQuery.includes('kerry') || lowerQuery.includes('move') || lowerQuery.includes('dublin')) {
        return "The move from Kerry to Dublin has been 'a fierce big change' for Brigid. She misses the community in Kenmare where she taught for 45 years and knew everyone. Dublin feels too noisy and fast-paced for her. This geographical transition is definitely affecting her mental health - she's having sleep disturbances and some social isolation. She might benefit from connecting with local parish activities or Kerry associations in Dublin.";
      }
    }

    // Default helpful response
    return "That's a great question! Based on what I know about this patient, I'd suggest looking at their cultural background and communication style. Remember, each person brings their own story and way of expressing themselves. Would ye like me to elaborate on any particular aspect of their care?";
  };

  const quickQuestions = [
    "What should I know about their cultural background?",
    "Any medication concerns?",
    "Family support situation?",
    "Communication preferences?"
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-100 text-green-700">
              <Heart className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">Áine</h3>
            <p className="text-sm text-gray-600 font-normal">Healthcare Memory Assistant</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {selectedPatient && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <Lightbulb className="h-4 w-4" />
              Patient Context: {selectedPatient.name}
            </div>
            <p className="text-xs text-blue-600 mt-1">{selectedPatient.background}</p>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('en-IE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-xs justify-start h-8"
              >
                {question}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask Áine about your patients..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
