import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [activeActions, setActiveActions] = useState(null);

  const closeActions = () => setActiveActions(null);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="px-4 py-6 md:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-100">Admin Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="bg-surface border border-base-300 rounded-lg p-3 md:p-4 card-hover"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                    <p className="text-lg md:text-xl font-semibold text-gray-100">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-surface border border-base-300 rounded-lg">
          {/* Tabs */}
          <div className="border-b border-base-300 overflow-x-auto">
            <div className="flex whitespace-nowrap px-4 md:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                    activeTab === tab.value
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.value
                        ? 'bg-primary/10 text-primary'
                        : 'bg-base-300 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Channel List */}
          <div className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {channels.map((channel) => (
                <ChannelListItem
                  key={channel.id}
                  channel={channel}
                  isActive={activeActions === channel.id}
                  onToggleActions={() => setActiveActions(activeActions === channel.id ? null : channel.id)}
                  onCloseActions={closeActions}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChannelListItem = ({ channel, isActive, onToggleActions, onCloseActions }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative bg-base-200 rounded-lg p-3 md:p-4 border border-base-300 hover:border-primary/50 transition-colors"
  >
    <div className="flex items-center gap-3 md:gap-4">
      <img
        src={channel.image}
        alt={channel.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base text-gray-100 truncate">{channel.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            Submitted {channel.submittedAt}
          </span>
          {channel.status && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              channel.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
              channel.status === 'approved' ? 'bg-green-500/10 text-green-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {channel.status}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-2">
        <ActionButton icon={<CheckCircleIcon className="w-5 h-5" />} label="Approve" color="text-green-400" />
        <ActionButton icon={<XCircleIcon className="w-5 h-5" />} label="Reject" color="text-red-400" />
        <ActionButton icon={<PencilIcon className="w-5 h-5" />} label="Edit" color="text-primary" />
        <ActionButton icon={<StarIcon className="w-5 h-5" />} label="Feature" color="text-yellow-400" />
      </div>

      {/* Mobile Actions Toggle */}
      <button
        onClick={onToggleActions}
        className="md:hidden p-2 hover:bg-base-300 rounded-lg"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {/* Mobile Actions Menu */}
      {isActive && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onCloseActions}
          />
          <div className="absolute right-0 top-full mt-2 bg-surface border border-base-300 rounded-lg shadow-lg py-2 z-50">
            <MobileActionButton
              icon={<CheckCircleIcon className="w-5 h-5" />}
              label="Approve"
              color="text-green-400"
            />
            <MobileActionButton
              icon={<XCircleIcon className="w-5 h-5" />}
              label="Reject"
              color="text-red-400"
            />
            <MobileActionButton
              icon={<PencilIcon className="w-5 h-5" />}
              label="Edit"
              color="text-primary"
            />
            <MobileActionButton
              icon={<StarIcon className="w-5 h-5" />}
              label="Feature"
              color="text-yellow-400"
            />
          </div>
        </>
      )}
    </div>
  </motion.div>
);

const ActionButton = ({ icon, label, color }) => (
  <button
    className={`p-2 rounded-lg hover:bg-base-300 ${color} tooltip`}
    data-tip={label}
  >
    {icon}
  </button>
);

const MobileActionButton = ({ icon, label, color }) => (
  <button
    className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-base-300 ${color}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const stats = [
  {
    label: 'Total Channels',
    value: '2,451',
    icon: <ChartBarIcon className="w-5 h-5 text-primary" />,
  },
  {
    label: 'Active Users',
    value: '45.2K',
    icon: <UsersIcon className="w-5 h-5 text-primary" />,
  },
  {
    label: 'Pending Review',
    value: '23',
    icon: <ClockIcon className="w-5 h-5 text-primary" />,
  },
  {
    label: 'Featured',
    value: '12',
    icon: <StarIcon className="w-5 h-5 text-primary" />,
  },
];

const tabs = [
  { label: 'Pending Review', value: 'pending', count: '23' },
  { label: 'Approved', value: 'approved', count: '156' },
  { label: 'Featured', value: 'featured', count: '12' },
  { label: 'Rejected', value: 'rejected', count: '45' },
];

const channels = [
  {
    id: 1,
    name: 'Tech News Daily',
    category: 'Technology',
    submittedAt: '2 hours ago',
    image: 'https://via.placeholder.com/48',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Crypto Alerts',
    category: 'Cryptocurrency',
    submittedAt: '5 hours ago',
    image: 'https://via.placeholder.com/48',
    status: 'approved',
  },
  {
    id: 3,
    name: 'Gaming Updates',
    category: 'Gaming',
    submittedAt: '1 day ago',
    image: 'https://via.placeholder.com/48',
    status: 'rejected',
  },
];

export default AdminDashboard; 