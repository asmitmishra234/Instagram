import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/ContextApi";
import { followUserApi, unfollowUserApi } from "../auth/services/post.api";

const ReelsPage = () => {
  const { user } = useContext(AuthContext);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followState, setFollowState] = useState({});

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await axios.get("https://instagram-8x5l.onrender.com/api/reel/feed", {
          withCredentials: true,
        });
        setReels(response.data.reels || []);
      } catch (error) {
        console.error("Reels fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const handleFollowToggle = async (creator) => {
    if (!creator?._id && !creator?.id) return;

    const currentUserId = user?.id || user?._id;
    const creatorId = creator._id || creator.id;

    if (!currentUserId || currentUserId === creatorId) return;

    const isFollowing = !!followState[creatorId];

    try {
      if (isFollowing) {
        await unfollowUserApi(creatorId);
      } else {
        await followUserApi(creatorId);
      }

      setFollowState((prev) => ({
        ...prev,
        [creatorId]: !isFollowing,
      }));
    } catch (error) {
      console.error("Follow toggle failed:", error);
      alert(error.response?.data?.message || "Follow action failed");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="profile-head-row">
          <h1>Reels</h1>
          <Link to="/" className="ghost-btn">Back home</Link>
        </div>

        {loading ? (
          <div className="empty-state">Loading reels...</div>
        ) : reels.length === 0 ? (
          <div className="empty-state">No reels yet.</div>
        ) : (
          <div className="reels-grid">
            {reels.map((reel) => {
              const creatorId = reel.user?._id || reel.user?.id;
              const isFollowing = !!(creatorId && followState[creatorId]);
              const isOwnProfile = (user?.id || user?._id) && creatorId && (user.id || user._id)?.toString() === creatorId.toString();

              return (
                <div className="reel-card" key={reel._id || reel.id}>
                  {reel.videoUrl ? (
                    <video src={reel.videoUrl} controls autoPlay playsInline />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80" alt="Reel cover" />
                  )}
                  <div className="reel-meta">
                    <div>
                      <strong>{reel.user?.userName || "Creator"}</strong>
                      <span>{reel.views || 0} views</span>
                    </div>

                    {!isOwnProfile && (
                      <button
                        type="button"
                        className="primary-btn"
                        style={{ padding: "6px 10px", fontSize: 12 }}
                        onClick={() => handleFollowToggle(reel.user)}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelsPage;
