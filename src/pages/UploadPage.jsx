import { useState } from "react";
import Button from "../components/Button";
import { useSession } from "../contexts/SessionContext";
import OverlayLoading from "../components/OverlayLoading";
import ColorPicker from "../components/ColorPicker";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState(undefined);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [textColor, setTextColor] = useState("#ffffffe6");
  const [backgroudnColor, setBackgroundColor] = useState("#00000061");
  const { upload } = useSession();


  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const randomString = () => {
    return Array.from({ length: 20 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return alert("Chọn file ảnh hợp lệ");

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      const maxW = 500, maxH = 500;
      if (width > maxW) {
        height = (height * maxW) / width;
        width = maxW;
      }
      if (height > maxH) {
        width = (width * maxH) / height;
        height = maxH;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return alert("Không xử lý được ảnh");

        const newFile = new File([blob], `${randomString()}.webp`, {
          type: "image/webp",
          lastModified: Date.now()
        });

        setImage(newFile);
        setPreviewUrl(URL.createObjectURL(newFile));
      }, "image/webp", 0.85);
    };

    reader.readAsDataURL(file);
  };


  const handleUpload = async () => {
    setIsLoading(true);
    console.log("textColor", textColor);
    console.log("backgroudnColor", backgroudnColor);
    await upload(image, caption, textColor, backgroudnColor);
    setIsLoading(false);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src="https://play-lh.googleusercontent.com/eRZLg00mAQGayCrFjDBklPIpW3qFHcmUs8PUQA4z7hVe-cDKMcRqecVHONAIexJGJZM"
            alt="Locket Logo"
            className="w-[50px] rounded-lg"
          />
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            Locket Uploader
          </h1>
        </div>


        <div className="mb-3">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Image
          </label>
          <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-lg transition-all block text-center">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {previewUrl && (
          <div className="mb-3 relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-white/10"
            />
            {caption && (
              <div
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-sfpro px-3 py-1 rounded-[20px] text-sm max-w-[90%] max-h-24 overflow-auto break-words whitespace-normal"
                style={{
                  color: textColor,
                  backgroundColor: backgroudnColor,
                }}
              >
                {caption}
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={handleCaptionChange}
            className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            rows="2"
            placeholder="Write a caption..."
          ></textarea>
        </div>
        <div className="flex gap-8 mb-5 ml-2">
          <div className="flex flex-col flex-1">
            <span className="block text-sm font-medium text-white/70 mb-1">Text color</span>
            <ColorPicker color={textColor} onChange={(newValue) => setTextColor(newValue)} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="block text-sm font-medium text-white/70 mb-1">Background color</span>
            <ColorPicker color={backgroudnColor} onChange={(newValue) => setBackgroundColor(newValue)} />
          </div>
        </div>


        <Button title="Upload" onClick={handleUpload} />

        <button
          onClick={goBackToLogin}
          className="mt-2 w-full py-2 px-4 rounded-xl bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-100 font-semibold"
        >
          Back to Login
        </button>
      </div>

      <div className="mt-4 text-sm text-white/70 flex items-center justify-center space-x-2 font-mono italic hover:text-yellow-400 transition-colors duration-300 cursor-default select-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.333 2-4 2-4 5h8c0-3-2.667-3-4-5z" />
        </svg>
        <p>Made by <span className="font-bold text-yellow-400">FatProVip</span></p>
      </div>

      {
        isLoading && <OverlayLoading />
      }

    </div>
  );
};

export default UploadPage;
