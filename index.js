const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Server tin tức đang chạy 🚀");
});

app.get("/news", async (req, res) => {
  try {
    const url = "https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 20000
    });

    const html = response.data;

    const news = [];

    const regex = /<a[^>]+href="([^"]*\/news\/-\/details\/[^"]+)"[^>]*>(.*?)<\/a>/gi;

    let match;
    while ((match = regex.exec(html)) !== null && news.length < 5) {
      let link = match[1];
      let title = match[2].replace(/<[^>]+>/g, "").trim();

      if (link.startsWith("/")) {
        link = "https://tulan.bacninh.gov.vn" + link;
      }

      if (title.length > 10) {
        news.push({ title, link });
      }
    }

    if (news.length === 0) {
      return res.json({
        success: false,
        message: "Không lấy được tin",
        html_preview: html.substring(0, 1000)
      });
    }

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
