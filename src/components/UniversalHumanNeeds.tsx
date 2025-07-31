import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface UniversalHumanNeedsProps {
  selectedNeeds: string[];
  onNeedToggle: (need: string) => void;
}

const humanNeeds = {
  "Subsistence and Security": {
    "Physical Subsistence": [
      "Air", "Food", "Health", "Movement", "Physical safety", "Rest/sleep", 
      "Shelter", "Touch", "Water"
    ],
    "Security": [
      "Consistency", "Order/Structure", "Peace (external)", "Peace of mind", 
      "Protection", "Safety (emotional)", "Stability", "Trusting"
    ]
  },
  "Freedom": {
    "Autonomy": [
      "Choice", "Ease", "Independence", "Power", "Self-responsibility", 
      "Space", "Spontaneity"
    ],
    "Leisure/Relaxation": [
      "Humor", "Joy", "Play", "Pleasure", "Rejuvenation"
    ]
  },
  "Connection": {
    "Affection": [
      "Appreciation", "Attention", "Closeness", "Companionship", "Harmony", 
      "Intimacy", "Love", "Nurturing", "Sexual expression", "Tenderness", "Warmth"
    ],
    "To Matter": [
      "Acceptance", "Care", "Compassion", "Consideration", "Empathy", "Kindness", 
      "Mutual respect", "Respect", "To be heard", "To be seen", "To be known", 
      "To be understood", "To be trusted", "Understanding others"
    ],
    "Community": [
      "Belonging", "Communication", "Cooperation", "Equality", "Inclusion", 
      "Mutuality", "Participation", "Partnership", "Self-expression", "Sharing"
    ]
  },
  "Meaning": {
    "Sense of Self": [
      "Authenticity", "Competence", "Creativity", "Dignity", "Growth", "Healing", 
      "Honesty", "Integrity", "Self-acceptance", "Self-care", "Self-connection", 
      "Self-knowledge", "Self-realization", "Mattering to myself"
    ],
    "Understanding": [
      "Awareness", "Clarity", "Discovery", "Learning", "Making sense of life", 
      "Stimulation"
    ],
    "Meaning": [
      "Aliveness", "Challenge", "Consciousness", "Contribution", "Creativity", 
      "Effectiveness", "Exploration", "Integration", "Purpose"
    ],
    "Transcendence": [
      "Beauty", "Celebration of life", "Communion", "Faith", "Flow", "Hope", 
      "Inspiration", "Mourning", "Peace (internal)", "Presence"
    ]
  }
};

export function UniversalHumanNeeds({ selectedNeeds, onNeedToggle }: UniversalHumanNeedsProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleSubcategory = (subcategory: string) => {
    setOpenSubcategories(prev => ({ ...prev, [subcategory]: !prev[subcategory] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Universal Human Needs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select any needs that are currently not being met in your life.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(humanNeeds).map(([categoryName, subcategories]) => (
          <Collapsible 
            key={categoryName}
            open={openCategories[categoryName]}
            onOpenChange={() => toggleCategory(categoryName)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <span className="font-medium">{categoryName}</span>
              {openCategories[categoryName] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              {Object.entries(subcategories).map(([subcategoryName, needs]) => (
                <Collapsible
                  key={subcategoryName}
                  open={openSubcategories[subcategoryName]}
                  onOpenChange={() => toggleSubcategory(subcategoryName)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-background border rounded-md hover:bg-muted/30 transition-colors">
                    <span className="font-medium text-sm">{subcategoryName}</span>
                    {openSubcategories[subcategoryName] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                    {needs.map((need) => (
                      <div key={need} className="flex items-center space-x-2">
                        <Checkbox
                          id={need}
                          checked={selectedNeeds.includes(need)}
                          onCheckedChange={() => onNeedToggle(need)}
                        />
                        <label
                          htmlFor={need}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {need}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}