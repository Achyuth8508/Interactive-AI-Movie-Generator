import React, { useEffect, useState } from 'react';
import { Users, Vote, Send, Radio, MessageSquare, ShieldCheck } from 'lucide-react';
import { Voter, StoryChoice } from '../types';
import { CHAT_COMMENTS_TEMPLATES } from '../data';

interface MultiplayerLobbyProps {
  choices: StoryChoice[];
  isVotingActive: boolean;
  onVoteComplete: (choiceId: string) => void;
  gameMode: 'solo' | 'audience';
  onChangeGameMode: (mode: 'solo' | 'audience') => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  choices,
  isVotingActive,
  onVoteComplete,
  gameMode,
  onChangeGameMode,
}) => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [chatFeed, setChatFeed] = useState<{ id: string; user: string; text: string; color: string }[]>([]);
  const [userComment, setUserComment] = useState('');
  const [voteTallies, setVoteTallies] = useState<Record<string, number>>({});
  const [voteTimer, setVoteTimer] = useState(10); // 10s countdown

  // Initialize fake spectators lobby list
  useEffect(() => {
    const list: Voter[] = [
      { id: '1', username: 'PixelCore', avatarColor: '#ec4899', votedChoiceId: null, opinion: 'Let\'s go cyber!' },
      { id: '2', username: 'GigaKnight_4', avatarColor: '#3b82f6', votedChoiceId: null, opinion: 'Slash the seals!' },
      { id: '3', username: 'RetroVader', avatarColor: '#10b981', votedChoiceId: null, opinion: 'Jazz looks sweet' },
      { id: '4', username: 'Astrogazer', avatarColor: '#f59e0b', votedChoiceId: null, opinion: 'Descend to Epsilon!' },
      { id: '5', username: 'ConsoleCowboy', avatarColor: '#8b5cf6', votedChoiceId: null, opinion: 'Override works!' }
    ];
    setVoters(list);

    // Initial chats
    setChatFeed([
      { id: 'c1', user: 'Astrogazer', text: 'Stunning cinematography! Dialing up reverb filter.', color: '#f59e0b' },
      { id: 'c2', user: 'ConsoleCowboy', text: 'Wait, does the drone have thermal lock? Better hack Kane!', color: '#8b5cf6' },
      { id: 'c3', user: 'GigaKnight_4', text: 'Runic blade design is top-tier.', color: '#3b82f6' }
    ]);
  }, []);

  // Simulate continuous scrolling live chat feed during gameplay
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['SystemGlow', 'CosmicWanderer', 'SilverBlade', 'RetroDetective', 'NeonPhantom', 'CyberDiva', 'GallowsVow'];
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
      
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomColor = colors[users.indexOf(randomUser) % colors.length];
      const randomComment = CHAT_COMMENTS_TEMPLATES[Math.floor(Math.random() * CHAT_COMMENTS_TEMPLATES.length)];

      setChatFeed((prev) => [
        ...prev.slice(-12), // Keep last 12 elements
        { id: Math.random().toString(), user: randomUser, text: randomComment, color: randomColor }
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Simulate real-time voter tally calculations when branching choices are presented
  useEffect(() => {
    if (!isVotingActive || choices.length === 0) {
      setVoteTallies({});
      setVoteTimer(10);
      return;
    }

    // Set initial tallies to 0
    const initialTallies: Record<string, number> = {};
    choices.forEach((c) => {
      initialTallies[c.id] = 0;
    });
    setVoteTallies(initialTallies);

    // Countdown and rolling votes tally generator
    let secondsLeft = 10;
    const countdown = setInterval(() => {
      secondsLeft--;
      setVoteTimer(secondsLeft);

      // Simulate a few voters casting their vote on choices
      setVoteTallies((prev) => {
        const next = { ...prev };
        choices.forEach((c) => {
          // Weighted random votes
          const weight = c.text.includes('Requires') || c.text.includes('Violent') ? 6.2 : 4.1;
          const additional = Math.floor(Math.random() * 5 + weight);
          next[c.id] = (next[c.id] || 0) + additional;
        });
        return next;
      });

      // When countdown hits zero, select winner choice automatically
      if (secondsLeft <= 0) {
        clearInterval(countdown);
        // Find maximum vote winner
        let winnerChoiceId = choices[0].id;
        let maxVotes = -1;
        
        choices.forEach((c) => {
          const v = voteTallies[c.id] || 0;
          if (v > maxVotes) {
            maxVotes = v;
            winnerChoiceId = c.id;
          }
        });

        // Trigger co-director callback
        if (gameMode === 'audience') {
          setTimeout(() => {
            onVoteComplete(winnerChoiceId);
          }, 800);
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [isVotingActive, choices, gameMode]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setChatFeed((prev) => [
      ...prev,
      { id: Math.random().toString(), user: 'Me (Co-Director)', text: userComment, color: '#f43f5e' }
    ]);
    setUserComment('');
  };

  // Turn tallies to percentages
  const getTotalVotes = (): number => {
    const vals = Object.values(voteTallies) as number[];
    return vals.reduce((a, b) => a + b, 0) || 1;
  };

  return (
    <div id="multiplayer-voting-lobby" className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ec4899]" />
            <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">SPECTATOR LOBBY & VOTING</h2>
          </div>
          {/* Solo vs Co-Director Mode Selectors */}
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-850 self-start">
            <button
              onClick={() => onChangeGameMode('solo')}
              className={`px-2.5 py-1 text-[9.5px] font-mono leading-none tracking-wider rounded transition-all cursor-pointer ${
                gameMode === 'solo' 
                  ? 'bg-rose-500 text-white font-bold' 
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              SOLO WORKSHOP
            </button>
            <button
              onClick={() => onChangeGameMode('audience')}
              className={`px-2.5 py-1 text-[9.5px] font-mono leading-none tracking-wider rounded transition-all cursor-pointer ${
                gameMode === 'audience' 
                  ? 'bg-rose-500 text-white font-bold' 
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              CO-DIRECTOR VOTE
            </button>
          </div>
        </div>

        {/* Voting simulation view */}
        {isVotingActive && choices.length > 0 ? (
          <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-rose-400 font-black tracking-widest flex items-center gap-1.5 uppercase">
                <Vote className="w-3.5 h-3.5 animate-bounce" />
                Audience is Voting Now!
              </span>
              <span className="text-xs font-mono font-bold bg-rose-500 text-white px-2 py-0.5 rounded animate-pulse">
                {voteTimer}s LEFT
              </span>
            </div>

            <p className="text-[10.5px] text-slate-400 font-mono mb-3 leading-relaxed">
              {gameMode === 'audience' 
                ? "The choice with the highest user votes will execute automatically when the countdown ends." 
                : "Audience simulation voting running. You are in Solo mode; select any option yourself at any time."
              }
            </p>

            <div className="space-y-3">
              {choices.map((c) => {
                const votesCount = voteTallies[c.id] || 0;
                const percent = Math.round((votesCount / getTotalVotes()) * 100);
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-200 line-clamp-1">{c.text}</span>
                      <span className="text-[#ec4899] font-bold shrink-0">{percent}% ({votesCount})</span>
                    </div>
                    {/* Progress Bar background */}
                    <div className="w-full bg-slate-950 h-2 rounded border border-slate-800 overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-purple-600 h-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/60 mb-4 flex items-center justify-center min-h-[90px] select-none text-center">
            <div>
              <Radio className="w-5 h-5 text-slate-600 mx-auto mb-1 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">No Active Voting Queue</span>
              <span className="text-[9px] text-slate-600 font-mono mt-0.5 block">Waiting till playback position reaches alternative branch choices</span>
            </div>
          </div>
        )}

        {/* Live Chats stream scroll */}
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#ec4899]" />
          SPECTATORS LIVEFEED CHAT
        </label>

        <div className="bg-slate-950 border border-slate-900 rounded p-3 h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent space-y-2.5">
          {chatFeed.map((chat) => (
            <div key={chat.id} className="text-[11px] leading-relaxed">
              <span className="font-bold font-mono mr-1.5" style={{ color: chat.color }}>
                @{chat.user}:
              </span>
              <span className="text-slate-300 font-sans">{chat.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Chat input */}
      <form onSubmit={handlePostComment} className="mt-3 flex gap-2">
        <input
          id="chat-user-comment-input"
          type="text"
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="Command simulated spectators (e.g., 'Double cross Jack!')"
          className="flex-1 overflow-hidden bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
        />
        <button 
          id="post-chat-comment-btn"
          type="submit" 
          className="bg-rose-600 hover:bg-rose-500 text-white p-2 rounded cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
