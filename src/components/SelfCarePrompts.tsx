
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart } from 'lucide-react';

interface SelfCarePromptsProps {
  stressLevel: number;
}

const SelfCarePrompts = ({ stressLevel }: SelfCarePromptsProps) => {
  const techniques = [
    {
      name: "5-4-3-2-1 Grounding Technique",
      description: "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      when: stressLevel >= 6
    },
    {
      name: "Deep Breathing",
      description: "Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.",
      when: stressLevel >= 5
    },
    {
      name: "ROSA Worksheet",
      description: "Reflect on: R - Recognize the feeling, O - Observe without judgment, S - Step back and breathe, A - Act with awareness.",
      when: stressLevel >= 7
    },
    {
      name: "Progressive Muscle Relaxation",
      description: "Tense and release each muscle group starting from your toes up to your head.",
      when: stressLevel >= 8
    }
  ];

  const applicableTechniques = techniques.filter(t => t.when);

  if (applicableTechniques.length === 0) return null;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Heart className="h-5 w-5" />
          Self-Care Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applicableTechniques.map((technique, index) => (
          <Alert key={index} className="border-green-300 bg-white">
            <AlertDescription>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">{technique.name}</h4>
                <p className="text-green-700 text-sm">{technique.description}</p>
              </div>
            </AlertDescription>
          </Alert>
        ))}
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Remember:</strong> It's okay to not be okay. These feelings are temporary, and you're taking positive steps by tracking your wellness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfCarePrompts;
