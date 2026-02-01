"use client";
import { useEffect } from "react";
import Script from "next/script";
import "./globals.css";

export default function Home() {
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    $.ajax({
      url: "http://localhost/backend/get_videos.php",
      method: "GET",
      dataType: "json",
      success: function (data) {
        const tbody = $("tbody");
        tbody.empty();
        data.forEach((v: any) => {
          const row = $(`
            <tr data-video-id="${v.video_id}">
              <td class="title">${v.title}</td>
              <td class="views">${Number(v.views).toLocaleString()}</td>
              <td class="likes">${Number(v.likes).toLocaleString()}</td>
              <td class="comments">${Number(v.comments).toLocaleString()}</td>
              <td>
                <button class="delete-btn">Delete</button>
              </td>
            </tr>
          `);
          tbody.append(row);
        });

        attachEvents(); // attach hover & delete events
      },
    });
  };

  const attachEvents = () => {
    const intervals: { [key: string]: number } = {};

    $("tbody tr").hover(
      function () {
        const row = $(this);
        const videoId = row.data("video-id") as string;

        updateRow(row, videoId); // immediate update

        intervals[videoId] = window.setInterval(() => updateRow(row, videoId), 10000);
      },
      function () {
        const videoId = $(this).data("video-id") as string;
        clearInterval(intervals[videoId]);
        delete intervals[videoId];
      }
    );

    $(".delete-btn").off("click").on("click", function () {
      const row = $(this).closest("tr");
      const videoId = row.data("video-id") as string;
      const fd = new FormData();
      fd.append("video_id", videoId);

      $.ajax({
        url: "http://localhost/backend/delete_video.php",
        method: "POST",
        data: fd,
        processData: false,
        contentType: false,
        success: () => {
          row.remove();
        },
      });
    });
  };

  const updateRow = (row: JQuery<HTMLElement>, videoId: string) => {
    const fd = new FormData();
    fd.append("video_id", videoId);

    $.ajax({
      url: "http://localhost/backend/fetch_youtube.php",
      method: "POST",
      data: fd,
      processData: false,
      contentType: false,
      success: function (res: any) {
        row.find(".views").text(Number(res.views).toLocaleString());
        row.find(".likes").text(Number(res.likes).toLocaleString());
        row.find(".comments").text(Number(res.comments).toLocaleString());
      },
    });
  };

  const addVideo = () => {
    const videoId = $("#video-id-input").val() as string;
    if (!videoId) return;

    const fd = new FormData();
    fd.append("video_id", videoId);

    $.ajax({
      url: "http://localhost/backend/fetch_youtube.php",
      method: "POST",
      data: fd,
      processData: false,
      contentType: false,
      success: () => {
        $("#video-id-input").val("");
        fetchVideos();
      },
    });
  };

  return (
    <main>
      <Script src="https://code.jquery.com/jquery-3.7.0.min.js" strategy="beforeInteractive" />

      <div className="container">
        <h1>📊 Videos Dashboard</h1>

        <div className="input-group">
          <input type="text" id="video-id-input" placeholder="Enter YouTube Video ID" />
          <button onClick={addVideo}>Import Video</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <section style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h2>How to Use This Dashboard</h2>
          <ol>
            <li><strong>Import a Video:</strong> Enter the YouTube video ID and click <em>Import Video</em>.</li>
            <li><strong>View Video Stats:</strong> Table shows video title, views, likes, comments.</li>
            <li><strong>Live Updates on Hover:</strong> Hover a row to update stats every 10 seconds.</li>
            <li><strong>Delete a Video:</strong> Click <em>Delete</em> to remove it from the table and backend.</li>
            <li><strong>Number Formatting:</strong> All numbers are formatted with commas.</li>
            <li><strong>Refreshing:</strong> Reload page to see the latest backend data.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
