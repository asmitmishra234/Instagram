import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/ContextApi";
import { followUserApi, unfollowUserApi } from "../auth/services/post.api";

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    profileImage: user?.profileImage || "",
    bio: user?.bio || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id && !user?._id) return;

    try {
   const response = await axios.get(
  `https://instagram-8x5l.onrender.com/api/auth/${user.id || user._id}/profile`,
  {
    withCredentials: true,
  }
);
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    setFormData({
      userName: user?.userName || "",
      profileImage: user?.profileImage || "",
      bio: user?.bio || "",
    });
  }, [user]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFormData((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = new FormData();
      if (formData.userName.trim()) payload.append("userName", formData.userName.trim());
      payload.append("bio", formData.bio.trim());
      if (selectedFile) {
        payload.append("profileImage", selectedFile);
      } else if (formData.profileImage.trim()) {
        payload.append("profileImage", formData.profileImage.trim());
      }

      await updateProfile(payload);
      await fetchProfile();
      setEditing(false);
      setSelectedFile(null);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFollowToggle = async () => {
    const targetUserId = profileUser?._id || profileUser?.id;
    if (!targetUserId) return;

    const currentUserId = user?.id || user?._id;
    if (targetUserId?.toString() === currentUserId?.toString()) return;

    try {
      setFollowActionLoading(true);

      if (profileUser.isFollowing) {
        await unfollowUserApi(targetUserId);
        setProfile((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            isFollowing: false,
            followersCount: Math.max((prev.user?.followersCount || 0) - 1, 0),
          },
        }));
      } else {
        await followUserApi(targetUserId);
        setProfile((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            isFollowing: true,
            followersCount: (prev.user?.followersCount || 0) + 1,
          },
        }));
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Follow action failed");
    } finally {
      setFollowActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  const profileUser = profile?.user || {
    userName: user?.userName || "Guest",
    profileImage: user?.profileImage || "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  const posts = profile?.posts || [];

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="profile-hero">
          <div className="profile-avatar">
            {profileUser.profileImage ? (
              <img src={profileUser.profileImage} alt={profileUser.userName} />
            ) : (
              <span>{(profileUser.userName || "U").charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div>
            <div className="profile-head-row">
              <h1>{profileUser.userName}</h1>
              {profileUser._id && (user?.id || user?._id) && (profileUser._id?.toString() !== (user?.id || user?._id)?.toString()) ? (
                <button
                  className={profileUser.isFollowing ? "ghost-btn" : "primary-btn"}
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={followActionLoading}
                >
                  {followActionLoading ? "Please wait..." : profileUser.isFollowing ? "Following" : "Follow"}
                </button>
              ) : (
                <button className="secondary-btn" type="button" onClick={() => setEditing((prev) => !prev)}>Edit profile</button>
              )}
              <Link to="/" className="ghost-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>Back home</Link>
            </div>
            

            <div className="profile-stats">
              <div><strong>{profileUser.postsCount || posts.length}</strong> posts</div>
              <div><strong>{profileUser.followersCount || 0}</strong> followers</div>
              <div><strong>{profileUser.followingCount || 0}</strong> following</div>
            </div>

            <div className="profile-bio">
              {profileUser.bio || "Write a short bio about yourself."}
              <span className="small-muted">{user?.email || "Instagram member"}</span>
            </div>
          </div>
        </div>

        {editing && (
          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="input-wrap">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleFieldChange}
                placeholder="Username"
              />
            </div>

            <div className="input-wrap">
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleFieldChange}
                placeholder="Profile image URL"
              />
            </div>

            <div className="input-wrap">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleFieldChange}
                placeholder="Write your bio"
                rows={3}
                maxLength={150}
              />
            </div>

            <div className="input-wrap">
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button className="ghost-btn" type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="gallery-grid">
          {posts.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>No posts yet. Create your first Instagram moment.</div>
          ) : (
            posts.map((post) => (
              <div className="gallery-item" key={post._id || post.id}>
                <img src={post.imageUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"} alt={post.caption || "Profile post"} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
