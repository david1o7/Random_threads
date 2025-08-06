import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Threads.css";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Thread = ({ thread, onUpvote, onReply, replyingId, setReplyingId }) => {
  const [reply, setReply] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const isReplying = replyingId === thread?.id;


  const replies = Array.isArray(thread?.replies) ? thread.replies : [];
  const upvotes = typeof thread?.likes === 'number' ? thread.likes : 0;
  const threadUsername = thread?.username || "Anonymous";
  const threadContent = thread?.content || "";
  const threadTimestamp = thread?.timestamp || "";

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    await onReply(thread?.id, reply, username);
    setReply("");
    setUsername("");
    setSubmitting(false);
    setReplyingId(null);
    setShowAllReplies(true); 
  };


  let repliesToShow = replies;
  let showCollapseButton = false;
  if (replies.length > 1 && !showAllReplies) {
    repliesToShow = [replies[0]];
    showCollapseButton = true;
  } else if (replies.length > 1 && showAllReplies) {
    showCollapseButton = true;
  }

  return (
    <div className="thread">
      <div className="avatar">{getInitials(threadUsername)}</div>
      <div className="thread-main">
        <div className="thread-header">
          <span className="username">{threadUsername}</span>
          <span className="timestamp">{threadTimestamp}</span>
        </div>
        <div className="thread-content">{threadContent}</div>
        <div className="thread-actions">
          <button onClick={() => onUpvote(thread?.id)} className="like-button">
            <span role="img" aria-label="upvote">🔥</span> Upvote ({upvotes})
          </button>
          <button 
            onClick={() => setReplyingId(isReplying ? null : thread?.id)} 
            className="reply-button"
          >
            {isReplying ? "Cancel" : <><span role="img" aria-label="reply">💬</span> Reply</>}
          </button>
        </div>
        {isReplying && (
          <div className="reply-form">
            <input
              placeholder="Your name (optional)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input"
              disabled={submitting}
            />
            <textarea
              placeholder="Share your thoughts..."
              value={reply}
              onChange={e => setReply(e.target.value)}
              className="textarea"
              disabled={submitting}
              rows="3"
            />
            <button onClick={handleReply} className="reply-button" disabled={submitting}>
              {submitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        )}
        {replies.length > 0 && (
          <div className="replies">
            <h4>💬 Replies ({replies.length})</h4>
            {repliesToShow.map((reply, idx) => {
              const replyUsername = reply?.username || "Anonymous";
              const replyContent = reply?.content || "";
              const replyTimestamp = reply?.timestamp || "";
              return (
                <div key={reply?.id || idx} className="reply">
                  <div className="reply-header">
                    <div className="avatar" style={{width: 32, height: 32, fontSize: '0.95rem'}}>{getInitials(replyUsername)}</div>
                    <strong>{replyUsername}</strong>
                    <span className="reply-timestamp">{replyTimestamp}</span>
                  </div>
                  <div className="reply-content">{replyContent}</div>
                </div>
              );
            })}
            {showCollapseButton && (
              <button
                className="reply-button"
                style={{ marginTop: 8, marginBottom: 4, background: '#222', color: '#00ffe1', fontWeight: 500 }}
                onClick={() => setShowAllReplies(v => !v)}
              >
                {showAllReplies ? `Hide replies` : `Show all replies (${replies.length})`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RandomThreads = () => {
  const [threads, setThreads] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(true);


  useEffect(() => {
    axios.get("/", { timeout: 3000 })
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
    loadThreads(1, true);

  }, []);


  const sortThreads = (threadsArr) => {
    return [...threadsArr].sort((a, b) => {
      if ((b.likes || 0) !== (a.likes || 0)) {
        return (b.likes || 0) - (a.likes || 0);
      }

      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  const loadThreads = async (pageToLoad = page, initial = false) => {
    if (loading || (!hasMore && !initial)) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/threads?page=${pageToLoad}`);
      const threadsData = Array.isArray(res.data?.threads) ? res.data.threads : [];
      setThreads(prev => sortThreads(initial ? threadsData : [...prev, ...threadsData]));
      setHasMore(!!res.data?.has_more);
      setPage(pageToLoad + 1);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load threads.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const postThread = async () => {
    if (!content.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await axios.post('/api/threads', { content, username });
      const thread = res.data || {};
      setThreads(prev => sortThreads([thread, ...prev]));
      setContent("");
      setUsername("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to post thread.");
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const upvoteThread = async (id) => {
    setError("");
    try {
      const res = await axios.post(`/api/threads/${id}/like`);
      const likes = typeof res.data?.likes === 'number' ? res.data.likes : 0;
      setThreads(prev => sortThreads(prev.map(t => t.id === id ? { ...t, likes } : t)));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to upvote thread.");
      console.error(err);
    }
  };

  const replyToThread = async (id, replyContent, replyUser) => {
    setError("");
    try {
      const res = await axios.post(`/api/threads/${id}/reply`, {
        content: replyContent,
        username: replyUser
      });
      const reply = res.data || {};
      setThreads(prev => sortThreads(prev.map(t =>
        t.id === id ? { ...t, replies: Array.isArray(t.replies) ? [...t.replies, reply] : [reply] } : t
      )));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to reply to thread.");
      console.error(err);
    }
  };

  if (!backendHealthy) {
    return (
      <div className="container">
        <div className="welcome-section">
          <h1 style={{ textAlign: "center" }}>Random Threads</h1>
          <p style={{ textAlign: "center" }}>A place to share your thoughts and connect with others</p>
          <p style={{ textAlign: "center" }} className="subtitle">What's on your mind today?</p>
        </div>
        <div className="error-message">
          <h3>⚠️ Connection Issue</h3>
          <p>Cannot connect to the server. Please make sure the backend is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="welcome-section">
        <h1 style={{ textAlign: "center" }}>🔥Random Threads</h1>
        <p style={{ textAlign: "center" }}>Be Anonymous share your thoughts</p>
        <p style={{ textAlign: "center" }} className="subtitle">spill the tea!!!</p>
      </div>

      <div className="post-form">
        <div className="form-header">
          <h3>Share Your Thoughts</h3>
        </div>
        <input
          placeholder="Your name (optional)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="input"
          disabled={posting}
        />
        <textarea
          placeholder="What's on your mind? Share your thoughts, ideas, or experiences..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="textarea"
          disabled={posting}
          rows="4"
        />
        <button onClick={postThread} className="post-button" disabled={posting}>
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="threads-section">
        <h3>Recent Thoughts ({threads.length})</h3>
        <div className="thread-list">
          {Array.isArray(threads) && threads.length > 0 ? (
            threads.map(thread => (
              <Thread
                key={thread?.id || Math.random()}
                thread={thread}
                onUpvote={upvoteThread}
                onReply={replyToThread}
                replyingId={replyingId}
                setReplyingId={setReplyingId}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>🌟 Be the first to share your thoughts!</p>
              <p>Start a conversation above 👆</p>
            </div>
          )}
        </div>
        {hasMore && (
          <button onClick={() => loadThreads(page)} className="load-button" disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RandomThreads;