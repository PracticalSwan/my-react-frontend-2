import { useUser } from "../contexts/UserProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import { ALERT_MESSAGES } from "../lib/constants";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function Profile() {

  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({ firstname: "", lastname: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const hasImage = Boolean(data.profileImage);

  function onNameChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSaveProfile() {
    const firstname = formData.firstname.trim();
    const lastname = formData.lastname.trim();

    if (!firstname || !lastname) {
      alert(ALERT_MESSAGES.PROFILE_UPDATE_FAILED);
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstname, lastname }),
        credentials: "include"
      });

      if (!response.ok) {
        alert(ALERT_MESSAGES.PROFILE_UPDATE_FAILED);
        return;
      }

      alert(ALERT_MESSAGES.PROFILE_UPDATE_SUCCESS);
      await fetchProfile();
    } catch {
      alert(ALERT_MESSAGES.PROFILE_UPDATE_FAILED);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert(ALERT_MESSAGES.NO_FILE_SELECTED);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert(ALERT_MESSAGES.ONLY_IMAGE_ALLOWED);
      return;
    }

    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (response.ok) {
        alert(ALERT_MESSAGES.IMAGE_UPDATE_SUCCESS);
        fileInputRef.current.value = "";
        await fetchProfile();
      } else {
        alert(ALERT_MESSAGES.IMAGE_UPDATE_FAILED);
      }
    } catch {
      alert(ALERT_MESSAGES.UPLOAD_ERROR);
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function onDeleteImage() {
    if (!hasImage) {
      return;
    }

    setIsDeletingImage(true);
    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        alert(ALERT_MESSAGES.IMAGE_DELETE_FAILED);
        return;
      }

      alert(ALERT_MESSAGES.IMAGE_DELETE_SUCCESS);
      await fetchProfile();
    } catch {
      alert(ALERT_MESSAGES.IMAGE_DELETE_FAILED);
    } finally {
      setIsDeletingImage(false);
    }
  }

  const fetchProfile = useCallback(async () => {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      if (result.status === 401) {
        logout();
        return;
      }

      if (!result.ok) {
        setIsLoading(false);
        return;
      }

      const data = await result.json();
      setIsLoading(false);
      setData(data);
      setFormData({
        firstname: data.firstname || "",
        lastname: data.lastname || ""
      });
    } catch (error) {
      console.error("Fetch profile error:", error);
      setIsLoading(false);
    }
  }, [API_URL, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="profile-container">
      <h3 className="profile-title">Your Profile</h3>
      <div className="profile-card">
        {isLoading ? (
          <div className="loading-spinner">Loading profile...</div>
        ) : (
          <div>
            <div className="profile-image-section">
                {hasImage ? (
                    <img
                        src={`${API_URL}${data.profileImage}`}
                        alt="Profile"
                    data-testid="profile-image"
                        className="profile-img"
                    />
                ) : (
                    <div className="profile-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem' }}>
                        <span>📷</span>
                    </div>
                )}

                <div className="image-actions">
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      data-testid="profile-image-input"
                        ref={fileInputRef}
                        className="file-input"
                    />
                    
                    <div className="image-buttons">
                        <button 
                            className="btn btn-secondary" 
                          data-testid="upload-profile-image"
                            onClick={onUpdateImage} 
                            disabled={isUploadingImage}
                        >
                            {isUploadingImage ? "Uploading..." : "Upload New Photo"}
                        </button>
                        
                        <button 
                            className="btn btn-danger" 
                          data-testid="remove-profile-image"
                            onClick={onDeleteImage} 
                            disabled={isDeletingImage || !hasImage}
                        >
                            {isDeletingImage ? "Removing..." : "Remove Photo"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            <div className="info-group">
                <span className="info-label">User ID</span>
              <span className="info-value" data-testid="profile-id">{data._id}</span>
            </div>
            
            <div className="info-group">
                <span className="info-label">Email</span>
              <span className="info-value" data-testid="profile-email">{data.email}</span>
            </div>

            <div className="section-divider"></div>

            <div className="form-group">
              <label className="info-label" style={{ marginBottom: '0.5rem', display: 'block' }}>First Name</label>
              <input
                type="text"
                name="firstname"
                data-testid="profile-firstname"
                className="form-input"
                placeholder="Enter first name"
                value={formData.firstname}
                onChange={onNameChange}
              />
            </div>
            
            <div className="form-group">
            <label className="info-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Last Name</label>
              <input
                type="text"
                name="lastname"
                data-testid="profile-lastname"
                className="form-input"
                placeholder="Enter last name"
                value={formData.lastname}
                onChange={onNameChange}
              />
            </div>

            <button 
              className="btn btn-primary" 
              data-testid="save-profile"
              onClick={onSaveProfile} 
              disabled={isSavingProfile}
              style={{ width: '100%' }}
            >
              {isSavingProfile ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
