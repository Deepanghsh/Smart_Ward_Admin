import React from 'react';
import { Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { getPriorityColor, getStatusColor, getTimeAgo } from '../../utils/dataUtils';

export const IssueCard = ({ issue, onClick }) => {
  const priorityColor = getPriorityColor(issue.priority);
  const statusColor = getStatusColor(issue.status);

  return (
    <div
      onClick={() => onClick && onClick(issue)}
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-5 transition-all duration-300 hover:shadow-lg cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{issue.description}</p>
        </div>
        <span className={`ml-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityColor.bg} ${priorityColor.text} whitespace-nowrap`}>
          {issue.priority}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{issue.hostel} • {issue.block} • Room {issue.room}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{getTimeAgo(issue.reportedDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">{issue.reporter}</p>
            <p className="text-xs text-gray-500">{issue.assignedTo || 'Unassigned'}</p>
          </div>
        </div>

        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusColor.bg} ${statusColor.text} capitalize`}>
          {issue.status}
        </span>
      </div>

      {issue.category && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            {issue.category}
          </span>
        </div>
      )}
    </div>
  );
};
