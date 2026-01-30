import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { Plus, Search, MapPin, Calendar, Tag } from 'lucide-react';

export const LostFoundPage = () => {
  const [filter, setFilter] = useState('all');
  
  const items = [
    {
      id: 'LF001',
      title: 'Black Backpack',
      type: 'lost',
      category: 'Bag',
      location: 'Hostel A - Common Room',
      date: '2026-01-27T10:00:00',
      description: 'Black Nike backpack with laptop inside',
      reporter: 'Rahul Kumar',
      status: 'active',
    },
    {
      id: 'LF002',
      title: 'Mobile Phone - iPhone 13',
      type: 'found',
      category: 'Electronics',
      location: 'Hostel C - Mess',
      date: '2026-01-26T18:30:00',
      description: 'Blue iPhone 13 found near dining area',
      reporter: 'Priya Sharma',
      status: 'active',
    },
    {
      id: 'LF003',
      title: 'Sports Shoes',
      type: 'lost',
      category: 'Footwear',
      location: 'Hostel B - Gym',
      date: '2026-01-25T07:00:00',
      description: 'White Adidas running shoes, size 9',
      reporter: 'Amit Singh',
      status: 'active',
    },
    {
      id: 'LF004',
      title: 'Textbooks',
      type: 'found',
      category: 'Books',
      location: 'Hostel D - Library',
      date: '2026-01-24T15:00:00',
      description: 'Engineering textbooks with name inside',
      reporter: 'Neha Patel',
      status: 'claimed',
    },
    {
      id: 'LF005',
      title: 'Wrist Watch',
      type: 'lost',
      category: 'Accessories',
      location: 'Hostel A - Block C',
      date: '2026-01-23T12:00:00',
      description: 'Silver Casio watch, sentimental value',
      reporter: 'Vijay Kumar',
      status: 'active',
    },
  ];

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'lost') return item.type === 'lost';
    if (filter === 'found') return item.type === 'found';
    if (filter === 'claimed') return item.status === 'claimed';
    return true;
  });

  const getTypeColor = (type) => {
    return type === 'lost' 
      ? 'bg-red-100 text-red-700 border-red-300' 
      : 'bg-green-100 text-green-700 border-green-300';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <TopBar />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lost & Found</h1>
              <p className="text-gray-600">Help students find their lost items</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Items</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{items.length}</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🔴</span>
                <span className="text-sm font-medium text-gray-600">Lost</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {items.filter(i => i.type === 'lost' && i.status === 'active').length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🟢</span>
                <span className="text-sm font-medium text-gray-600">Found</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {items.filter(i => i.type === 'found' && i.status === 'active').length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">✅</span>
                <span className="text-sm font-medium text-gray-600">Claimed</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {items.filter(i => i.status === 'claimed').length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex gap-2">
              {['all', 'lost', 'found', 'claimed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${
                  item.status === 'claimed' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </span>
                      {item.status === 'claimed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          CLAIMED
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{getTimeAgo(item.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span>Category: {item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Reported by: {item.reporter}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Contact Reporter
                  </button>
                  {item.status === 'active' && (
                    <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                      Mark as Claimed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};