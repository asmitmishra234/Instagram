import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../auth/services/auth.api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    profileImage: "",
    bio:"",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await registerUser(formData);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="phone-mockup">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="mockup-topbar">
                <span>9:41</span>
                <span>Time-Waste</span>
              </div>
              <div className="mockup-feed">
                <div className="mockup-story-row">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div className="story-dot" key={idx} />
                  ))}
                </div>
                <div className="mockup-post">
                  <div className="mockup-post-header">
                    <div className="story-dot" style={{ width: 26, height: 26 }} />
                    <strong>Time-Waste</strong>
                  </div>
                  <div className="mockup-post-image" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="brand">Time-waste</div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-wrap">
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrap">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrap">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrap">
              <input
                type="url"
                name="profileImage"
                placeholder="Profile image URL (optional)"
                value={formData.profileImage}
                onChange={handleChange}
              />
            </div>
                 <div className="input-wrap">
              <input
                type="text"
                name="bio"
                placeholder="Profile-Bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

          

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="auth-divider"><span>Or</span></div>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;