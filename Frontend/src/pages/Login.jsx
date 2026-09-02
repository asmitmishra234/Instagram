import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/ContextApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await login(formData);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed.");
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

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="auth-divider"><span>Or</span></div>

          <div className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;