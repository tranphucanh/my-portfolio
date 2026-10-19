/* Nội dung trang chúc 20/10 – sửa tại đây */
import type { Member } from "@/components/it-mwg/TeamScene";

export const MESSAGE =
  "Nhân ngày Phụ nữ Việt Nam 20/10, em xin gửi đến các chị em lời chúc tốt đẹp nhất. Cảm ơn các chị em đã luôn đồng hành, chu đáo và tận tâm, mang đến cho cả team thật nhiều niềm vui và năng lượng tích cực mỗi ngày. Chúc các chị em luôn xinh đẹp, rạng rỡ, mạnh khoẻ, hạnh phúc, lúc nào cũng vui vẻ và công việc luôn thuận lợi, suôn sẻ!";

/* 5 nhân vật 3D: chạm vào từng người để hiện lời chúc */
export const MEMBERS: Member[] = [
  {
    look: {
      outfit: "hoodie",
      hair: "long",
      colors: {
        hoodie: "#b794f4",
        hoodieTrim: "#f3e8ff",
        hair: "#2b1a14",
        pants: "#4c3a73",
        sole: "#b794f4",
        accent: "#ff8fab",
      },
    },
    prop: "none",
    wish: "Luôn xinh đẹp & rạng rỡ ✨",
    desktop: [-3.2, -0.35],
    mobile: [-1.3, 0.6],
  },
  {
    look: {
      outfit: "hoodie",
      hair: "bun",
      colors: {
        hoodie: "#5ec8b0",
        hoodieTrim: "#e6fffa",
        hair: "#5a3825",
        pants: "#2f5d62",
        sole: "#5ec8b0",
        accent: "#ffd166",
      },
    },
    prop: "laptop",
    wish: "Công việc thuận lợi, suôn sẻ 🌟",
    desktop: [-1.6, 0],
    mobile: [-0.7, -1.6, 0.9],
  },
  {
    look: {
      outfit: "aodai",
      hair: "long",
      colors: {
        hoodie: "#ff6b9a",
        hoodieTrim: "#fff4e0",
        hair: "#1f120c",
        pants: "#ffffff",
        shoe: "#f2c14e",
        sole: "#c08a1e",
        accent: "#ffffff",
      },
    },
    prop: "bouquet",
    wish: "Happy 20/10 – hạnh phúc ngập tràn 💐",
    desktop: [0, 0.2],
    mobile: [0, 0.7],
  },
  {
    look: {
      outfit: "hoodie",
      hair: "long",
      colors: {
        hoodie: "#ffc857",
        hoodieTrim: "#fff8e1",
        hair: "#7a3e2a",
        pants: "#6b4f2a",
        sole: "#ff9f1c",
        accent: "#ff6b9a",
      },
    },
    prop: "cup",
    wish: "Cà phê thơm, deadline nhẹ tênh ☕",
    desktop: [1.6, 0],
    mobile: [0.7, -1.6, 0.9],
  },
  {
    look: {
      outfit: "hoodie",
      hair: "bun",
      colors: {
        hoodie: "#6fb7ff",
        hoodieTrim: "#e8f4ff",
        hair: "#24140e",
        pants: "#2c4a7a",
        sole: "#6fb7ff",
        accent: "#ff8fab",
      },
    },
    prop: "balloon",
    wish: "Lương thưởng tăng vèo vèo 💰",
    desktop: [3.2, -0.35],
    mobile: [1.3, 0.6],
  },
];

export const WISHES = [
  {
    icon: "🌸",
    title: "Luôn xinh đẹp",
    desc: "Mỗi ngày đến công ty đều rạng rỡ như những bông hoa đẹp nhất.",
  },
  {
    icon: "💪",
    title: "Dồi dào sức khoẻ",
    desc: "Đủ năng lượng cho công việc, gia đình và cả những chuyến đi chơi.",
  },
  {
    icon: "🚀",
    title: "Công việc hanh thông",
    desc: "Task nào cũng suôn sẻ, dự án nào cũng về đích đúng hẹn.",
  },
  {
    icon: "💰",
    title: "Thu nhập thăng hạng",
    desc: "Lương thưởng tăng đều đặn, ví lúc nào cũng đầy.",
  },
  {
    icon: "☕",
    title: "Ngày nào cũng vui",
    desc: "Giờ làm việc luôn có tiếng cười, cà phê ngon và đồng đội dễ thương.",
  },
  {
    icon: "🏡",
    title: "Hạnh phúc trọn vẹn",
    desc: "Công việc thành công, gia đình êm ấm, cân bằng tuyệt đối.",
  },
];
