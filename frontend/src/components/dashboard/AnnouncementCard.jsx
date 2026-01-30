import React from 'react';
import { Megaphone, Calendar, User, MapPin } from 'lucide-react';
import { formatDate, getTimeAgo } from '../../utils/dataUtils';

export const AnnouncementCard = ({ announcement }) => {
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Megaphone className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900 flex-1">{announcement.title}</h3>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityStyles(announcement.priority)} whitespace-nowrap`}>
              {announcement.priority}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{announcement.content}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{getTimeAgo(announcement.date)}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{announcement.hostel}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{announcement.author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
