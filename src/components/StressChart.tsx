
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';

const StressChart = () => {
  const [entries, setEntries] = useState([]);
  const [viewType, setViewType] = useState('line');

  useEffect(() => {
    const allEntries = JSON.parse(localStorage.getItem('all-stress-entries') || '[]');
    const sortedEntries = allEntries
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
    
    setEntries(sortedEntries);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAverageStress = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc: number, entry: any) => acc + entry.stressLevel, 0);
    return (sum / entries.length).toFixed(1);
  };

  const getHighStressDays = () => {
    return entries.filter((entry: any) => entry.stressLevel >= 7).length;
  };

  const chartData = entries.map((entry: any) => ({
    date: formatDate(entry.date),
    stress: entry.stressLevel,
    mood: entry.mood,
    fullDate: entry.date
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800">Stress Trends</CardTitle>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant={viewType === 'line' ? 'default' : 'outline'}
              onClick={() => setViewType('line')}
            >
              Line Chart
            </Button>
            <Button
              size="sm"
              variant={viewType === 'bar' ? 'default' : 'outline'}
              onClick={() => setViewType('bar')}
            >
              Bar Chart
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div>
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  {viewType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        domain={[1, 10]}
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f9fafb', 
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="stress" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        domain={[1, 10]}
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f9fafb', 
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="stress" 
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{getAverageStress()}</div>
                  <div className="text-sm text-blue-700">Average Stress</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{getHighStressDays()}</div>
                  <div className="text-sm text-red-700">High Stress Days</div>
                </div>
              </div>

              {getHighStressDays() > 3 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-800 text-sm">
                    <strong>Notice:</strong> You've had {getHighStressDays()} high-stress days recently. 
                    Consider talking to someone you trust or a professional about managing stress.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No data yet. Start logging your daily check-ins to see trends!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StressChart;
