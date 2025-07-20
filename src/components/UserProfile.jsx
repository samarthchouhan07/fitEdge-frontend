import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "./ui/label";
import {
  Camera,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Target,
  Trophy,
  Twitter,
  User,
  X,
} from "lucide-react";

const getAvatarColor = (email) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
};

export const UserProfile = () => {
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    memberSince: "",
    targets: [],
    achievements: [],
    socialMedia: { instagram: "", twitter: "", facebook: "" },
    profileImage: "",
    coverImage: "",
    role: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handlekeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handlekeyDown);
    return () => window.removeEventListener("keydown", handlekeyDown);
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Please login to access this profile");
      setIsLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        console.log("Error fetching profile:", error);
        toast.error("Error fetching profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="animate-spin text-blue-600">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      </div>
    );
  }
  console.log("profileData:", profileData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.name || "User"}'s Profile
                </h1>
                <p>View {profileData.name || "user"}'s gym community profile</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Images
            </h2>
            <div className="space-y-6">
              <div>
                <Label
                  className={"block text-sm font-medium text-gray-700 mb-2"}
                >
                  Cover Photo
                </Label>
                <div className="relative">
                  <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {profileData.coverImage ? (
                      <img
                        src={profileData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-contain rounded-lg"
                        onClick={() => setSelectedImage(profileData.coverImage)}
                      />
                    ) : (
                      <div className="text-white text-center">
                        <Camera className="mx-auto mb-2" size={24} />
                        <p className="text-sm">No Cover photo</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="relative inline-block">
                  <div className="size-24 rounded-full flex items-center justify-center">
                    {profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="size-full object-cover rounded-full"
                        onClick={() =>
                          setSelectedImage(profileData.profileImage)
                        }
                      />
                    ) : (
                      <div
                        className={`size-24 rounded-full flex items-center justify-center text-white text-2xl font-medium ${getAvatarColor(
                          profileData.email
                        )}`}
                      >
                        {profileData.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full h-[90vh] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full-screen"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Close full-screen image"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={profileData.phone}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Gym
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={profileData.location}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                disabled
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="No bio available"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Social Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={profileData.socialMedia.instagram}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="@username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={profileData.socialMedia.twitter}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="@username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <div className="relative">
                  <Facebook
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={profileData.socialMedia.facebook}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Profile name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Targets</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.targets.length > 0 ? (
                profileData.targets.map((target, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <Target size={14} />
                    {target}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No Targets set</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Achievements
              </h2>
            </div>
            <div className="space-y-2">
              {profileData.achievements.length > 0 ? (
                profileData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-600" />
                      <span className="text-yellow-800">{achievement}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No Achievements set</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
