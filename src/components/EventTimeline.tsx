import React, { useState } from 'react';
import { Timeline, TimelineNode } from '../types';

interface EventTimelineProps {
  timelineData: Timeline[];
  onNodeClick?: (node: TimelineNode) => void;
}

const EventTimeline: React.FC<EventTimelineProps> = ({
  timelineData,
  onNodeClick
}) => {
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  const toggleEvent = (eventId: string) => {
    if (expandedEvents.includes(eventId)) {
      setExpandedEvents(expandedEvents.filter(id => id !== eventId));
    } else {
      setExpandedEvents([...expandedEvents, eventId]);
    }
  };

  return (
    <div className="event-timeline">
      {timelineData.map(timeline => (
        <div key={timeline.eventId} className="mb-6">
          <div 
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => toggleEvent(timeline.eventId)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {expandedEvents.includes(timeline.eventId) ? '−' : '+'}
            </div>
            <h3 className="ml-4 text-lg font-semibold">{timeline.eventName}</h3>
          </div>
          {expandedEvents.includes(timeline.eventId) && (
            <div className="ml-12 border-l-2 border-gray-200 pl-6 space-y-6">
              {timeline.nodes.map((node, index) => (
                <div key={node.id} className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">{node.time}</div>
                    <h4 className="font-medium mb-2">{node.title}</h4>
                    {node.description && (
                      <p className="text-sm text-gray-600 mb-3">{node.description}</p>
                    )}
                    {node.evidenceUrl && (
                      <div className="mb-3">
                        <img 
                          src={node.evidenceUrl} 
                          alt="Evidence" 
                          className="max-w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => onNodeClick?.(node)}
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventTimeline;
