<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$videoId = $_POST['video_id'] ?? '';

if ($videoId) {
    $stmt = $conn->prepare("DELETE FROM youtube_videos WHERE video_id = ?");
    $stmt->bind_param("s", $videoId);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Invalid video_id"]);
}

$conn->close();
?>
