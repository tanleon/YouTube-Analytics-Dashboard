<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include "db.php";

$apiKey = ""; 
$videoId = $_POST['video_id'] ?? '';

if (!$videoId) {
    echo json_encode(["error" => "No video ID provided"]);
    exit;
}

// Fetch video data from YouTube API
$url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=$videoId&key=$apiKey";
$response = file_get_contents($url);

if (!$response) {
    echo json_encode(["error" => "Failed to fetch from YouTube API"]);
    exit;
}

$data = json_decode($response, true);

if (empty($data['items'])) {
    echo json_encode(["error" => "Invalid or private video"]);
    exit;
}

// Extract video info
$v = $data['items'][0];
$title = $v['snippet']['title'];
$views = (int)($v['statistics']['viewCount'] ?? 0);
$likes = (int)($v['statistics']['likeCount'] ?? 0);
$comments = (int)($v['statistics']['commentCount'] ?? 0);

// Check if video already exists
$stmt = $conn->prepare("SELECT id FROM youtube_videos WHERE video_id = ?");
$stmt->bind_param("s", $videoId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Video exists → update stats
    $stmt->close();
    $update = $conn->prepare(
        "UPDATE youtube_videos SET title = ?, views = ?, likes = ?, comments = ? WHERE video_id = ?"
    );
    $update->bind_param("siiis", $title, $views, $likes, $comments, $videoId);
    $update->execute();
    $update->close();
} else {
    // Video does not exist → insert new row
    $stmt->close();
    $insert = $conn->prepare(
        "INSERT INTO youtube_videos (video_id, title, views, likes, comments) VALUES (?, ?, ?, ?, ?)"
    );
    $insert->bind_param("ssiii", $videoId, $title, $views, $likes, $comments);
    $insert->execute();
    $insert->close();
}

// Return live stats JSON for frontend row update
echo json_encode([
    "video_id" => $videoId,
    "title" => $title,
    "views" => $views,
    "likes" => $likes,
    "comments" => $comments
]);

$conn->close();
?>
