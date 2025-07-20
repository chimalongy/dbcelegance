import {
  FiActivity,
  FiDollarSign,
  FiUserPlus,
  FiTrendingUp
} from 'react-icons/fi';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$0.000</h3>
              <p className="text-green-500 flex items-center">
                <FiTrendingUp className="mr-1" />
                <span>12% from last month</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiDollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Customers</p>
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-green-500 flex items-center">
                <FiTrendingUp className="mr-1" />
                <span>8% from last month</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiUserPlus size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">New Signups</p>
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-red-500 flex items-center">
                <FiTrendingUp className="mr-1 transform rotate-180" />
                <span>3% from last month</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiActivity size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">0%</h3>
              <p className="text-green-500 flex items-center">
                <FiTrendingUp className="mr-1" />
                <span>1.2% from last month</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiTrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-800">View All</button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                <span>U{item}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Customer #{item} made a purchase</h4>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
