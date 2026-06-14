import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { studentApi } from '../../services/api';
import { Search, UserPlus, UserMinus, Users, CheckCircle, Zap, Shield, SearchCode, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentNetwork() {
  const [activeTab, setActiveTab] = useState('explore'); // explore, followers, following, leaderboard
  const [students, setStudents] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [summary, setSummary] = useState({ followersCount: 0, followingCount: 0, score: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummaryAndData = async () => {
    try {
      setLoading(true);
      const summaryRes = await studentApi.getNetworkSummary();
      setSummary(summaryRes.data);

      if (activeTab === 'explore') {
        const studentsRes = await studentApi.getStudentsList(searchQuery);
        setStudents(studentsRes.data);
      } else if (activeTab === 'followers') {
        const followersRes = await studentApi.getFollowers();
        setFollowers(followersRes.data);
      } else if (activeTab === 'following' || activeTab === 'leaderboard') {
        const followingRes = await studentApi.getFollowing();
        setFollowing(followingRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryAndData();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSummaryAndData();
  };

  // Optimistically flip isFollowing in the local students list for instant UI feedback
  const toggleFollowingLocally = (id, nowFollowing) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, isFollowing: nowFollowing } : s)
    );
    setFollowers(prev =>
      prev.map(s => s.id === id ? { ...s, isFollowing: nowFollowing } : s)
    );
    setSummary(prev => ({
      ...prev,
      followingCount: prev.followingCount + (nowFollowing ? 1 : -1)
    }));
  };

  const handleFollow = async (id, name) => {
    toggleFollowingLocally(id, true); // instant UI update
    try {
      await studentApi.followStudent(id);
      toast.success(`You are now following ${name}!`);
      fetchSummaryAndData(); // sync counts in background
    } catch (err) {
      console.error(err);
      toggleFollowingLocally(id, false); // revert on error
      toast.error('Failed to follow student');
    }
  };

  const handleUnfollow = async (id, name) => {
    toggleFollowingLocally(id, false); // instant UI update
    try {
      await studentApi.unfollowStudent(id);
      toast.success(`You unfollowed ${name}`);
      fetchSummaryAndData(); // sync counts in background
    } catch (err) {
      console.error(err);
      toggleFollowingLocally(id, true); // revert on error
      toast.error('Failed to unfollow student');
    }
  };

  const getLeaderboardData = () => {
    const currentUserItem = {
      id: summary.id,
      name: summary.name,
      email: summary.email,
      collegeName: summary.collegeName,
      score: summary.score || 0,
      isCurrentUser: true
    };
    const list = [currentUserItem, ...following];
    return list.sort((a, b) => b.score - a.score);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10 rounded-full" />
            <h1 className="text-4xl font-bold text-white mb-2">
              My <span className="gradient-text">Network</span>
            </h1>
            <p className="text-gray-600">
              Build your campus circle, follow fellow students, and see what events they're exploring.
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="stat-card flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Followers</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{summary.followersCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Users size={24} />
              </div>
            </div>

            <div className="stat-card flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Following</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{summary.followingCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <UserPlus size={24} />
              </div>
            </div>

            <div className="stat-card flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">My Points Score</p>
                <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
                  {summary.score || 0} <span className="text-sm font-bold text-slate-500 uppercase">pts</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Trophy size={24} />
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-300 mb-8 gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('explore')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all relative whitespace-nowrap ${
                activeTab === 'explore' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Explore Students
              {activeTab === 'explore' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all relative whitespace-nowrap ${
                activeTab === 'following' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Following ({summary.followingCount})
              {activeTab === 'following' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all relative whitespace-nowrap ${
                activeTab === 'followers' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Followers ({summary.followersCount})
              {activeTab === 'followers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all relative whitespace-nowrap ${
                activeTab === 'leaderboard' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leaderboard 🏆
              {activeTab === 'leaderboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Search box for Explore tab */}
          {activeTab === 'explore' && (
            <form onSubmit={handleSearchSubmit} className="mb-8 max-w-md">
              <div className="glass-input-group relative">
                <Search className="icon-left" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, college, or email..."
                  className="input-field input-with-icon"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass rounded-3xl p-6 border border-gray-300 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded skeleton" />
                      <div className="h-3 w-48 rounded skeleton" />
                    </div>
                  </div>
                  <div className="h-8 w-full rounded-xl skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {activeTab === 'explore' &&
                  students.map((student) => (
                    <div
                      key={student.id}
                      className="glass rounded-3xl p-6 border border-gray-300 flex flex-col justify-between hover:border-indigo-400 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-600/20">
                            {student.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-gray-900 truncate">{student.name}</h4>
                            <p className="text-gray-600 text-xs truncate mt-0.5">{student.email}</p>
                            {student.collegeName && (
                              <p className="text-gray-600 text-[10px] truncate mt-1 uppercase font-semibold tracking-wider">
                                {student.collegeName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Network Stats */}
                        <div className="flex gap-4 py-3 border-y border-gray-200 my-4">
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Followers</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followersCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Following</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followingCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-indigo-600 text-[10px] uppercase font-bold tracking-wider">Score</p>
                            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{student.score || 0} pts</p>
                          </div>
                        </div>
                      </div>

                      {student.isFollowing ? (
                        <button
                          onClick={() => handleUnfollow(student.id, student.name)}
                          className="w-full py-2.5 rounded-xl border border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-red-50 hover:border-red-400 hover:text-red-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group/btn"
                        >
                          <CheckCircle size={14} className="group-hover/btn:hidden" />
                          <UserMinus size={14} className="hidden group-hover/btn:inline" />
                          <span className="group-hover/btn:hidden">Following</span>
                          <span className="hidden group-hover/btn:inline">Unfollow</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(student.id, student.name)}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserPlus size={14} /> Follow
                        </button>
                      )}
                    </div>
                  ))}

                {activeTab === 'following' &&
                  following.map((student) => (
                    <div
                      key={student.id}
                      className="glass rounded-3xl p-6 border border-gray-300 flex flex-col justify-between hover:border-indigo-400 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-600/20">
                            {student.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-gray-900 truncate">{student.name}</h4>
                            <p className="text-gray-600 text-xs truncate mt-0.5">{student.email}</p>
                            {student.collegeName && (
                              <p className="text-gray-600 text-[10px] truncate mt-1 uppercase font-semibold tracking-wider">
                                {student.collegeName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Network Stats */}
                        <div className="flex gap-4 py-3 border-y border-gray-200 my-4">
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Followers</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followersCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Following</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followingCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-indigo-600 text-[10px] uppercase font-bold tracking-wider">Score</p>
                            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{student.score || 0} pts</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnfollow(student.id, student.name)}
                        className="w-full py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserMinus size={14} /> Unfollow
                      </button>
                    </div>
                  ))}

                {activeTab === 'followers' &&
                  followers.map((student) => (
                    <div
                      key={student.id}
                      className="glass rounded-3xl p-6 border border-gray-300 flex flex-col justify-between hover:border-indigo-400 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-600/20">
                            {student.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-gray-900 truncate">{student.name}</h4>
                            <p className="text-gray-600 text-xs truncate mt-0.5">{student.email}</p>
                            {student.collegeName && (
                              <p className="text-gray-600 text-[10px] truncate mt-1 uppercase font-semibold tracking-wider">
                                {student.collegeName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Network Stats */}
                        <div className="flex gap-4 py-3 border-y border-gray-200 my-4">
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Followers</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followersCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Following</p>
                            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{student.followingCount}</p>
                          </div>
                          <div className="w-[1px] bg-gray-300" />
                          <div className="text-center flex-1">
                            <p className="text-indigo-600 text-[10px] uppercase font-bold tracking-wider">Score</p>
                            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{student.score || 0} pts</p>
                          </div>
                        </div>
                      </div>

                      {student.isFollowing ? (
                        <button
                          onClick={() => handleUnfollow(student.id, student.name)}
                          className="w-full py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserMinus size={14} /> Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(student.id, student.name)}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserPlus size={14} /> Follow Back
                        </button>
                      )}
                    </div>
                  ))}
              </div>

              {/* Leaderboard View */}
              {activeTab === 'leaderboard' && getLeaderboardData().length > 0 && (
                <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
                  <div className="glass rounded-3xl p-6 border border-gray-300 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Trophy className="text-amber-500" size={24} />
                      <h3 className="text-xl font-bold text-gray-900">Following Leaderboard</h3>
                    </div>
                    <div className="space-y-3">
                      {getLeaderboardData().map((student, index) => {
                        const rank = index + 1;
                        let medalColor = "";
                        let rankBadge = `#${rank}`;
                        if (rank === 1) {
                          medalColor = "bg-amber-100 text-amber-600 border-amber-300";
                          rankBadge = "🥇";
                        } else if (rank === 2) {
                          medalColor = "bg-slate-100 text-slate-600 border-slate-300";
                          rankBadge = "🥈";
                        } else if (rank === 3) {
                          medalColor = "bg-amber-50/50 text-amber-800 border-amber-200";
                          rankBadge = "🥉";
                        }

                        return (
                          <div
                            key={student.isCurrentUser ? 'me' : student.id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                              student.isCurrentUser
                                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-400 shadow-md shadow-indigo-500/5'
                                : 'bg-white/5 border-gray-300 hover:border-indigo-400'
                            }`}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-sm ${medalColor || 'border-gray-200 text-gray-500'}`}>
                                {rankBadge}
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                                {student.name?.[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                                  {student.name}
                                  {student.isCurrentUser && (
                                    <span className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                      You
                                    </span>
                                  )}
                                </h4>
                                <p className="text-gray-500 text-xs truncate">{student.collegeName || student.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-indigo-600">{student.score}</span>
                              <span className="text-[10px] text-gray-500 font-bold uppercase ml-1">pts</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty States */}
              {activeTab === 'explore' && students.length === 0 && (
                <div className="glass p-12 text-center rounded-3xl border border-white/5 max-w-md mx-auto">
                  <SearchCode className="mx-auto text-slate-500 mb-4" size={40} />
                  <h4 className="text-white font-bold mb-2">No Students Found</h4>
                  <p className="text-slate-400 text-sm">
                    Try searching for something else or check back as more students sign up!
                  </p>
                </div>
              )}

              {activeTab === 'following' && following.length === 0 && (
                <div className="glass p-12 text-center rounded-3xl border border-white/5 max-w-md mx-auto">
                  <UserPlus className="mx-auto text-slate-500 mb-4" size={40} />
                  <h4 className="text-white font-bold mb-2">Not Following Anyone Yet</h4>
                  <p className="text-slate-400 text-sm">
                    Find other students in the "Explore Students" tab and build your connections.
                  </p>
                </div>
              )}

              {activeTab === 'followers' && followers.length === 0 && (
                <div className="glass p-12 text-center rounded-3xl border border-white/5 max-w-md mx-auto">
                  <Users className="mx-auto text-slate-500 mb-4" size={40} />
                  <h4 className="text-white font-bold mb-2">No Followers Yet</h4>
                  <p className="text-slate-400 text-sm">
                    When other students follow you, they will show up here.
                  </p>
                </div>
              )}

              {activeTab === 'leaderboard' && following.length === 0 && (
                <div className="glass p-12 text-center rounded-3xl border border-white/5 max-w-md mx-auto">
                  <Trophy className="mx-auto text-slate-500 mb-4" size={40} />
                  <h4 className="text-white font-bold mb-2">No Leaderboard Data</h4>
                  <p className="text-slate-400 text-sm">
                    Follow other students to see how your scores compare on the leaderboard!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
