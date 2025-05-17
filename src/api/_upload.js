import axios from "axios";

// const key = "AIzaSyB5dTd-xiLD5dEfWq5OpptnQtnMpE0W0u8";

function getAccessToken() {
    return localStorage.getItem("idToken");
}

function getUrl() {
    const localId = localStorage.getItem("localId");
    return `https://firebasestorage.googleapis.com/v0/b/locket-img/o?name=users%2F${localId}%2Fmoments%2Fthumbnails%2F`
}

function getUploadUrl() {
    const localId = localStorage.getItem("localId");
    return `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${localId}%2Fmoments%2Fthumbnails%2F`
}

async function getUploadId(fileName) {
    try {
        // console.log("Getting upload ID for file:", fileName);
        const data = {
            "contentType": "image/webp",
            "cacheControl": "public, max-age=604800"
        }
        const response = await axios.post(`${getUrl()}${fileName}&uploadType=resumable`, data, {
            headers: {
                "Authorization": `Firebase ${getAccessToken()}`,
                "X-Firebase-Storage-Version": "Android/21.0.1",
                "X-Goog-Upload-Command": "start",
                "X-Goog-Upload-Header-Content-Type": "image/webp",
                "X-Goog-Upload-Protocol": "resumable",
                "x-firebase-gmpid": "1:641029076083:android:eac8183b796b856d4fa606",
                "x-firebase-appcheck": "eyJlcnJvciI6IlVOS05PV05fRVJST1IifQ=="
            }
        })

        console.log("Upload ID response:", response.headers);

        return {
            uploadUrl: response.headers["x-goog-upload-url"]
        };
    }
    catch (error) {
        console.error("Error getting upload ID:", error);
        return null;
    }
}
async function uploadImageToFirebaseBucket(image) {
    try {
        const data = await getUploadId(image.name);
        const uploadUrl = data.uploadUrl;

        const response = await axios.post(uploadUrl, image, {
            headers: {
                "Authorization": `Firebase ${getAccessToken()}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Goog-Upload-Command": "upload, finalize",
                "X-Goog-Upload-Offset": 0
            }
        })

        console.log("Upload response:", response.data);

        return {
            downloadToken: response.data.downloadTokens
        }
    }
    catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}


export async function upload(image, caption, textColor, backgroudColor) {
    try {
        const uptoBucket = await uploadImageToFirebaseBucket(image);
        const downloadToken = uptoBucket.downloadToken;

        const data = {
            data: {
            analytics: {
                amplitude: {
                    device_id: "6ed7e691-64d8-4a08-bb0e-34dad84a1eabR",
                    session_id: 1747406039186
                },
                experiments: {
                    android_flag_2: 200,
                    android_flag_1: 303,
                    android_flag_9: 0,
                    android_flag_8: 0,
                    android_flag_7: 0,
                    android_flag_6: 0,
                    android_flag_5: 0,
                    android_flag_4: 0,
                    android_flag_10: 0,
                    android_flag_3: 0
                },
                google_analytics: {
                    app_instance_id: "faaaa125587933ca539e3e8c9eac95ce"
                },
                android_version: "1.195.2",
                android_build: "387",
                platform: "android"
            },
            recipients: [],
            overlays: [
                {
                    overlay_id: "caption:standard",
                    overlay_type: "caption",
                    data: {
                        text_color: textColor,
                        text: caption,
                        type: "standard",
                        max_lines: 4,
                        background: {
                            colors: [backgroudColor],
                            material_blur: "thin"
                        }
                    },
                    alt_text: caption
                }
            ],
            "update_streak_for_yyyymmdd": 20250516,
            caption: caption,
            thumbnail_url: `${getUploadUrl()}${image.name}?alt=media&token=${downloadToken}`,
            md5: ""
            }
        };

        console.log("Thumbnail URL:", data.data.thumbnail_url);

        const response = await axios.post("https://api.locketcamera.com/postMomentV2", data, {
            headers: {
                "Authorization" : `Bearer ${getAccessToken()}`,
            }
        });

        console.log("Upload response:", response.data);
        return {
            success: true,
            data: response.data
        };
    }
    catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

