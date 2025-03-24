module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "html, body, #root": {
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
        },
      });
    },
  ],
};
