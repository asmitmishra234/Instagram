import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/ContextApi";
import { followUserApi, getFeedApi, getReelsApi, toggleLikeApi, unfollowUserApi } from "../auth/services/post.api";

const suggestions = [
  { name: "cristiano", handle: "@cristiano", userId: null },
  { name: "wanderlust", handle: "@wanderlust", userId: null },
  { name: "stylehub", handle: "@stylehub", userId: null },
  {name:"Asmit Mishra", handle:"@SoftwareEngineeer", userId:null}
];

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storyLoading, setStoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState({});
  const [selectedStory, setSelectedStory] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [suggestionFollowState, setSuggestionFollowState] = useState({});

  const fetchFeed = async () => {
    try {
      const data = await getFeedApi();
      setPosts((data.posts || []).map((post) => ({ ...post, comments: post.comments || [] })));
    } catch (err) {
      setError("Unable to load your feed right now.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get("https://instagram-8x5l.onrender.com/api/post/feed", {
        withCredentials: true,
      });
      setStories(response.data.stories || []);
    } catch (err) {
      console.error("Story fetch failed:", err);
    } finally {
      setStoryLoading(false);
    }
  };

  const fetchReels = async () => {
    try {
      const data = await getReelsApi();
      setReels(data.reels || []);
    } catch (err) {
      console.error("Reel fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchStories();
    fetchReels();
  }, []);

  const handleLike = async (postId) => {
    try {
      const data = await toggleLikeApi(postId);

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id !== postId) return post;

          const liked = data.liked;
          const currentUserId = user?.id || user?._id;
          const existingLikes = Array.isArray(post.likes) ? post.likes : [];
          const updatedLikes = liked
            ? [...existingLikes, currentUserId]
            : existingLikes.filter((id) => id?.toString() !== currentUserId?.toString());

          return {
            ...post,
            likes: updatedLikes,
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = (postId) => {
    const text = (commentText[postId] || "").trim();
    if (!text) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post._id !== postId) return post;

        return {
          ...post,
          comments: [
            ...(Array.isArray(post.comments) ? post.comments : []),
            {
              _id: Date.now(),
              user: {
                userName: user?.userName || "You",
              },
              text,
            },
          ],
        };
      })
    );

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleSuggestionFollowToggle = async (suggestion) => {
    if (!suggestion.userId) return;

    const isFollowing = !!suggestionFollowState[suggestion.name];

    try {
      if (isFollowing) {
        await unfollowUserApi(suggestion.userId);
      } else {
        await followUserApi(suggestion.userId);
      }

      setSuggestionFollowState((prev) => ({
        ...prev,
        [suggestion.name]: !isFollowing,
      }));
    } catch (error) {
      console.error("Suggestion follow failed:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={darkMode ? "app-shell dark-mode" : "app-shell light-mode"}>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-mini">Time-Waste</div>

          <div className="header-pill">Search</div>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" onClick={() => navigate("/")}>🏠</button>
            <button className="icon-btn" type="button" onClick={() => navigate("/reels")}>🎬</button>
            <button className="icon-btn" type="button" onClick={() => navigate("/create")}>➕</button>
            <button className="icon-btn" type="button" onClick={() => navigate("/profile")}>👤</button>
            <button className="icon-btn" type="button" onClick={() => setDarkMode((prev) => !prev)}>{darkMode ? "☀" : "🌙"}</button>
            <button className="primary-btn" type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {selectedStory && (
        <div className="story-modal-backdrop" onClick={() => setSelectedStory(null)}>
          <div className="story-modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-story" type="button" onClick={() => setSelectedStory(null)}>×</button>
            <img src={selectedStory.imageUrl || selectedStory.user?.profileImage} alt={selectedStory.user?.userName || "Story"} />
            <div className="story-modal-user">
              <div className="avatar small-avatar">
                {selectedStory.user?.profileImage ? (
                  <img src={selectedStory.user.profileImage} alt={selectedStory.user.userName} />
                ) : (
                  <span>{(selectedStory.user?.userName || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <strong>{selectedStory.user?.userName || "User"}</strong>
            </div>
          </div>
        </div>
      )}

      <main className="content-grid app-shell">
        <section className="feed-column">
          <div className="stories-row">
            {storyLoading ? (
              <div className="story-item">
                <div className="story-outer">
                  <div className="story-inner">…</div>
                </div>
                <span>Loading</span>
              </div>
            ) : (
              stories.map((story) => (
                <div className="story-item" key={story._id || story.id} onClick={() => setSelectedStory(story)}>
                  <div className="story-outer">
                    <div className="story-inner">
                      {story.user?.profileImage ? (
                        <img src={story.user.profileImage} alt={story.user.userName} />
                      ) : (
                        <span>{(story.user?.userName || "U").charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <span>{story.user?.userName || "story"}</span>
                </div>
              ))
            )}
          </div>

          {reels.length > 0 && (
            <section className="reels-feed-section">
              <div className="section-head">
                <h3>Reels</h3>
                <button type="button" className="ghost-btn" onClick={() => navigate("/reels")}>View all</button>
              </div>

              <div className="reels-feed-grid">
                {reels.slice(0, 3).map((reel) => (
                  <div className="reel-feed-card" key={reel._id || reel.id}>
                    {reel.videoUrl ? (
                      <video src={reel.videoUrl} controls playsInline />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80" alt="Reel cover" />
                    )}
                    <div className="reel-feed-info">
                      <strong>{reel.user?.userName || "Creator"}</strong>
                      <span>{reel.views || 0} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {loading ? (
            <div className="empty-card">Loading feed...</div>
          ) : error ? (
            <div className="empty-card">{error}</div>
          ) : posts.length === 0 ? (
            <div className="empty-card">No posts yet. Create your first one.</div>
          ) : (
            posts.map((post) => {
              const currentUserId = user?.id || user?._id;
              const liked = Array.isArray(post.likes)
                ? post.likes.some((id) => id?.toString() === currentUserId?.toString())
                : false;
              const comments = Array.isArray(post.comments) ? post.comments : [];

              return (
                <article className="post-card" key={post._id || post.id}>
                  <div className="post-header">
                    <div className="post-author">
                      <div className="avatar">
                        {post.user?.profileImage ? (
                          <img src={post.user.profileImage} alt={post.user.userName} />
                        ) : (
                          <span>{(post.user?.userName || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="post-user">{post.user?.userName || "Unknown"}</div>
                        <div className="small-muted">Just now</div>
                      </div>
                    </div>
                    <button className="ghost-btn" type="button">•••</button>
                  </div>

                  <div className="post-image-wrap">
                    <img src={post.imageUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"} alt="Post" />
                  </div>

                  <div className="post-actions">
                    <div className="action-group">
                      <button className={`action-btn ${liked ? "liked" : ""}`} type="button" onClick={() => handleLike(post._id)}>
                        {liked ? "♥" : "♡"}
                      </button>
                      <button className="action-btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711Z"></path></svg>
                      </button>
                      <button className="action-btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path></svg>
                      </button>
                    </div>
                    <button className="action-btn" type="button">

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg>
                    </button>
                  </div>

                  <div className="post-body">
                    <strong>{Array.isArray(post.likes) ? post.likes.length : 0} likes</strong>
                    <div className="post-caption">
                      <span className="post-user">{post.user?.userName || "Unknown"}</span> {post.caption || "Beautiful moment shared."}
                    </div>

                    <div className="comment-list">
                      {comments.length === 0 ? (
                        <div className="small-muted">Be the first to comment.</div>
                      ) : (
                        comments.slice(-2).map((comment) => (
                          <div className="comment-item" key={comment._id || `${post._id}-${comment.text}`}>
                            <span className="post-user">{comment.user?.userName || "You"}</span>
                            <span> {comment.text}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="comment-box">
                      <input
                        type="text"
                        value={commentText[post._id] || ""}
                        onChange={(event) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post._id]: event.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                      />
                      <button type="button" onClick={() => handleAddComment(post._id)}>Post</button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="side-panel">
          <div className="profile-mini">
            <div className="profile-mini-header">
              <div className="avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.userName} />
                ) : (
                  <span>{(user?.userName || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="profile-mini-meta">
                <div className="user-name">{user?.userName || "Guest"}</div>
                <div className="user-handle">{user?.email || "member"}</div>
              </div>
              <Link to="/profile" className="muted-link">Profile</Link>
            </div>
          </div>

          <div className="suggestions-card">
            <div className="suggestions-title">
              <span>Suggestions for you</span>
              <span className="small-muted">See all</span>
            </div>

            {suggestions.map((item) => {
              const isFollowing = !!suggestionFollowState[item.name];

              return (
                <div className="suggestion-item" key={item.name}>
                  <div className="suggestion-details">
                    <div className="avatar"><span>{item.name.charAt(0).toUpperCase()}</span></div>
                    <div>
                      <div className="user-name">{item.name}</div>
                      <div className="small-muted">{item.handle}</div>
                    </div>
                  </div>
                  <button
                    className="follow-link"
                    type="button"
                    disabled={!item.userId}
                    onClick={() => handleSuggestionFollowToggle(item)}
                  >
                    {item.userId ? (isFollowing ? "Following" : "Follow") : "No profile"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default HomePage;
