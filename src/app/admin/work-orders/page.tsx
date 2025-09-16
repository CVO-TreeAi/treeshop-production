'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface WorkOrder {
  id: string;
  proposalId: string;
  customerName: string;
  projectTitle: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: string;
  assignedCrew: {
    leadTechnician: string;
    assistants: string[];
    equipment: string[];
  };
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
    accessNotes: string;
  };
  workDetails: {
    services: string[];
    specialInstructions: string;
    safetyNotes: string;
  };
  progress: {
    startTime?: string;
    endTime?: string;
    hoursWorked: number;
    completionPercentage: number;
    currentPhase: string;
    issues: string[];
    photos: string[];
  };
  customerContact: {
    phone: string;
    email: string;
    onSiteContact?: string;
  };
  materialsList: {
    item: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'kanban'>('list');
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed'>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkOrders: WorkOrder[] = [
      {
        id: 'WO-001',
        proposalId: 'P-001',
        customerName: 'John Smith',
        projectTitle: 'Residential Forestry Mulching - 5 Acres',
        status: 'scheduled',
        priority: 'normal',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: '2 days',
        assignedCrew: {
          leadTechnician: 'Mike Rodriguez',
          assistants: ['Carlos Martinez', 'David Thompson'],
          equipment: ['FMS075 Forestry Mulcher', 'Support Truck', 'Chainsaw Kit']
        },
        location: {
          address: '123 Oak Street, Brooksville, FL 34601',
          accessNotes: 'Good access via main driveway. Gate code: 1234'
        },
        workDetails: {
          services: ['Forestry Mulching', 'Site Cleanup'],
          specialInstructions: 'Preserve large oak tree near house. Customer has dogs - keep gates closed.',
          safetyNotes: 'Power lines present on west side of property. Underground utilities marked.'
        },
        progress: {
          hoursWorked: 0,
          completionPercentage: 0,
          currentPhase: 'Not Started',
          issues: [],
          photos: []
        },
        customerContact: {
          phone: '(352) 555-0123',
          email: 'john.smith@email.com',
          onSiteContact: 'Will be home after 3 PM'
        },
        materialsList: [
          { item: 'Diesel Fuel', quantity: 50, unit: 'gallons' },
          { item: 'Hydraulic Fluid', quantity: 2, unit: 'quarts' },
          { item: 'Chain Oil', quantity: 1, unit: 'gallon' }
        ]
      },
      {
        id: 'WO-002',
        proposalId: 'P-002',
        customerName: 'Sarah Johnson',
        projectTitle: 'Commercial Land Clearing - 12 Acres',
        status: 'in_progress',
        priority: 'high',
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: '5 days',
        assignedCrew: {
          leadTechnician: 'Tom Wilson',
          assistants: ['Jake Anderson', 'Luis Gomez', 'Steve Johnson'],
          equipment: ['FMS150 Forestry Mulcher', 'FMS075 Forestry Mulcher', 'Water Truck', 'Support Truck']
        },
        location: {
          address: '456 Industrial Drive, Spring Hill, FL 34609',
          accessNotes: 'Use rear entrance. Site contact: Bob Miller (352) 555-9999'
        },
        workDetails: {
          services: ['Heavy Forestry Mulching', 'Stump Grinding', 'Site Grading'],
          specialInstructions: 'Commercial development site. Wetlands flags must not be disturbed.',
          safetyNotes: 'Active construction site. Hard hats required. Check in with site manager daily.'
        },
        progress: {
          startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          hoursWorked: 12,
          completionPercentage: 35,
          currentPhase: 'Mulching Phase 1 - North Section',
          issues: ['Minor hydraulic leak on primary mulcher - repaired'],
          photos: ['progress_day1_1.jpg', 'progress_day1_2.jpg']
        },
        customerContact: {
          phone: '(352) 555-0456',
          email: 'sarah.johnson@devcompany.com',
          onSiteContact: 'Bob Miller - Site Manager'
        },
        materialsList: [
          { item: 'Diesel Fuel', quantity: 200, unit: 'gallons' },
          { item: 'Hydraulic Fluid', quantity: 5, unit: 'quarts' },
          { item: 'Steel Tracks', quantity: 2, unit: 'sets', notes: 'Replacement for worn tracks' }
        ]
      },
      {
        id: 'WO-003',
        proposalId: 'P-003',
        customerName: 'Mike Davis',
        projectTitle: 'Residential Lot Preparation - 2 Acres',
        status: 'completed',
        priority: 'normal',
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: '1 day',
        assignedCrew: {
          leadTechnician: 'Carlos Martinez',
          assistants: ['David Thompson'],
          equipment: ['FMS075 Forestry Mulcher', 'Mini Excavator']
        },
        location: {
          address: '789 Pine Road, Inverness, FL 34450',
          accessNotes: 'Narrow driveway - use smaller equipment only'
        },
        workDetails: {
          services: ['Light Forestry Mulching', 'Selective Tree Removal'],
          specialInstructions: 'Preserve all oak trees over 12" diameter. Customer will mark trees to remove.',
          safetyNotes: 'Neighbor has aggressive dogs - avoid south property line'
        },
        progress: {
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
          hoursWorked: 8,
          completionPercentage: 100,
          currentPhase: 'Completed',
          issues: [],
          photos: ['completed_1.jpg', 'completed_2.jpg', 'before_after.jpg']
        },
        customerContact: {
          phone: '(352) 555-0789',
          email: 'mike.davis@email.com'
        },
        materialsList: [
          { item: 'Diesel Fuel', quantity: 25, unit: 'gallons' },
          { item: 'Bar Oil', quantity: 1, unit: 'quart' }
        ]
      }
    ];

    setWorkOrders(mockWorkOrders);
    setLoading(false);
  }, []);

  const filteredOrders = filter === 'all' 
    ? workOrders 
    : workOrders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'in_progress': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      case 'completed': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'cancelled': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'on_hold': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const updateWorkOrderStatus = (orderId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading work orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">🚧 Work Orders</h1>
            <p className="text-gray-300">Job scheduling, crew management, and project tracking</p>
          </div>
          <button className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
            + Schedule Job
          </button>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{workOrders.filter(w => w.status === 'scheduled').length}</div>
            <div className="text-sm text-gray-400">Scheduled</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{workOrders.filter(w => w.status === 'in_progress').length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{workOrders.filter(w => w.status === 'completed').length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{workOrders.filter(w => w.priority === 'urgent' || w.priority === 'high').length}</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {workOrders.reduce((sum, w) => sum + w.progress.hoursWorked, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Hours</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Work Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {/* Filter Tabs */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {(['all', 'scheduled', 'in_progress', 'completed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        filter === status 
                          ? 'bg-green-600 text-black font-semibold' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} 
                      {status !== 'all' && ` (${workOrders.filter(w => w.status === status).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Orders List */}
              <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className={`p-6 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-gray-800/50 border-l-4 border-green-600' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-400">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">{order.projectTitle}</h3>
                        <p className="text-sm text-gray-400">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full border mb-1 ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase().replace('_', ' ')}
                        </div>
                        {order.status === 'in_progress' && (
                          <div className="text-xs text-yellow-400">
                            {order.progress.completionPercentage}% Complete
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div>
                        <span className="text-gray-500">Crew:</span> {order.assignedCrew.leadTechnician}
                      </div>
                      <div>
                        <span className="text-gray-500">Scheduled:</span> {new Date(order.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>

                    {order.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${order.progress.completionPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.progress.currentPhase}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Order Details */}
          <div>
            {selectedOrder ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white">Work Order Details</h3>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateWorkOrderStatus(selectedOrder.id, e.target.value as WorkOrder['status'])}
                      className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Work Order ID</label>
                      <div className="font-mono text-white">{selectedOrder.id}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Priority</label>
                      <div className={`inline-block px-2 py-1 rounded text-xs ${getPriorityColor(selectedOrder.priority)}`}>
                        {selectedOrder.priority.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Customer</label>
                    <div className="text-white font-medium">{selectedOrder.customerName}</div>
                    <div className="text-sm text-gray-300">{selectedOrder.customerContact.phone}</div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <div className="text-white">{selectedOrder.location.address}</div>
                    {selectedOrder.location.accessNotes && (
                      <div className="text-sm text-blue-300 mt-1">
                        📝 {selectedOrder.location.accessNotes}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Assigned Crew</label>
                    <div className="text-white font-medium">{selectedOrder.assignedCrew.leadTechnician}</div>
                    <div className="text-sm text-gray-300">
                      Assistants: {selectedOrder.assignedCrew.assistants.join(', ')}
                    </div>
                    <div className="text-sm text-gray-300">
                      Equipment: {selectedOrder.assignedCrew.equipment.join(', ')}
                    </div>
                  </div>

                  {selectedOrder.status === 'in_progress' && (
                    <div>
                      <label className="text-sm text-gray-400">Progress</label>
                      <div className="bg-gray-800/50 p-3 rounded mt-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-white">Completion</span>
                          <span className="text-sm text-yellow-400">{selectedOrder.progress.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${selectedOrder.progress.completionPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-300">{selectedOrder.progress.currentPhase}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Hours worked: {selectedOrder.progress.hoursWorked}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-400">Services</label>
                    <div className="text-white">
                      {selectedOrder.workDetails.services.join(', ')}
                    </div>
                  </div>

                  {selectedOrder.workDetails.specialInstructions && (
                    <div>
                      <label className="text-sm text-gray-400">Special Instructions</label>
                      <div className="text-sm text-blue-300 bg-blue-900/20 p-3 rounded mt-1">
                        {selectedOrder.workDetails.specialInstructions}
                      </div>
                    </div>
                  )}

                  {selectedOrder.workDetails.safetyNotes && (
                    <div>
                      <label className="text-sm text-gray-400">Safety Notes</label>
                      <div className="text-sm text-red-300 bg-red-900/20 p-3 rounded mt-1">
                        ⚠️ {selectedOrder.workDetails.safetyNotes}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 bg-green-600 hover:bg-green-500 text-black py-2 rounded font-semibold">
                      Update Status
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded">
                      View Map
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
                <div className="text-4xl mb-4">🚧</div>
                <p>Select a work order to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}