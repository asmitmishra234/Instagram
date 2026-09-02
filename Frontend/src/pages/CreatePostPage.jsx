import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/ContextApi";
import { createPostApi, createReelApi, createStoryApi } from "../auth/services/post.api";

const CreatePostPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("post");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type) => {
    setMediaType(type);
    setMediaFile(null);
    setPreview("");
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!mediaFile) {
      alert(mediaType === "reel" ? "Please upload a video first." : "Please upload a media file first.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);

    try {
      setLoading(true);

      if (mediaType === "post") {
        formData.append("image", mediaFile);
        await createPostApi(formData);
      } else if (mediaType === "story") {
        formData.append("image", mediaFile);
        await createStoryApi(formData);
      } else {
        formData.append("video", mediaFile);
        await createReelApi(formData);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="profile-head-row" style={{ marginBottom: 24 }}>
          <h1>{mediaType === "post" ? "Create new post" : mediaType === "story" ? "Create story" : "Upload reel"}</h1>
        </div>

        <div className="segmented-control" style={{ marginBottom: 20 }}>
          {[
            { key: "post", label: "Post" },
            { key: "story", label: "Story" },
            { key: "reel", label: "Reel" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              className={mediaType === option.key ? "segment-btn active" : "segment-btn"}
              onClick={() => handleTypeChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="profile-mini-header" style={{ marginBottom: 8 }}>
            <div className="avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.userName} />
              ) : (
                <span>{(user?.userName || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="user-name">{user?.userName || "Creator"}</div>
              <div className="small-muted">Ready to share</div>
            </div>
          </div>

          <div className="input-wrap">
            <textarea
              rows="5"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder={mediaType === "reel" ? "Write a caption for your reel..." : "Write a caption..."}
            />
          </div>

          <div className="input-wrap">
            <input
              type="file"
              accept={mediaType === "reel" ? "video/*" : "image/*"}
              onChange={handleMediaChange}
            />
          </div>

          {preview ? (
            mediaType === "reel" ? (
              <video className="image-preview" src={preview} controls playsInline />
            ) : (
              <img className="image-preview" src={preview} alt="Preview" />
            )
          ) : null}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Uploading..." : mediaType === "post" ? "Share post" : mediaType === "story" ? "Share story" : "Upload reel"}
            </button>
            <button className="ghost-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
