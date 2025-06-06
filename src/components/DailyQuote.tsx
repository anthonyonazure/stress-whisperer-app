
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const DailyQuote = () => {
  const [quote, setQuote] = useState('');

  // Default quotes - you can replace these with your own list
  const quotes = [
    "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
    "You have been assigned this mountain to show others it can be moved.",
    "Stress is caused by being 'here' but wanting to be 'there.'",
    "Take time to be still, in a world that never stops moving.",
    "You are braver than you believe, stronger than you seem, and smarter than you think.",
    "Progress, not perfection.",
    "Every small step in the right direction can turn out to be the biggest step of your life.",
    "Healing isn't about erasing scars, it's about learning to live beautifully with them.",
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "It's okay to not be okay, but it's not okay to stay that way.",
    "Breathe in peace, breathe out stress.",
    "You don't have to control your thoughts. You just have to stop letting them control you.",
    "Self-compassion is simply giving the same kindness to ourselves that we would give to others.",
    "The mind is everything. What you think you become.",
    "Be patient with yourself. Nothing in nature blooms all year."
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const storedQuote = localStorage.getItem(`daily-quote-${today}`);
    
    if (storedQuote) {
      setQuote(storedQuote);
    } else {
      // Select a quote based on the day to ensure it's consistent for the day
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const selectedQuote = quotes[dayOfYear % quotes.length];
      setQuote(selectedQuote);
      localStorage.setItem(`daily-quote-${today}`, selectedQuote);
    }
  }, []);

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Quote className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-purple-800 font-medium italic leading-relaxed">
              "{quote}"
            </p>
            <p className="text-purple-600 text-sm mt-2">Daily Inspiration</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
