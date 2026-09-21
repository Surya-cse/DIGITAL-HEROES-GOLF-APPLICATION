import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { 
  Users, 
  Search, 
  UserPlus, 
  Shield, 
  CreditCard, 
  MoreVertical,
  Mail,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { User, UserRole } from '../../types';

const UserMgmt: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin-control/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: UserRole) => {
    const newRole: UserRole = currentRole === 'ADMIN' ? 'SUBSCRIBER' : 'ADMIN';
    if (!window.confirm(`Change user to ${newRole}?`)) return;

    try {
      await api.patch(`/admin-control/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Role update failed");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Manage platform access, roles, and community members.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Users</p>
            <p className="text-xl font-black text-slate-900">{users.length}</p>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="SUBSCRIBER">Subscribers</option>
            <option value="PUBLIC">Public</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Member</th>
                <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Role</th>
                <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Joined</th>
                <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="p-20 text-center animate-pulse text-slate-400 font-bold">Fetching Community Data...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                        {user.fullName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.fullName || 'Anonymous'}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 
                      user.role === 'SUBSCRIBER' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-sm font-medium text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleUserRole(user.id, user.role)}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Toggle Admin Privilege"
                      >
                        <Shield size={18} />
                      </button>
                      <button className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!isLoading && filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold">No members found matching those filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMgmt;